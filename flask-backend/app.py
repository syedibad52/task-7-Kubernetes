from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# home route to check if server is up
@app.route("/")
def home():
    return jsonify({"message": "Flask backend is running!", "status": "ok"})


# handles form data from express frontend
@app.route("/submit", methods=["POST"])
def submit():
    data = request.get_json()
    print("received:", data)

    name = data.get("name", "")
    email = data.get("email", "")
    message = data.get("message", "")

    if not name or not email or not message:
        return jsonify({"success": False, "error": "all fields required"}), 400

    print(f"Name: {name}, Email: {email}, Msg: {message}")

    return jsonify({
        "success": True,
        "message": "form submitted successfully!",
        "data": {"name": name, "email": email, "message": message}
    })


# health check
@app.route("/health")
def health():
    return jsonify({"status": "healthy"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
