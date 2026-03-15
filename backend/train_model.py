from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Load trained model
model = joblib.load("crop_model.pkl")

# Same category mapping used during training
land_mapping = {"red": 0, "wet": 1, "dry": 2, "clay": 3}
rain_mapping = {"medium": 0, "moderate": 1, "high": 2, "low": 3}

class InputData(BaseModel):
    land: str
    rain: str

@app.post("/recommend")
def recommend_crop(data: InputData):
    
    if data.land not in land_mapping or data.rain not in rain_mapping:
        return {"crop": "Invalid input"}

    land_code = land_mapping[data.land]
    rain_code = rain_mapping[data.rain]

    prediction = model.predict([[land_code, rain_code]])

    return {"crop": prediction[0]}