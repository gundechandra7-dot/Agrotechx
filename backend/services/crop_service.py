def recommend_crop(data):

    land = data["land"]
    rain = data["rain"]

    # Rule Based Agriculture Knowledge Dataset Simulation

    if land == "red" and rain in ["medium","moderate"]:
        crop = "🌾 Groundnut, Millets, Cotton"
        fertilizer = "Use Nitrogen + Phosphorus fertilizer"

    elif land == "wet" and rain == "high":
        crop = "🌾 Rice, Sugarcane"
        fertilizer = "Use organic compost + Potassium fertilizer"

    elif land == "dry" and rain == "low":
        crop = "🌾 Bajra, Jowar, Pulses"
        fertilizer = "Use drought resistant fertilizer mix"

    elif land == "clay" and rain in ["medium","high"]:
        crop = "🌾 Wheat, Mustard"
        fertilizer = "Use balanced NPK fertilizer"

    else:
        crop = "🌾 Maize, Vegetables"
        fertilizer = "Use organic manure"

    return {
        "crop": crop,
        "fertilizer": fertilizer
    }