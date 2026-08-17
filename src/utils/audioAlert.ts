/**
 * Web Audio API synthesizer for emergency siren sound alerts
 */

class AudioAlertService {
  private audioCtx: AudioContext | null = null;
  private isPlaying = false;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  /**
   * Play synthesized emergency siren sound
   */
  public playEmergencySiren(durationSeconds = 3): void {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.stop();

      this.isPlaying = true;
      this.oscillator = this.audioCtx.createOscillator();
      this.gainNode = this.audioCtx.createGain();

      this.oscillator.type = 'sawtooth';

      // Siren frequency modulation (900 Hz to 1200 Hz sweep)
      const now = this.audioCtx.currentTime;
      this.oscillator.frequency.setValueAtTime(900, now);
      this.oscillator.frequency.linearRampToValueAtTime(1200, now + 0.4);
      this.oscillator.frequency.linearRampToValueAtTime(900, now + 0.8);

      this.gainNode.gain.setValueAtTime(0.2, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.01, now + durationSeconds);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator.start(now);
      this.oscillator.stop(now + durationSeconds);

      setTimeout(() => {
        this.isPlaying = false;
      }, durationSeconds * 1000);
    } catch (err) {
      console.warn('Audio alert unavailable:', err);
    }
  }

  /**
   * Stop active audio siren
   */
  public stop(): void {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
        this.oscillator.disconnect();
      } catch {}
      this.oscillator = null;
    }
    this.isPlaying = false;
  }
}

export const audioAlert = new AudioAlertService();
