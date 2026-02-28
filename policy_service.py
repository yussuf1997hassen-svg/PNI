import os
import sys
from flask import Flask, jsonify

app = Flask(__name__)
GOVERNANCE_MODE = os.getenv("GOVERNANCE_MODE", "strict")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy", "governance": GOVERNANCE_MODE}), 200

@app.route("/policy", methods=["GET"])
def policy():
    return jsonify({
        "governance_mode": GOVERNANCE_MODE,
        "policies": [
            "single_authority_command_execution",
            "policy_gated_operation",
            "deterministic_runtime"
        ]
    }), 200

if __name__ == "__main__":
    port = int(os.getenv("SERVICE_PORT", 8080))
    print(f"[POLICY] Starting on port {port}", file=sys.stderr)
    sys.stderr.flush()
    app.run(host="0.0.0.0", port=port, debug=False)
