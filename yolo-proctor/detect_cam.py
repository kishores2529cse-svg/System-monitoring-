import cv2
from ultralytics import YOLO

def main():
    print("=" * 60)
    print("  🚀 YOLOv8 Phone & Object Detection (OpenCV Live Camera)")
    print("=" * 60)
    import os
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "yolov8n.pt")
    print(f"Loading YOLOv8 model from {model_path}...")
    model = YOLO(model_path if os.path.exists(model_path) else "yolov8n.pt")
    print("YOLOv8 model loaded successfully.")
    print("Starting OpenCV Webcam stream (Press 'q' or ESC to quit)...")

    # Initialize webcam with DirectShow backend for Windows compatibility
    cap = None
    for backend in [cv2.CAP_DSHOW, cv2.CAP_MSMF, cv2.CAP_ANY]:
        for cam_idx in [0, 1, 2]:
            temp_cap = cv2.VideoCapture(cam_idx, backend)
            if temp_cap.isOpened():
                ret, test_frame = temp_cap.read()
                if ret and test_frame is not None:
                    cap = temp_cap
                    print(f"✅ Camera initialized successfully on index {cam_idx}.")
                    break
                temp_cap.release()
        if cap is not None:
            break

    if cap is None:
        print("❌ Error: Could not open webcam with DirectShow or MSMF. Please ensure camera permissions are allowed and no other app is locking the camera.")
        return

    # Set camera resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame from camera.")
            break

        # Run YOLOv8 detection
        results = model(frame, verbose=False)[0]

        unauthorized_detected = False
        detected_items = []

        for box in results.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])
            class_name = str(model.names[class_id]).lower()

            # Coordinates
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            is_phone = "phone" in class_name or "cell" in class_name or class_id == 67
            is_forbidden = is_phone or any(f in class_name for f in ["laptop", "book", "remote", "calculator", "tablet", "headphone", "earphone", "backpack", "watch"])

            min_thresh = 0.20 if is_phone else 0.30

            if is_forbidden and confidence > min_thresh:
                unauthorized_detected = True
                detected_items.append(f"{class_name} ({confidence*100:.1f}%)")

                # Draw Red Bounding Box for unauthorized object / phone
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 3)

                # Label
                label = f"FORBIDDEN: {class_name.upper()} {confidence*100:.0f}%"
                (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                cv2.rectangle(frame, (x1, y1 - 25), (x1 + w + 10, y1), (0, 0, 255), -1)
                cv2.putText(frame, label, (x1 + 5, y1 - 7), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            else:
                # Normal detected objects (Person, chair, etc.)
                if confidence > 0.45:
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, f"{class_name} {confidence*100:.0f}%", (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1)

        # Top Alert Banner if phone or forbidden object is detected
        if unauthorized_detected:
            # Draw prominent top alert banner
            overlay = frame.copy()
            cv2.rectangle(overlay, (0, 0), (frame.shape[1], 55), (0, 0, 200), -1)
            cv2.addWeighted(overlay, 0.85, frame, 0.15, 0, frame)

            alert_text = "🚨 UNAUTHORIZED OBJECT DETECTED!!!"
            cv2.putText(frame, alert_text, (20, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            items_str = ", ".join(detected_items)
            cv2.putText(frame, f"Detected: {items_str}", (frame.shape[1] - 320, 34), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 230, 230), 1)
        else:
            # Normal status HUD
            cv2.putText(frame, "STATUS: ALL CLEAR (NO PHONE DETECTED)", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        # Show preview window
        cv2.imshow("YOLOv8 Phone & Object Detector - OpenCV Live", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:  # 'q' or ESC
            break

    cap.release()
    cv2.destroyAllWindows()
    print("Camera stream closed.")

if __name__ == "__main__":
    main()
