FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir flask paho-mqtt

COPY policy_service.py .

ENV GOVERNANCE_MODE=strict
ENV SERVICE_PORT=8080

EXPOSE 8080

CMD ["python", "policy_service.py"]
