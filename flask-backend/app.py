from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # so frontend can talk to us

# just a basic home route
@app.route("/")
def home():
    return jsonify({"msg": "backend is up"})

# this handles the form data from frontend
@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()

    name = data.get("name", "")
    email = data.get("email", "")
    message = data.get("message", "")

    # check if anything is empty
    if not name or not email or not message:
        return jsonify({"success": False, "error": "fill all fields"}), 400

    print(f"got form: {name} - {email} - {message}")

    return jsonify({
        "success": True,
        "message": "got your submission!",
        "data": {"name": name, "email": email, "message": message}
    })

# health check for kubernetes probes
@app.route("/health")
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
