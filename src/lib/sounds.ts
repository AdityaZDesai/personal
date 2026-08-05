let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientAudio: HTMLAudioElement | null = null;
let ambientRunning = false;
let muted = false;

export function initAudio(): boolean {
  if (audioCtx) {
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }
    return true;
  }
  try {
    audioCtx = new AudioContext();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = muted ? 0 : 1;
    masterGain.connect(audioCtx.destination);

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return true;
  } catch {
    return false;
  }
}

export function playKeypress() {
  if (!audioCtx || !masterGain) return;

  const now = audioCtx.currentTime;
  const duration = 0.03;

  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 4000;
  filter.Q.value = 2;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  source.start(now);
  source.stop(now + duration);
}

export function playEnter() {
  if (!audioCtx || !masterGain) return;

  const now = audioCtx.currentTime;
  const duration = 0.06;

  const osc = audioCtx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + duration);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + duration);
}

export function playError() {
  if (!audioCtx || !masterGain) return;

  const now = audioCtx.currentTime;
  const duration = 0.12;

  const osc = audioCtx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(150, now);
  osc.frequency.setValueAtTime(120, now + duration * 0.5);

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);

  osc.start(now);
  osc.stop(now + duration);
}

export function startAmbient() {
  if (muted || ambientRunning) return;
  ambientRunning = true;

  if (!ambientAudio) {
    ambientAudio = new Audio("/lofi-ambient.mp3");
  }
  ambientAudio.loop = true;
  ambientAudio.volume = 0.35;
  ambientAudio.play().catch(() => {
    ambientRunning = false;
  });
}

export function stopAmbient() {
  if (!ambientAudio) return;
  ambientRunning = false;
  ambientAudio.pause();
  ambientAudio.currentTime = 0;
}

export function setMuted(value: boolean) {
  muted = value;
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : 1;
  }
  if (ambientAudio) {
    ambientAudio.volume = muted ? 0 : 0.35;
  }
}

export function getMutedState(): boolean {
  return muted;
}
