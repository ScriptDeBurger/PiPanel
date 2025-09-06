import os
from flask import Flask, send_from_directory
from flask_cors import CORS
try:
    # When running as package: backend.app:app from repo root
    from backend.spotify.routes import spotify_bp
except Exception:  # pragma: no cover - fallback for running from backend/ dir
    # When running as module inside backend/: app:app
    from spotify.routes import spotify_bp

app = Flask(
    __name__,
    static_folder="../frontend/dist",
    static_url_path="/",  # serve built assets from root (/, /assets, /vite.svg)
)
CORS(app)

# Register blueprint
app.register_blueprint(spotify_bp)

@app.route("/")
def home():
    return app.send_static_file("index.html")


# Serve SPA fallback: if a path isn't a real file, return index.html
@app.route("/<path:path>")
def static_fallback(path):
    candidate = os.path.join(app.static_folder, path)
    if os.path.isfile(candidate):
        return send_from_directory(app.static_folder, path)
    return app.send_static_file("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
