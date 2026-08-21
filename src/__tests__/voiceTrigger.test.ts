import { describe, it, expect } from 'vitest';
import {
  evaluateVoiceTrigger,
  normalizeSpeechText,
  DEFAULT_TRIGGER_PHRASES,
} from '../utils/voiceTrigger';

describe('Voice Trigger Phrase Detection Utility', () => {
  describe('normalizeSpeechText', () => {
    it('lowercases and strips punctuation', () => {
      expect(normalizeSpeechText('HELP ME! Save Shield, SOS.')).toBe('help me save shield sos');
    });

    it('handles empty strings gracefully', () => {
      expect(normalizeSpeechText('')).toBe('');
    });
  });

  describe('evaluateVoiceTrigger', () => {
    it('detects exact trigger phrases like "help me"', () => {
      const result = evaluateVoiceTrigger('Please somebody help me right now!');
      expect(result.isTriggered).toBe(true);
      expect(result.detectedPhrase).toBe('help me');
      expect(result.confidence).toBeGreaterThan(0.9);
    });

    it('detects "emergency" keyword', () => {
      const result = evaluateVoiceTrigger('This is an emergency Situation!');
      expect(result.isTriggered).toBe(true);
      expect(result.detectedPhrase).toBe('emergency');
    });

    it('detects multiple emergency keywords', () => {
      const result = evaluateVoiceTrigger('sos help near river');
      expect(result.isTriggered).toBe(true);
      expect(result.confidence).toBeGreaterThan(0.6);
    });

    it('does not trigger on casual non-emergency conversation', () => {
      const result = evaluateVoiceTrigger('Hey, how are you doing today? Beautiful weather.');
      expect(result.isTriggered).toBe(false);
      expect(result.confidence).toBeLessThan(0.5);
    });
  });
});
