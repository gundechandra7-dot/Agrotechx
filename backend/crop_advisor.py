def suggest_crop(soil, temperature, rainfall):
    soil = (soil or "").lower().strip()
    try:
        temp = float(temperature)
        rain = float(rainfall)
    except (TypeError, ValueError):
        temp, rain = 28, 0.5

    if soil == "black" and temp > 25:
        return {"crop": "Cotton", "advice": "Use drip irrigation and nitrogen fertilizer. Best in warm season."}
    if soil == "red":
        return {"crop": "Groundnut", "advice": "Ensure proper drainage. Red soil is good for legumes and oilseeds."}
    if soil == "clay":
        if rain > 0.6:
            return {"crop": "Rice", "advice": "Clay holds water well. Maintain standing water for rice."}
        return {"crop": "Wheat", "advice": "Clay soil retains moisture. Use balanced NPK and avoid waterlogging."}
    if soil == "dry":
        if rain < 0.4:
            return {"crop": "Pearl Millet", "advice": "Drought-resistant. Sow at onset of rains; minimal irrigation."}
        return {"crop": "Sorghum", "advice": "Suits dry soil. Use drought-tolerant varieties and mulch."}
    if soil == "wet":
        return {"crop": "Rice", "advice": "Ideal for wet soil. Ensure good drainage between seasons."}
    # default
    return {"crop": "Rice", "advice": "Maintain standing water in field. Test soil for best results."}