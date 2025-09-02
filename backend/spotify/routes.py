from flask import Blueprint, jsonify, redirect, url_for
from .player import SpotifyPlayer

spotify_bp = Blueprint("spotify", __name__, url_prefix="/spotify")
player = SpotifyPlayer()

@spotify_bp.route("/status")
def status():
    return jsonify(player.get_status())

@spotify_bp.route("/play")
def play():
    player.play()
    return redirect(url_for("home"))

@spotify_bp.route("/pause")
def pause():
    player.pause()
    return redirect(url_for("home"))

@spotify_bp.route("/next")
def next_track():
    player.next()
    return redirect(url_for("home"))

@spotify_bp.route("/prev")
def previous_track():
    player.previous()
    return redirect(url_for("home"))

@spotify_bp.route("/seek/<int:pos>")
def seek(pos):
    player.seek(pos)
    return redirect(url_for("home"))

@spotify_bp.route("/shuffle/<state>")
def shuffle(state):
    player.shuffle(state.lower() == 'true')
    return redirect(url_for("home"))

@spotify_bp.route("/repeat/<state>")
def repeat(state):
    if state in ['off', 'context', 'track']:
        player.repeat(state)
    return redirect(url_for("home"))

def set_volume(volume):
    if 0 <= volume <= 100:
        player.set_volume(volume)
    return redirect(url_for("home"))
