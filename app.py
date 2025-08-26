#!/usr/bin/env python3
from flask import Flask, render_template
from spotify.routes import spotify_bp

app = Flask(__name__)

# Register blueprint
app.register_blueprint(spotify_bp)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
