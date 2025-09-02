const BASE_URL = "http://localhost:5000/spotify";

export async function getStatus() {
  const res = await fetch(`${BASE_URL}/status`);
  return await res.json();
}

export async function play() {
  return fetch(`${BASE_URL}/play`);
}

export async function pause() {
  return fetch(`${BASE_URL}/pause`);
}

export async function nextTrack() {
  return fetch(`${BASE_URL}/next`);
}

export async function previousTrack() {
  return fetch(`${BASE_URL}/prev`);
}

export async function seek(pos: number) {
  return fetch(`${BASE_URL}/seek/${pos}`);
}

export async function toggleShuffle(state: boolean) {
  return fetch(`${BASE_URL}/shuffle/${state}`);
}

export async function setRepeat(state: 'off' | 'context' | 'track') {
  return fetch(`${BASE_URL}/repeat/${state}`);
}

export async function setVolume(volume: number) {
  return fetch(`${BASE_URL}/volume/${volume}`);
}