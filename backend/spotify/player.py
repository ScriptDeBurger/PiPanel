import spotipy
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv
import os

load_dotenv()

client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
redirect_uri = os.getenv("SPOTIFY_REDIRECT_URI")

class SpotifyPlayer:
    def __init__(self):
        self.sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope="user-read-playback-state,user-modify-playback-state,user-read-currently-playing"
        ))

    def get_status(self):
        current = self.sp.current_playback()
        if current:
            progress = current['progress_ms'] / 1000
            duration = current['item']['duration_ms'] / 1000
            playing = current['is_playing']
            name = current['item']['name']
            artist = current['item']['artists'][0]['name']
            album = current['item']['album']['name']
            album_img = current['item']['album']['images'][0]['url']
            return {
                "playing": playing,
                "progress": int(progress),
                "duration": int(duration),
                "name": name,
                "artist": artist,
                "album": album,
                "album_img": album_img
            }
        else:
            return {
                "playing": False,
                "progress": 0,
                "duration": 0,
                "name": "No song",
                "artist": "",
                "album": "",
                "album_img": ""
            }

    def play(self):
        self.sp.start_playback()

    def pause(self):
        self.sp.pause_playback()

    def next(self):
        self.sp.next_track()

    def previous(self):
        self.sp.previous_track()

    def seek(self, pos):
        self.sp.seek_track(pos * 1000)  # API expects ms
        
    def shuffle(self, state: bool):
        self.sp.shuffle(state)
    
    def repeat(self, state: str):
        self.sp.repeat(state)
    
    def set_volume(self, volume: int):
        self.sp.volume(volume)
