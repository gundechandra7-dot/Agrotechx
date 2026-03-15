def get_weather(city):

    # Demo dataset (No API required)
    weather_db = {
        "hyderabad": {"temperature": 32, "humidity": 55, "condition": "Sunny"},
        "delhi": {"temperature": 35, "humidity": 40, "condition": "Hot and Dry"},
        "mumbai": {"temperature": 29, "humidity": 80, "condition": "Humid"},
        "nairobi": {"temperature": 22, "humidity": 65, "condition": "Mild"},
        "bangalore": {"temperature": 28, "humidity": 70, "condition": "Pleasant"},
        "chennai": {"temperature": 33, "humidity": 75, "condition": "Hot and Humid"},
    }

    city = city.lower()

    if city in weather_db:
        return {
            "city": city,
            **weather_db[city]
        }

    return {
        "city": city,
        "temperature": 30,
        "humidity": 60,
        "condition": "Normal weather"
    }