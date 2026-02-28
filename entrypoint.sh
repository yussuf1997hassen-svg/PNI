#!/bin/sh
set -e

echo "[PNI] Edge Agent starting"
echo "[PNI] Governance mode: $GOVERNANCE_MODE"
echo "[PNI] Device ID: $DEVICE_ID"
echo "[PNI] MQTT Broker: $MQTT_BROKER"
echo "[PNI] Policy Service: $POLICY_SERVICE_URL"

python /app/edge_agent.py
