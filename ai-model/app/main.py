from pathlib import Path
import pickle
import joblib
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from train import train_model

BASE_DIR = Path(__file__).resolve().parents[1]
DATASET_DIR = BASE_DIR.parent / 'Disease-outbreak-dataset'
MODEL_PATH = BASE_DIR / 'models' / 'model.joblib'

# ---------- Load outbreak model ----------
if not MODEL_PATH.exists():
    train_model()

bundle = joblib.load(MODEL_PATH)
if isinstance(bundle, dict):
    model = bundle['model']
    model_accuracy = float(bundle.get('accuracy', 0))
else:
    model = bundle
    model_accuracy = 0.0

# ---------- Load Disease-outbreak-dataset models ----------
SAVED_MODELS_DIR = DATASET_DIR / 'Saved_Models'

def _load_pickle(name):
    path = SAVED_MODELS_DIR / name
    if path.exists():
        with open(path, 'rb') as f:
            return pickle.load(f)
    return None

heart_model = _load_pickle('heart_disease_model.sav')
heart_scaler = _load_pickle('scaler_heart.sav')
diabetes_model = _load_pickle('diabetes_model.sav')
diabetes_scaler = _load_pickle('scaler_diabetes.sav')
parkinsons_model = _load_pickle('parkinsons_model.sav')
parkinsons_scaler = _load_pickle('scaler_parkinsons.sav')

app = FastAPI(title='Cura AI Service')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Request Models ----------

class PredictionRequest(BaseModel):
    symptoms: list[str]
    temperature: float
    humidity: float


class HeartPredictionRequest(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float


class DiabetesPredictionRequest(BaseModel):
    pregnancies: float
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    dpf: float
    age: float


class ParkinsonsPredictionRequest(BaseModel):
    fo: float
    fhi: float
    flo: float
    jitter_percent: float
    jitter_abs: float
    rap: float
    ppq: float
    ddp: float
    shimmer: float
    shimmer_db: float
    apq3: float
    apq5: float
    apq: float
    dda: float
    nhr: float
    hnr: float
    rpde: float
    dfa: float
    spread1: float
    spread2: float
    d2: float
    ppe: float


# ---------- Endpoints ----------

@app.get('/healthz')
def healthz():
    return {
        'ok': True,
        'service': 'cura-ai',
        'models': {
            'outbreak': model is not None,
            'heart': heart_model is not None,
            'diabetes': diabetes_model is not None,
            'parkinsons': parkinsons_model is not None,
        }
    }


@app.get('/metrics')
def metrics():
    return {'accuracy': round(model_accuracy, 4)}


@app.post('/predict')
def predict(payload: PredictionRequest):
    s = set(sym.lower() for sym in payload.symptoms)
    features = [[
        1 if 'fever' in s else 0,
        1 if 'cough' in s else 0,
        payload.temperature,
        payload.humidity,
    ]]

    proba = float(model.predict_proba(features)[0][1])
    risk = 'High' if proba >= 0.75 else 'Medium' if proba >= 0.45 else 'Low'

    return {'risk': risk, 'probability': round(proba, 2)}


@app.post('/predict/heart')
def predict_heart(payload: HeartPredictionRequest):
    if not heart_model or not heart_scaler:
        raise HTTPException(status_code=503, detail='Heart disease model not loaded')

    features = [
        payload.age, payload.sex, payload.cp, payload.trestbps,
        payload.chol, payload.fbs, payload.restecg, payload.thalach,
        payload.exang, payload.oldpeak, payload.slope, payload.ca, payload.thal
    ]
    arr = heart_scaler.transform([features])
    prediction = int(heart_model.predict(arr)[0])

    try:
        proba = float(heart_model.predict_proba(arr)[0][1])
    except Exception:
        proba = 1.0 if prediction == 1 else 0.0

    risk = 'High' if prediction == 1 else 'Low'
    advice = 'Consult a cardiologist immediately. Elevated risk factors detected.' if prediction == 1 else 'Heart health appears normal. Maintain a healthy lifestyle with regular exercise and balanced diet.'

    return {
        'prediction': prediction,
        'risk': risk,
        'probability': round(proba, 2),
        'confidence': round(proba * 100 if prediction == 1 else (1 - proba) * 100, 1),
        'advice': advice,
        'disease': 'Heart Disease',
        'features_used': 13,
        'model_type': 'SVM Classifier'
    }


@app.post('/predict/diabetes')
def predict_diabetes(payload: DiabetesPredictionRequest):
    if not diabetes_model or not diabetes_scaler:
        raise HTTPException(status_code=503, detail='Diabetes model not loaded')

    features = [
        payload.pregnancies, payload.glucose, payload.blood_pressure,
        payload.skin_thickness, payload.insulin, payload.bmi,
        payload.dpf, payload.age
    ]
    arr = diabetes_scaler.transform([features])
    prediction = int(diabetes_model.predict(arr)[0])

    try:
        proba = float(diabetes_model.predict_proba(arr)[0][1])
    except Exception:
        proba = 1.0 if prediction == 1 else 0.0

    risk = 'High' if prediction == 1 else 'Low'
    advice = 'Blood sugar monitoring recommended. Consult an endocrinologist for further evaluation.' if prediction == 1 else 'Diabetes risk is low. Continue maintaining a balanced diet and regular physical activity.'

    return {
        'prediction': prediction,
        'risk': risk,
        'probability': round(proba, 2),
        'confidence': round(proba * 100 if prediction == 1 else (1 - proba) * 100, 1),
        'advice': advice,
        'disease': 'Diabetes',
        'features_used': 8,
        'model_type': 'SVM Classifier'
    }


@app.post('/predict/parkinsons')
def predict_parkinsons(payload: ParkinsonsPredictionRequest):
    if not parkinsons_model or not parkinsons_scaler:
        raise HTTPException(status_code=503, detail="Parkinson's model not loaded")

    features = [
        payload.fo, payload.fhi, payload.flo,
        payload.jitter_percent, payload.jitter_abs, payload.rap,
        payload.ppq, payload.ddp, payload.shimmer, payload.shimmer_db,
        payload.apq3, payload.apq5, payload.apq, payload.dda,
        payload.nhr, payload.hnr, payload.rpde, payload.dfa,
        payload.spread1, payload.spread2, payload.d2, payload.ppe
    ]
    arr = parkinsons_scaler.transform([features])
    prediction = int(parkinsons_model.predict(arr)[0])

    try:
        proba = float(parkinsons_model.predict_proba(arr)[0][1])
    except Exception:
        proba = 1.0 if prediction == 1 else 0.0

    risk = 'High' if prediction == 1 else 'Low'
    advice = "Voice pattern analysis suggests possible Parkinson's indicators. Consult a neurologist for comprehensive evaluation." if prediction == 1 else "No significant Parkinson's indicators detected. Continue monitoring and stay physically active."

    return {
        'prediction': prediction,
        'risk': risk,
        'probability': round(proba, 2),
        'confidence': round(proba * 100 if prediction == 1 else (1 - proba) * 100, 1),
        'advice': advice,
        'disease': "Parkinson's Disease",
        'features_used': 22,
        'model_type': 'SVM Classifier'
    }


@app.get('/models/status')
def model_status():
    return {
        'outbreak': {
            'loaded': model is not None,
            'accuracy': round(model_accuracy, 4),
            'features': ['fever', 'cough', 'temperature', 'humidity'],
            'type': 'Logistic Regression'
        },
        'heart': {
            'loaded': heart_model is not None,
            'features': ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'],
            'dataset_size': 303,
            'type': 'SVM Classifier'
        },
        'diabetes': {
            'loaded': diabetes_model is not None,
            'features': ['pregnancies', 'glucose', 'blood_pressure', 'skin_thickness', 'insulin', 'bmi', 'dpf', 'age'],
            'dataset_size': 768,
            'type': 'SVM Classifier'
        },
        'parkinsons': {
            'loaded': parkinsons_model is not None,
            'features': ['fo', 'fhi', 'flo', 'jitter_percent', 'jitter_abs', 'rap', 'ppq', 'ddp', 'shimmer', 'shimmer_db', 'apq3', 'apq5', 'apq', 'dda', 'nhr', 'hnr', 'rpde', 'dfa', 'spread1', 'spread2', 'd2', 'ppe'],
            'dataset_size': 195,
            'type': 'SVM Classifier'
        }
    }
