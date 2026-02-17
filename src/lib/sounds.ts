let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let ambientNodes: OscillatorNode[] = [];
let ambientGains: GainNode[] = [];
let ambientRunning = false;
let muted = false;

export function initAudio(): boolean {
  if (audioCtx) return true;
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
  if (!audioCtx || !masterGain || ambientRunning) return;
  ambientRunning = true;

  const now = audioCtx.currentTime;

  const layers: { freq: number; type: OscillatorType; vol: number; lfoRate: number; lfoDepth: number; filterFreq: number }[] = [
    { freq: 220, type: "sine", vol: 0.06, lfoRate: 0.08, lfoDepth: 3, filterFreq: 800 },
    { freq: 330, type: "triangle", vol: 0.03, lfoRate: 0.05, lfoDepth: 2, filterFreq: 600 },
    { freq: 440, type: "sine", vol: 0.02, lfoRate: 0.03, lfoDepth: 4, filterFreq: 700 },
    { freq: 165, type: "triangle", vol: 0.04, lfoRate: 0.06, lfoDepth: 2, filterFreq: 500 },
  ];

  layers.forEach((layer) => {
    const osc = audioCtx!.createOscillator();
    osc.type = layer.type;
    osc.frequency.value = layer.freq;

    const lfo = audioCtx!.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = layer.lfoRate;

    const lfoGain = audioCtx!.createGain();
    lfoGain.gain.value = layer.lfoDepth;

    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const filter = audioCtx!.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = layer.filterFreq;
    filter.Q.value = 0.7;

    const gain = audioCtx!.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(layer.vol, now + 4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain!);

    osc.start();
    lfo.start();

    ambientNodes.push(osc, lfo);
    ambientGains.push(gain);
  });
}

export function stopAmbient() {
  if (!audioCtx || !ambientRunning) return;
  ambientRunning = false;

  const now = audioCtx.currentTime;
  ambientGains.forEach((gain) => {
    gain.gain.linearRampToValueAtTime(0, now + 1);
  });

  setTimeout(() => {
    ambientNodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        /* already stopped */
      }
    });
    ambientNodes = [];
    ambientGains = [];
  }, 1200);
}

export function setMuted(value: boolean) {
  muted = value;
  if (masterGain) {
    masterGain.gain.value = muted ? 0 : 1;
  }
  try {
    localStorage.setItem("terminal-muted", String(muted));
  } catch {
    /* ignore */
  }
}

export function isMuted(): boolean {
  return muted;
}

export function loadMutedState() {
  try {
    const stored = localStorage.getItem("terminal-muted");
    if (stored === "true") {
      muted = true;
    }
  } catch {
    /* ignore */
  }
}
