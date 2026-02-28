import os
from flask import Flask, jsonify
import paho.mqtt.client as mqtt

app = Flask(__name__)
MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost:1883")
POLICY_SERVICE_URL = os.getenv("POLICY_SERVICE_URL", "http://localhost:8080")

@app.route("/status", methods=["GET"])
def status():
    return jsonify({
        "service": "ingest-hub",
        "status": "operational",
        "mqtt_broker": MQTT_BROKER,
        "policy_service": POLICY_SERVICE_URL
    }), 200

@app.route("/ingest", methods=["POST"])
def ingest():
    return jsonify({"message": "Data ingested", "status": "success"}), 202

if __name__ == "__main__":
    port = int(os.getenv("INGEST_PORT", 8081))
    app.run(host="0.0.0.0", port=port)
