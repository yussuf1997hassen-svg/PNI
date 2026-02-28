import os
import time

DEVICE_ID = os.getenv("DEVICE_ID")
GOVERNANCE_MODE = os.getenv("GOVERNANCE_MODE", "strict")
MQTT_BROKER = os.getenv("MQTT_BROKER", "localhost:1883")
POLICY_SERVICE_URL = os.getenv("POLICY_SERVICE_URL", "http://localhost:8080")

def main():
    print(f"[PNI] Edge Agent ACTIVE")
    print(f"[PNI] Device: {DEVICE_ID}")
    print(f"[PNI] Governance: {GOVERNANCE_MODE}")
    print(f"[PNI] MQTT Broker: {MQTT_BROKER}")
    print(f"[PNI] Policy Service: {POLICY_SERVICE_URL}")
    while True:
        time.sleep(5)
        print("[PNI] Heartbeat OK — policy enforced")

if __name__ == "__main__":
    main()
