from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load trained models
mouse_knn = joblib.load("mouse_knn_model.pkl")
typing_knn = joblib.load("typing_knn_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        print("Received Data:", data)

        # Extract mouse and typing features
        mouse_features = np.array([[data["mouse_clicks_per_sec"], data["click_delay_variability"]]])
        typing_features = np.array([[data["typing_wpm"], data["keystroke_delay_variability"]]])

        # Anomaly detection
        mouse_anomaly = mouse_knn.predict(mouse_features)[0] == -1
        typing_anomaly = typing_knn.predict(typing_features)[0] == -1

        return jsonify({"mouse_anomaly": mouse_anomaly, "typing_anomaly": typing_anomaly})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
