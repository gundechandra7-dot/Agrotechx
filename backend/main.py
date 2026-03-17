from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow frontend requests

@app.route("/")
def home():
    return "Agrotech AI Backend Running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Example AI logic (replace with your model)
    crop = data.get("crop")

    result = {
        "prediction": f"Healthy crop: {crop}",
        "advice": "Water regularly and monitor soil"
    }

    return jsonify(result)

if __name__ == "__main__":
    app.run()

from flask_cors import CORS

CORS(app)
