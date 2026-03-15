import numpy as np
from PIL import Image

# Fake ML Disease Mapping (Hackathon Friendly)

def detect_disease(file):

    img = Image.open(file.file)
    img = img.resize((128,128))

    # Simulated ML prediction using image brightness logic
    img_array = np.array(img)
    avg_pixel = img_array.mean()

    # Simple rule-based ML simulation (No API, No Model needed)

    if avg_pixel < 80:
        disease = "Leaf Blight"
        severity = "High"
        medication = "Use copper fungicide spray"

    elif avg_pixel < 150:
        disease = "Powdery Mildew"
        severity = "Medium"
        medication = "Use sulfur based spray"

    else:
        disease = "Healthy Leaf"
        severity = "Low"
        medication = "No treatment required"

    return {
        "disease": disease,
        "severity": severity,
        "medication": medication
    }