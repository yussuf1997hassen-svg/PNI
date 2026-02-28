FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir flask paho-mqtt requests

COPY ingest_hub.py .

ENV MQTT_BROKER=localhost:1883
ENV POLICY_SERVICE_URL=http://localhost:8080
ENV INGEST_PORT=8081

EXPOSE 8081

CMD ["python", "ingest_hub.py"]
