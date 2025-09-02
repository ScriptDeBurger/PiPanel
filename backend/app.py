from flask import Flask, send_from_directory
from flask_cors import CORS
from spotify.routes import spotify_bp

app = Flask(__name__, static_folder="../frontend/dist")
CORS(app)

# Register blueprint
app.register_blueprint(spotify_bp)

@app.route("/")
def home():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)