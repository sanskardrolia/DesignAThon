/* ==========================================================================
   THE LAST BOOK STORE - INTERACTIVE INTERFACE LOGIC
   Theme: The Modern Archive (Tactile & Skeuomorphic prestige)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initAudioFeedback();
});





/* ==========================================================================
   5. WEB AUDIO SYNTHESIZER SOUND EFFECTS
   ========================================================================== */
let audioCtx = null;

function initAudioFeedback() {
  // We initialize AudioContext on user interaction to abide by browser standards
  window.addEventListener('click', resumeAudioContext, { once: true });
  window.addEventListener('keydown', resumeAudioContext, { once: true });
}

function resumeAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Generate organic paper click / card slide tick sound
function playClickSound(frequency = 150, duration = 0.1, volume = 0.05) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, audioCtx.currentTime + duration);
    
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (err) {
    // Fail silently if audio block exists
  }
}

// Synthesize heavy rubber ink stamp thud sound (low thud + paper scrape noise)
function playStampSound() {
  if (!audioCtx) return;
  try {
    const now = audioCtx.currentTime;
    
    // Low frequency mechanical thud
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.15);
    
    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(now + 0.2);
    
    // Noise buffer for the tactile stamp scrape paper feel
    const bufferSize = audioCtx.sampleRate * 0.15; // 0.15 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 400;
    filter.Q.value = 1.0;
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.12, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    noise.start();
    noise.stop(now + 0.15);
  } catch (err) {
    // Fail silently
  }
}

// Typewriter Key Strike Clack (Noise burst + resonant metallic decay)
function playTypewriterClack(char) {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') {
    // Try to auto-resume on first typed character
    audioCtx.resume();
  }
  try {
    const now = audioCtx.currentTime;
    
    // 1. High frequency mechanical tap noise burst
    const bufferSize = audioCtx.sampleRate * 0.012; // 12ms burst
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    // Shift frequency randomly to mimic different keys hitting different bar segments
    noiseFilter.frequency.value = 1300 + Math.random() * 300;
    noiseFilter.Q.value = 5.0;
    
    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);
    
    noise.start();
    noise.stop(now + 0.012);
    
    // 2. Mid frequency metallic case ring (sine wave with short decay)
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    
    osc.type = 'triangle';
    const randomFreq = 320 + Math.random() * 160;
    osc.frequency.setValueAtTime(randomFreq, now);
    
    oscGain.gain.setValueAtTime(0.04, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
    
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(now + 0.03);
    
  } catch (err) {
    // Fail silently
  }
}

// Vintage Typewriter Margin Bell Ding
function playCarriageBell() {
  if (!audioCtx || audioCtx.state === 'suspended') return;
  try {
    const now = audioCtx.currentTime;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1450, now); // pure high frequency bell tone
    
    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.32); // longer decay
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(now + 0.35);
  } catch (err) {
    // Fail silently
  }
}

// Carriage Return Slide Whoosh
function playCarriageReturn() {
  if (!audioCtx || audioCtx.state === 'suspended') return;
  try {
    const now = audioCtx.currentTime;
    
    const bufferSize = audioCtx.sampleRate * 0.35; // 350ms
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(130, now + 0.32); // sweep down
    filter.Q.value = 2.0;
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.03, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    
    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    noise.start();
    noise.stop(now + 0.35);
  } catch (err) {
    // Fail silently
  }
}


