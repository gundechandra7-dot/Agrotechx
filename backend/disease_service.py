from PIL import Image
import numpy as np

def predict_disease(image: Image.Image):
    """Rule-based disease hint from leaf color: browning, spots, low green."""
    img = image.resize((128, 128))
    img_rgb = img.convert("RGB")
    arr = np.array(img_rgb)

    r, g, b = arr[:, :, 0].astype(float), arr[:, :, 1].astype(float), arr[:, :, 2].astype(float)
    mean_r, mean_g, mean_b = r.mean(), g.mean(), b.mean()
    brightness = (mean_r + mean_g + mean_b) / 3.0

    # Green dominance: healthy leaves are strong in green
    total = mean_r + mean_g + mean_b + 1e-6
    green_ratio = mean_g / total
    # Browning: red > green often indicates disease spots
    browning = mean_r - mean_g
    # Fraction of dark pixels (possible necrotic spots)
    dark = (r + g + b) / 3.0 < 85
    pct_dark = dark.sum() / (arr.shape[0] * arr.shape[1])
    # Pixels that look brown/yellow (red high, green not dominant)
    brownish = (r > g) & (r > 100)
    pct_brown = brownish.sum() / (arr.shape[0] * arr.shape[1])
    # Low green overall (chlorophyll loss)
    low_green = green_ratio < 0.36
    high_browning = browning > 12
    # Variance: diseased leaves often have more color variation (spots)
    std_g = np.std(g)
    spotty = std_g > 42 and pct_dark > 0.04

    if pct_dark > 0.12 or (pct_brown > 0.25 and low_green):
        return {
            "disease": "Leaf Blight",
            "severity": "High",
            "advice": "Use organic fungicide spray every 7 days. Remove badly affected leaves."
        }
    if high_browning and low_green:
        return {
            "disease": "Bacterial Leaf Spot",
            "severity": "Medium",
            "advice": "Apply copper-based fungicide. Avoid overhead watering."
        }
    if spotty or (pct_brown > 0.18 and green_ratio < 0.4):
        return {
            "disease": "Powdery Mildew",
            "severity": "Medium",
            "advice": "Use sulfur-based spray. Improve air circulation and reduce humidity."
        }
    if browning > 8 and green_ratio < 0.38:
        return {
            "disease": "Early Blight",
            "severity": "Low",
            "advice": "Remove infected leaves. Apply fungicide as preventive measure."
        }

    return {
        "disease": "Healthy",
        "severity": "None",
        "advice": "No action needed. Keep monitoring."
    }