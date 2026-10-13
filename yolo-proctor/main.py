import os
import sys
import io

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

# Reference Photos Directory
REFERENCE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "reference_photos")
os.makedirs(REFERENCE_DIR, exist_ok=True)

# Load lightweight YOLOv8-Nano model
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "yolov8n.pt")
print(f"Loading YOLOv8-Nano model from {model_path}...")
model = YOLO(model_path if os.path.exists(model_path) else "yolov8n.pt")
print("YOLOv8-Nano model loaded successfully.")

# Pre-warm SFace model at startup
if DEEPFACE_AVAILABLE:
    try:
        dummy = np.zeros((160, 160, 3), dtype=np.uint8)
        DeepFace.represent(dummy, model_name="SFace", enforce_detection=False)
        print("✅ DeepFace SFace model pre-warmed successfully.")
    except Exception as e:
        print(f"DeepFace pre-warm notice: {e}")

@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "YOLO Proctoring AI", "version": "v8n"}

@app.websocket("/ws/proctor")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # Extract email from query params if available
    client_email = websocket.query_params.get("email", "kishores25cs@srishakthi.ac.in")
    print(f"🔌 Proctor client connected to YOLO WebSocket (email: {client_email})")
    
    # Try loading pre-registered master photo for candidate
    master_frame = None
    ref_file = os.path.join(REFERENCE_DIR, f"{client_email}.jpg")
    default_ref = os.path.join(REFERENCE_DIR, "default_master.jpg")
    
    if os.path.exists(ref_file):
        master_frame = cv2.imread(ref_file)
        print(f"✅ Loaded registered master photo for {client_email} from disk.")
    elif os.path.exists(default_ref):
        master_frame = cv2.imread(default_ref)
        print(f"✅ Loaded default master photo for session from disk.")
    
    frame_counter = 0
    impersonation_detected = False
    impersonation_mismatch_count = 0

    try:
        while True:
            # Receive frame payload
            data = await websocket.receive_json()
            image_data = data.get("image")
            frame_id = data.get("id")
            email_in_msg = data.get("email")

            if email_in_msg and email_in_msg != client_email:
                client_email = email_in_msg
                alt_ref = os.path.join(REFERENCE_DIR, f"{client_email}.jpg")
                if os.path.exists(alt_ref):
                    master_frame = cv2.imread(alt_ref)
                    print(f"🔄 Switched master photo to candidate {client_email}.")

            # If client explicitly sends a registered master photo base64
            master_b64 = data.get("master_photo")
            if master_b64 and master_frame is None:
                try:
                    if "," in master_b64:
                        master_b64 = master_b64.split(",")[1]
                    m_bytes = base64.b64decode(master_b64)
                    m_arr = np.frombuffer(m_bytes, np.uint8)
                    master_frame = cv2.imdecode(m_arr, cv2.IMREAD_COLOR)
                    print("📸 Received and saved registered master photo from client session.")
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

            # Run inference using YOLOv8 with lower confidence for faster detection
            results_list = model.predict(frame, conf=0.25, verbose=False)
            results = results_list[0]  # type: ignore

            phone_detected = False
            detected_object = ""
            highest_conf = 0.0
            detected_bbox = None
            person_count_low_conf = 0
            person_count_high_conf = 0

            for box in getattr(results, 'boxes', []):
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = model.names[class_id].lower()

                if "person" in class_name or class_id == 0:
                    if confidence >= 0.35:
                        person_count_low_conf += 1
                    if confidence >= 0.60:
                        person_count_high_conf += 1

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

            multiple_persons = person_count_high_conf >= 2
            zero_persons = person_count_low_conf == 0
            if multiple_persons:
                print(f"🚨 MULTIPLE PERSONS DETECTED: {person_count_high_conf} people (High Confidence)")

            # Impersonation Check (DeepFace SFace)
            # If no master photo was registered beforehand, fallback to capturing the first frame
            if master_frame is None and person_count_low_conf == 1:
                master_frame = frame.copy()
                print("📸 No registered photo found; captured initial session frame as reference.")

            # Perform verification every 15 frames (~0.75 - 1.0 second) when 1 person is present
            if DEEPFACE_AVAILABLE and master_frame is not None and frame_counter % 15 == 0 and person_count_low_conf >= 1:
                try:
                    res = DeepFace.verify(frame, master_frame, enforce_detection=False, model_name="SFace")
                    is_verified = res.get("verified", True)
                    dist = res.get("distance", 0.0)
                    thresh = res.get("threshold", 0.593)

                    if not is_verified or dist > thresh:
                        impersonation_mismatch_count += 1
                        if impersonation_mismatch_count >= 2:
                            impersonation_detected = True
                            print(f"🚨 IMPERSONATION DETECTED: Face does not match registered master photo! Distance: {dist:.3f} > {thresh:.3f}")
                    else:
                        impersonation_mismatch_count = 0
                        impersonation_detected = False
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

