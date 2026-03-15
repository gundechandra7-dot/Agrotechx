from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io

from disease_service import predict_disease
from crop_advisor import suggest_crop

app = FastAPI()

# Weather: use inline demo data if services.weather_service not available
try:
    from services.weather_service import get_weather
except ImportError:
    def get_weather(city):
        city = (city or "").lower()
        demo = {"hyderabad": {"temperature": 32, "humidity": 55, "condition": "Sunny"},
                "delhi": {"temperature": 35, "humidity": 40, "condition": "Hot and Dry"},
                "mumbai": {"temperature": 29, "humidity": 80, "condition": "Humid"},
                "nairobi": {"temperature": 22, "humidity": 65, "condition": "Mild"},
                "bangalore": {"temperature": 28, "humidity": 70, "condition": "Pleasant"},
                "chennai": {"temperature": 33, "humidity": 75, "condition": "Hot and Humid"}}
        if city in demo:
            return {"city": city, **demo[city]}
        return {"city": city, "temperature": 30, "humidity": 60, "condition": "Normal weather"}

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/weather")
def weather(city: str = ""):
    if not city or not city.strip():
        return get_weather("default")
    return get_weather(city.strip())

@app.post("/detect-disease")
async def detect_disease(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    result = predict_disease(image)
    return result

@app.get("/suggest-crop")
def crop(soil: str, temperature: float, rainfall: float):
    result = suggest_crop(soil, temperature, rainfall)
    return result

# Ask answers in English, Hindi, Telugu (key = topic, value = (en, hi, te))
_ASK_ANSWERS = {
    "empty": (
        "Please type or speak a farming-related question.",
        "कृपया कृषि से जुड़ा प्रश्न टाइप करें या बोलें।",
        "దయచేసి వ్యవసాయ ప్రశ్నను టైప్ చేయండి లేదా మాట్లాడండి.",
    ),
    "fertilizer": (
        "Use organic compost or NPK in balanced amounts. Test your soil first to know what nutrients are needed. For rice use more N; for pulses avoid excess N.",
        "जैविक कम्पोस्ट या संतुलित NPK इस्तेमाल करें। पहले मिट्टी जांच कराएं। चावल के लिए N ज्यादा; दालों के लिए N कम।",
        "ఆర్గానిక్ కంపోస్ట్ లేదా సమతుల్య NPK ఉపయోగించండి. ముందు మట్టి పరీక్షించండి. వరికి N ఎక్కువ; పప్పు పంటలకు N తక్కువ.",
    ),
    "pest": (
        "Try neem oil spray or other organic pesticides. Remove affected leaves and keep the field clean. Rotate crops to reduce pest buildup.",
        "नीम तेल स्प्रे या अन्य जैविक कीटनाशक इस्तेमाल करें। प्रभावित पत्ते हटाएं और खेत साफ रखें।",
        "వేప నూనె స్ప్రే లేదా ఇతర ఆర్గానిక్ కీటకనాశకాలు ఉపయోగించండి. ప్రభావిత ఆకులను తొలగించండి, పొలం శుభ్రంగా ఉంచండి.",
    ),
    "water": (
        "Water in the morning or evening to reduce evaporation. Drip irrigation saves water and is good for most crops. Avoid overwatering to prevent root rot.",
        "सुबह या शाम पानी दें ताकि वाष्पीकरण कम हो। ड्रिप सिंचाई से पानी बचता है। ज्यादा पानी देने से जड़ सड़न हो सकती है।",
        "బాష్పీభవనం తగ్గించడానికి ఉదయం లేదా సాయంత్రం నీరు ఇవ్వండి. డ్రిప్ నీటిపాటు నీటిని ఆదా చేస్తుంది. వేరు కుళ్ళకు అతిగా నీరు ఇవ్వకండి.",
    ),
    "weather": (
        "Check the Weather section in the app for your location. Plan sowing and harvesting around rain and temperature. Protect crops during heavy rain or frost.",
        "ऐप में मौसम सेक्शन में अपना स्थान देखें। बारिश और तापमान के हिसाब से बुवाई और कटाई की योजना बनाएं।",
        "అనువర్తనంలో వాతావరణం విభాగంలో మీ ప్రదేశాన్ని చూడండి. వర్షం మరియు ఉష్ణోగ్రత ప్రకారం విత్తనం మరియు అరవేత ప్లాన్ చేయండి.",
    ),
    "disease": (
        "Use the Plant Health section to upload a leaf photo for detection. For blight, use copper-based fungicide; remove badly affected leaves.",
        "प्लांट हेल्थ सेक्शन में पत्ते की फोटो अपलोड करें। झुलसा के लिए तांबा फंगीसाइड इस्तेमाल करें।",
        "ప్లాంట్ హెల్త్ విభాగంలో ఆకు ఫోటో అప్‌లోడ్ చేయండి. కుళ్ళు కోసం కాపర్ ఫంజిసైడ్ ఉపయోగించండి.",
    ),
    "soil": (
        "Use the What To Grow section: select your soil type and rainfall to get crop suggestions and advice tailored to your land.",
        "क्या उगाएं सेक्शन में जाएं: मिट्टी और बारिश चुनकर फसल सलाह लें।",
        "ఏమి పండించాలి విభాగాన్ని ఉపయోగించండి: మట్టి మరియు వర్షపాతం ఎంచుకొని పంట సలహా పొందండి.",
    ),
    "default": (
        "Use Weather for local conditions, Plant Health to check leaf disease, and What To Grow for crop advice. You can ask about fertilizers, pests, watering, or soil.",
        "मौसम के लिए वेदर, रोग के लिए प्लांट हेल्थ, फसल सलाह के लिए क्या उगाएं इस्तेमाल करें।",
        "వాతావరణం, మొక్క ఆరోగ్యం, పంట సలహా కోసం అనువర్తన విభాగాలను ఉపయోగించండి.",
    ),
}

@app.post("/ask")
def ask(question: dict = Body(...)):
    q = (question.get("question") or "").strip()
    lang = (question.get("lang") or "en").lower()
    if lang not in ("hi", "te"):
        lang = "en"
    idx = 0 if lang == "en" else (1 if lang == "hi" else 2)
    if not q:
        return {"answer": _ASK_ANSWERS["empty"][idx]}
    q_lower = q.lower()
    if "fertilizer" in q_lower or "fertiliser" in q_lower:
        return {"answer": _ASK_ANSWERS["fertilizer"][idx]}
    if "pest" in q_lower or "insect" in q_lower:
        return {"answer": _ASK_ANSWERS["pest"][idx]}
    if "water" in q_lower or "irrigation" in q_lower:
        return {"answer": _ASK_ANSWERS["water"][idx]}
    if "weather" in q_lower or "rain" in q_lower:
        return {"answer": _ASK_ANSWERS["weather"][idx]}
    if "disease" in q_lower or "leaf" in q_lower or "blight" in q_lower:
        return {"answer": _ASK_ANSWERS["disease"][idx]}
    if "soil" in q_lower or "crop" in q_lower or "grow" in q_lower:
        return {"answer": _ASK_ANSWERS["soil"][idx]}
    return {"answer": _ASK_ANSWERS["default"][idx]}