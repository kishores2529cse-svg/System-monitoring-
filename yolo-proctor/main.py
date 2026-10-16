import os
import sys
import io
import time
import threading
import urllib.request
from datetime import datetime

# Ensure UTF-8 output on Windows consoles to prevent emoji-related charmap crashes
if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass

import cv2
import numpy as np
import base64
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError:
    DeepFace = None  # type: ignore
    DEEPFACE_AVAILABLE = False
    print("WARNING: deepface library not found. Run `pip install deepface` to enable real-time Impersonation detection.")

app = FastAPI(title="YOLO Proctoring Service")

# Allow CORS for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Reference Photos Directory (Master Candidate Photos)
REFERENCE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reference_photos")
os.makedirs(REFERENCE_DIR, exist_ok=True)

# Impersonator Photos Directory (Evidence of caught intruders)
IMPERSONATOR_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "impersonator_photos")
os.makedirs(IMPERSONATOR_DIR, exist_ok=True)

# Supabase Storage Configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://wdtshwffstjzfclwsqox.supabase.co").rstrip("/")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get(
    "SUPABASE_SERVICE_ROLE_KEY", 
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdHNod2Zmc3RqemZjbHdzcW94Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDczMDI0NywiZXhwIjoyMTAwMzA2MjQ3fQ.BFH6u2HphSTZdsnVSRaki0mFCb89T9dlMfcLx465AHM"
)

def upload_to_supabase(bucket: str, path: str, image_bytes: bytes, content_type: str = "image/jpeg"):
    """Synchronously upload an image to Supabase Storage."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        return None
    url = f"{SUPABASE_URL}/storage/v1/object/{bucket}/{path}"
    req = urllib.request.Request(
        url,
        data=image_bytes,
        headers={
            "Content-Type": content_type,
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "x-upsert": "true"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in (200, 201):
                return f"{SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}"
    except Exception as e:
        print(f"⚠️ Supabase upload notice ({bucket}/{path}): {e}")
    return None

def upload_to_supabase_async(bucket: str, path: str, image_bytes: bytes):
    """Fire and forget non-blocking upload to Supabase Storage."""
    t = threading.Thread(target=upload_to_supabase, args=(bucket, path, image_bytes), daemon=True)
    t.start()

# Load lightweight YOLOv8-Nano model
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "yolov8n.pt")
print(f"Loading YOLOv8-Nano model from {model_path}...")
model = YOLO(model_path if os.path.exists(model_path) else "yolov8n.pt")
print("YOLOv8-Nano model loaded successfully.")

# Pre-warm SFace model at startup
if DEEPFACE_AVAILABLE and DeepFace is not None:
    try:
        dummy = np.zeros((160, 160, 3), dtype=np.uint8)
        DeepFace.represent(dummy, model_name="SFace", detector_backend="skip", enforce_detection=False)
        print("✅ DeepFace SFace model pre-warmed successfully.")
    except Exception as e:
        print(f"DeepFace pre-warm notice: {e}")

@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "YOLO Proctoring AI", "version": "v8n"}

from pydantic import BaseModel

class MasterPhotoPayload(BaseModel):
    email: str
    image: str

@app.post("/api/register-master-photo")
def register_master_photo(payload: MasterPhotoPayload):
    try:
        clean_email = payload.email.strip().lower()
        img_b64 = payload.image
        if "," in img_b64:
            img_b64 = img_b64.split(",")[1]
        img_bytes = base64.b64decode(img_b64)
        nparr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if frame is None:
            return {"status": "error", "message": "Failed to decode image"}
        
        target_path = os.path.join(REFERENCE_DIR, f"{clean_email}.jpg")
        cv2.imwrite(target_path, frame)
        print(f"📸 Master photo registered for {clean_email} -> {target_path}")

        # Store master photo in Supabase Storage master-photos bucket
        supabase_path = f"{clean_email}.jpg"
        upload_to_supabase_async("master-photos", supabase_path, img_bytes)
        print(f"☁️ Master photo queued for upload to Supabase master-photos/{supabase_path}")

        return {
            "status": "ok", 
            "message": f"Master photo saved for {clean_email}",
            "supabase_url": f"{SUPABASE_URL}/storage/v1/object/public/master-photos/{supabase_path}"
        }
    except Exception as e:
        print(f"Error saving master photo: {e}")
        return {"status": "error", "message": str(e)}

@app.websocket("/ws/proctor")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Extract email from query params if available
    client_email = websocket.query_params.get("email", "kishores25cs@srishakthi.ac.in")
    print(f"🔌 Proctor client connected to YOLO WebSocket (email: {client_email})")
    
    # Resolve registered master photo for candidate with robust fallback across known student references
    master_frame = None
    ref_file = os.path.join(REFERENCE_DIR, f"{client_email}.jpg")
    default_ref = os.path.join(REFERENCE_DIR, "default_master.jpg")

    def load_candidate_reference(email_key: str):
        target_f = os.path.join(REFERENCE_DIR, f"{email_key}.jpg")
        if os.path.exists(target_f):
            return cv2.imread(target_f)
        try:
            supabase_url = f"{SUPABASE_URL}/storage/v1/object/public/master-photos/{email_key}.jpg"
            req = urllib.request.Request(supabase_url, headers={"apikey": SUPABASE_SERVICE_ROLE_KEY, "User-Agent": "python"})
            with urllib.request.urlopen(req, timeout=3) as resp:
                if resp.status == 200:
                    s_bytes = resp.read()
                    s_arr = np.frombuffer(s_bytes, np.uint8)
                    m = cv2.imdecode(s_arr, cv2.IMREAD_COLOR)
                    if m is not None:
                        cv2.imwrite(target_f, m)
                        return m
        except Exception:
            pass
        return None

    master_frame = load_candidate_reference(client_email)
    if master_frame is not None:
        print(f"✅ Loaded registered master photo for {client_email}.")
    else:
        # Fallback to registered students if email prefix matches or default to first valid master photo in folder
        print(f"⚠️ No photo found for {client_email}, searching available student reference photos...")
        for student_f in os.listdir(REFERENCE_DIR):
            if student_f.endswith(".jpg") and not student_f.startswith("default_") and not student_f.startswith("impersonator_"):
                fallback_path = os.path.join(REFERENCE_DIR, student_f)
                master_frame = cv2.imread(fallback_path)
                if master_frame is not None:
                    print(f"🎯 Using authentic student reference [{student_f}] as security baseline.")
                    break

    frame_counter = 0
    impersonation_detected = False
    impersonation_mismatch_count = 0
    last_impersonator_save_time = 0.0
    latest_impersonator_snapshot = None
    
    # Persistent Tracking & Seat-Swap State (ByteTrack tracking)
    candidate_track_id = None
    track_lost_time = None
    seat_swap_detected = False

    try:
        while True:
            # Receive frame payload
            data = await websocket.receive_json()
            image_data = data.get("image")
            frame_id = data.get("id")
            email_in_msg = data.get("email")

            if email_in_msg and email_in_msg != client_email:
                client_email = email_in_msg
                new_ref = load_candidate_reference(client_email)
                if new_ref is not None:
                    master_frame = new_ref
                    print(f"🔄 Switched master photo to candidate {client_email}.")

            # If client explicitly sends a registered master photo base64
            master_b64 = data.get("master_photo")
            if master_b64 and master_frame is None:
                try:
                    if "," in master_b64:
                        m_clean = master_b64.split(",")[1]
                    else:
                        m_clean = master_b64
                    m_bytes = base64.b64decode(m_clean)
                    m_arr = np.frombuffer(m_bytes, np.uint8)
                    master_frame = cv2.imdecode(m_arr, cv2.IMREAD_COLOR)
                    if master_frame is not None:
                        t_path = os.path.join(REFERENCE_DIR, f"{client_email}.jpg")
                        cv2.imwrite(t_path, master_frame)
                        upload_to_supabase_async("master-photos", f"{client_email}.jpg", m_bytes)
                        print(f"📸 Saved client master photo to disk and synced to Supabase: {t_path}")
                except Exception as e:
                    print(f"Error parsing client master photo: {e}")

            if not image_data:
                continue

            # Strip base64 headers if present
            if "," in image_data:
                image_data = image_data.split(",")[1]

            # Decode base64 string to OpenCV numpy array
            img_bytes = base64.b64decode(image_data)
            nparr = np.frombuffer(img_bytes, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if frame is None:
                continue

            frame_counter += 1

            # Run inference & tracking using YOLOv8 with ByteTrack persist=True
            try:
                results_list = model.track(frame, conf=0.25, persist=True, verbose=False)
                results = results_list[0]
            except Exception:
                results_list = model.predict(frame, conf=0.25, verbose=False)
                results = results_list[0]

            phone_detected = False
            detected_object = ""
            highest_conf = 0.0
            detected_bbox = None
            person_boxes = []
            h_frame, w_frame = frame.shape[:2]
            frame_area = float(h_frame * w_frame)
            active_track_ids = []

            for box in getattr(results, 'boxes', []):
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = model.names[class_id].lower()

                if "person" in class_name or class_id == 0:
                    bx1, by1, bx2, by2 = box.xyxy[0].tolist()
                    box_area = (bx2 - bx1) * (by2 - by1)
                    # Ignore tiny background slivers / screen reflections (< 5% of frame area)
                    if box_area >= (0.05 * frame_area) and confidence >= 0.45:
                        tr_id = int(box.id[0]) if (box.id is not None and len(box.id) > 0) else None
                        person_boxes.append((box_area, confidence, [bx1, by1, bx2, by2], tr_id))
                        if tr_id is not None:
                            active_track_ids.append(tr_id)

                # Robust detection for mobile phone and forbidden exam objects
                is_phone = "phone" in class_name or "cell" in class_name or "mobile" in class_name or class_id == 67
                is_forbidden = is_phone

                min_thresh = 0.30 if is_phone else 0.35

                if is_forbidden and confidence >= min_thresh and not phone_detected:
                    phone_detected = True
                    detected_object = class_name
                    highest_conf = confidence
                    bx1, by1, bx2, by2 = box.xyxy[0].tolist()
                    detected_bbox = {"x": bx1, "y": by1, "width": bx2 - bx1, "height": by2 - by1}
                    print(f"🚨 VERIFIED FORBIDDEN OBJECT: {class_name} ({confidence*100:.1f}%)")

            multiple_persons = len(person_boxes) >= 2
            zero_persons = len(person_boxes) == 0
            if multiple_persons:
                print(f"🚨 MULTIPLE PERSONS DETECTED: {len(person_boxes)} people in frame")

            # Tracking-based Seat-Swap Guard
            curr_now = time.time()
            if len(person_boxes) >= 1:
                # Find largest person in frame (primary seated candidate)
                person_boxes.sort(key=lambda x: x[0], reverse=True)
                primary_person = person_boxes[0]
                primary_tr_id = primary_person[3]

                if candidate_track_id is None and primary_tr_id is not None:
                    candidate_track_id = primary_tr_id
                    print(f"🎯 Assigned primary candidate tracking ID: #{candidate_track_id}")
                elif candidate_track_id is not None and primary_tr_id is not None:
                    # If person was away for > 3.0 seconds and re-enters with new/different ID -> Seat Swap Checkpoint
                    if track_lost_time is not None and (curr_now - track_lost_time) > 3.0 and primary_tr_id != candidate_track_id:
                        seat_swap_detected = True
                        print(f"💺 SEAT-SWAP DETECTED: Original track #{candidate_track_id} left for {curr_now - track_lost_time:.1f}s. New track #{primary_tr_id} entered.")
                        candidate_track_id = primary_tr_id
                track_lost_time = None
            else:
                if track_lost_time is None:
                    track_lost_time = curr_now

            # Impersonation Check (DeepFace SFace)
            # If no master photo was registered beforehand, fallback to capturing the first frame
            if master_frame is None and len(person_boxes) >= 1:
                master_frame = frame.copy()
                print("📸 No registered photo found; captured initial session frame as reference.")

            # Perform verification every 5 frames (~1 second at 5fps) or IMMEDIATELY on seat-swap
            should_verify = (frame_counter % 5 == 0 or seat_swap_detected) and len(person_boxes) >= 1
            if DEEPFACE_AVAILABLE and DeepFace is not None and master_frame is not None and should_verify:
                try:
                    res = DeepFace.verify(frame, master_frame, enforce_detection=False, model_name="SFace", detector_backend="skip")
                    is_verified = res.get("verified", True)
                    dist = res.get("distance", 0.0)
                    thresh = res.get("threshold", 0.593)

                    print(f"🔍 Face Check [{client_email}]: dist={dist:.3f} thresh={thresh:.3f} verified={is_verified}")

                    if not is_verified or dist > thresh or seat_swap_detected:
                        impersonation_mismatch_count += 1
                        print(f"⚠️ Impersonation Mismatch Count: {impersonation_mismatch_count}/2 (dist: {dist:.3f})")
                        if impersonation_mismatch_count >= 2 or seat_swap_detected:
                            impersonation_detected = True
                            print(f"🚨 IMPERSONATION DETECTED: Face does not match registered master photo! Distance: {dist:.3f} > {thresh:.3f}")

                            # Store impersonator's photo into dedicated yolo-proctor/impersonator_photos folder
                            current_time = time.time()
                            if current_time - last_impersonator_save_time >= 5.0:
                                last_impersonator_save_time = current_time
                                timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
                                safe_email = client_email.replace("@", "_at_").replace(".", "_")
                                impersonator_filename = f"impersonator_{safe_email}_{timestamp_str}.jpg"
                                impersonator_filepath = os.path.join(IMPERSONATOR_DIR, impersonator_filename)
                                cv2.imwrite(impersonator_filepath, frame)
                                print(f"📸 Stored impersonator photo to: {impersonator_filepath}")

                                # Generate base64 snapshot and asynchronously upload to Supabase malpractice-evidence
                                ret, enc_img = cv2.imencode(".jpg", frame)
                                if ret:
                                    raw_jpg = enc_img.tobytes()
                                    latest_impersonator_snapshot = "data:image/jpeg;base64," + base64.b64encode(raw_jpg).decode("utf-8")
                                    supabase_evidence_path = f"impersonators/{safe_email}/{impersonator_filename}"
                                    upload_to_supabase_async("malpractice-evidence", supabase_evidence_path, raw_jpg)
                                    print(f"☁️ Uploaded impersonator evidence to Supabase malpractice-evidence/{supabase_evidence_path}")
                        seat_swap_detected = False
                    else:
                        impersonation_mismatch_count = 0
                        impersonation_detected = False
                        seat_swap_detected = False
                except Exception as e:
                    print(f"DeepFace verification error: {e}")
                except Exception as e:
                    print(f"DeepFace verification error: {e}")

            # Send detection logs back to frontend client
            message = "NORMAL"
            if multiple_persons:
                message = "MULTIPLE PERSONS DETECTED"
            elif impersonation_detected:
                message = "IMPERSONATION DETECTED"
            elif phone_detected:
                message = "Unauthorized forbidden object detected Malpractice"

            await websocket.send_json({
                "id": frame_id,
                "detected": phone_detected,
                "multiple_persons": multiple_persons,
                "zero_persons": zero_persons,
                "impersonation": impersonation_detected,
                "impersonator_snapshot": latest_impersonator_snapshot if impersonation_detected else None,
                "object": detected_object if phone_detected else "",
                "confidence": round(highest_conf, 3),
                "bbox": detected_bbox if phone_detected else None,
                "message": message
            })

    except Exception as e:
        print(f"WebSocket proctoring error: {e}")
    finally:
        print("Proctor client disconnected from YOLO WebSocket")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8082))
    uvicorn.run(app, host="0.0.0.0", port=port)

