import cv2
import numpy as np
import base64
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO

app = FastAPI(title="YOLO Proctoring Service")

# Allow CORS for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load lightweight YOLOv8-Nano model
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "yolov8n.pt")
print(f"Loading YOLOv8-Nano model from {model_path}...")
model = YOLO(model_path if os.path.exists(model_path) else "yolov8n.pt")
print("YOLOv8-Nano model loaded successfully.")

@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "YOLO Proctoring AI", "version": "v8n"}

@app.websocket("/ws/proctor")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("Proctor client connected to YOLO WebSocket")
    try:
        while True:
            # Receive frame payload
            data = await websocket.receive_json()
            image_data = data.get("image")
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

            # Run inference using YOLOv8 with high sensitivity (conf=0.10)
            results = model(frame, conf=0.10, verbose=False)[0]

            phone_detected = False
            detected_object = ""
            highest_conf = 0.0

            for box in results.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])
                class_name = str(model.names[class_id]).lower()

                # High-sensitivity detection for mobile phone and forbidden exam objects
                is_phone = "phone" in class_name or "cell" in class_name or "mobile" in class_name or class_id == 67
                is_forbidden = is_phone or any(f in class_name for f in ["laptop", "book", "remote", "calculator", "tablet", "headphone", "earphone", "backpack", "watch", "mouse", "electronic"]) or class_id in [63, 64, 65, 66, 67, 73]

                min_thresh = 0.12 if is_phone else 0.18

                if is_forbidden and confidence > min_thresh:
                    phone_detected = True
                    detected_object = class_name
                    highest_conf = confidence
                    print(f"🚨 DETECTED FORBIDDEN OBJECT: {class_name} ({confidence*100:.1f}%)")
                    break

            # Send detection logs back to frontend client
            await websocket.send_json({
                "detected": phone_detected,
                "object": detected_object if phone_detected else "",
                "confidence": round(highest_conf, 3),
                "message": "UNAUTHORIZED OBJECT DETECTED!!!" if phone_detected else "NORMAL"
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
