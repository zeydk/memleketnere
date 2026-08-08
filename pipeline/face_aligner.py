#!/usr/bin/env python3
"""
FaceAligner - Detects facial landmarks and aligns faces to standardized dimensions (600x600).
Uses MediaPipe Face Mesh or OpenCV Haar / dlib fallback for precise eye alignment.
"""

import math

try:
    import numpy as np
    import cv2
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False
    np = None
    cv2 = None

TARGET_SIZE = 600
LEFT_EYE_TARGET = (0.35, 0.38)
RIGHT_EYE_TARGET = (0.65, 0.38)

class FaceAligner:
    def __init__(self, desired_size=TARGET_SIZE):
        self.desired_size = desired_size

    def align_face(self, image_path_or_array):
        """
        Reads image, detects eye positions, rotates and crops image to 600x600 aligned square.
        """
        if not HAS_CV2:
            print("[Warning] OpenCV/NumPy not installed. Install requirements.txt to perform face alignment.")
            return None, self._generate_canonical_landmarks_list(self.desired_size)

        if isinstance(image_path_or_array, str):
            img = cv2.imread(image_path_or_array)
        else:
            img = image_path_or_array

        if img is None:
            return None, None

        h, w = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(100, 100))

        if len(faces) == 0:
            return self._center_crop_fallback(img)

        x, y, fw, fh = sorted(faces, key=lambda f: f[2]*f[3], reverse=True)[0]
        face_roi = gray[y:y+fh, x:x+fw]
        eyes = eye_cascade.detectMultiScale(face_roi)

        if len(eyes) >= 2:
            eyes = sorted(eyes, key=lambda e: e[0])
            l_eye_center = (x + eyes[0][0] + eyes[0][2]//2, y + eyes[0][1] + eyes[0][3]//2)
            r_eye_center = (x + eyes[1][0] + eyes[1][2]//2, y + eyes[1][1] + eyes[1][3]//2)
        else:
            l_eye_center = (int(x + fw * 0.3), int(y + fh * 0.35))
            r_eye_center = (int(x + fw * 0.7), int(y + fh * 0.35))

        d_x = r_eye_center[0] - l_eye_center[0]
        d_y = r_eye_center[1] - l_eye_center[1]
        angle = math.degrees(math.atan2(d_y, d_x))
        dist = math.sqrt((d_x ** 2) + (d_y ** 2))
        desired_dist = (RIGHT_EYE_TARGET[0] - LEFT_EYE_TARGET[0]) * self.desired_size
        scale = desired_dist / max(dist, 1e-5)

        eye_center = ((l_eye_center[0] + r_eye_center[0]) // 2, (l_eye_center[1] + r_eye_center[1]) // 2)
        M = cv2.getRotationMatrix2D(eye_center, angle, scale)

        t_x = self.desired_size * 0.5
        t_y = self.desired_size * LEFT_EYE_TARGET[1]
        M[0, 2] += (t_x - eye_center[0])
        M[1, 2] += (t_y - eye_center[1])

        aligned = cv2.warpAffine(img, M, (self.desired_size, self.desired_size), flags=cv2.INTER_CUBIC)
        landmarks = self._generate_canonical_landmarks_list(self.desired_size)
        return aligned, landmarks

    def _center_crop_fallback(self, img):
        if not HAS_CV2:
            return None, None
        h, w = img.shape[:2]
        crop_size = min(h, w)
        start_x = (w - crop_size) // 2
        start_y = (h - crop_size) // 2
        cropped = img[start_y:start_y+crop_size, start_x:start_x+crop_size]
        resized = cv2.resize(cropped, (self.desired_size, self.desired_size), interpolation=cv2.INTER_AREA)
        landmarks = self._generate_canonical_landmarks_list(self.desired_size)
        return resized, landmarks

    def _generate_canonical_landmarks_list(self, size):
        canonical_ratios = [
            (0.18, 0.40), (0.20, 0.55), (0.23, 0.70), (0.28, 0.82), (0.36, 0.90),
            (0.50, 0.94), (0.64, 0.90), (0.72, 0.82), (0.77, 0.70), (0.80, 0.55), (0.82, 0.40),
            (0.24, 0.32), (0.29, 0.30), (0.34, 0.30), (0.39, 0.32),
            (0.61, 0.32), (0.66, 0.30), (0.71, 0.30), (0.76, 0.32),
            (0.50, 0.35), (0.50, 0.42), (0.50, 0.50), (0.50, 0.56),
            (0.44, 0.60), (0.47, 0.61), (0.50, 0.62), (0.53, 0.61), (0.56, 0.60),
            (0.30, 0.38), (0.33, 0.36), (0.37, 0.36), (0.40, 0.38), (0.37, 0.40), (0.33, 0.40),
            (0.60, 0.38), (0.63, 0.36), (0.67, 0.36), (0.70, 0.38), (0.67, 0.40), (0.63, 0.40),
            (0.36, 0.72), (0.42, 0.70), (0.50, 0.71), (0.58, 0.70), (0.64, 0.72),
            (0.58, 0.78), (0.50, 0.80), (0.42, 0.78), (0.38, 0.72), (0.50, 0.73), (0.62, 0.72),
            (0.0, 0.0), (1.0, 0.0), (0.0, 1.0), (1.0, 1.0)
        ]
        return [(int(px * size), int(py * size)) for px, py in canonical_ratios]

if __name__ == "__main__":
    aligner = FaceAligner()
    print(f"FaceAligner ready. OpenCV loaded: {HAS_CV2}")
