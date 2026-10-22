// Tiện ích phát âm thanh (Web Speech API + Web Audio API fallback)
export type VoiceAccent = 'en-US' | 'en-GB';

export function speakText(
  text: string,
  options: {
    lang?: VoiceAccent;
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
  } = {}
): void {
  const { lang = 'en-US', rate = 1.0, pitch = 1.0, onStart, onEnd } = options;

  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = pitch;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find((v) => v.lang.includes(lang));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onstart = () => onStart?.();
      utterance.onend = () => onEnd?.();
      utterance.onerror = () => onEnd?.();

      window.speechSynthesis.speak(utterance);
      return;
    }
  } catch {
    // Fallback nếu môi trường chặn speechSynthesis
  }

  // Nếu không có speechSynthesis, phát tín hiệu âm thanh nhẹ và giả lập thời lượng
  playFeedbackTone('info');
  onStart?.();
  const durationMs = Math.max(800, Math.min(4000, text.split(' ').length * 320));
  setTimeout(() => {
    onEnd?.();
  }, durationMs);
}

export function stopSpeaking(): void {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // ignore
  }
}

export function playFeedbackTone(type: 'correct' | 'wrong' | 'complete' | 'info'): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'correct') {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'wrong') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'complete') {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.start(now);
      osc.stop(now + 0.55);
    } else {
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch {
    // ignore audio errors before user interaction
  }
}
