FROM python:3.11-slim

WORKDIR /app

COPY edge_agent.py .
COPY entrypoint.sh .

RUN chmod +x entrypoint.sh

ENV DEVICE_ID=default-device
ENV GOVERNANCE_MODE=strict
ENV MQTT_BROKER=localhost:1883
ENV POLICY_SERVICE_URL=http://localhost:8080

ENTRYPOINT ["./entrypoint.sh"]
