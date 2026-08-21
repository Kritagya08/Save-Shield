/**
 * Voice trigger phrase detection utility for emergency hands-free SOS activation
 */

export interface VoiceTriggerResult {
  isTriggered: boolean;
  detectedPhrase?: string;
  confidence: number; // 0 to 1
}

export const DEFAULT_TRIGGER_PHRASES = [
  'help me',
  'emergency',
  'save shield sos',
  'call for help',
  'i am in danger',
  'danger alert',
  'sos emergency',
];

/**
 * Normalizes input text for speech recognition matching
 */
export function normalizeSpeechText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Evaluates transcript against registered emergency trigger phrases
 */
export function evaluateVoiceTrigger(
  transcript: string,
  triggerPhrases: string[] = DEFAULT_TRIGGER_PHRASES,
  confidenceThreshold = 0.6
): VoiceTriggerResult {
  const normalized = normalizeSpeechText(transcript);

  if (!normalized) {
    return { isTriggered: false, confidence: 0 };
  }

  for (const phrase of triggerPhrases) {
    const normalizedPhrase = normalizeSpeechText(phrase);

    if (normalized.includes(normalizedPhrase)) {
      return {
        isTriggered: true,
        detectedPhrase: phrase,
        confidence: 0.95,
      };
    }
  }

  // Check fuzzy keyword overlap
  const words = normalized.split(' ');
  const emergencyKeywords = ['help', 'danger', 'emergency', 'sos', 'distress'];
  const matchedKeywords = words.filter(w => emergencyKeywords.includes(w));

  if (matchedKeywords.length >= 2) {
    return {
      isTriggered: true,
      detectedPhrase: matchedKeywords.join(' '),
      confidence: Math.min(0.9, 0.5 + matchedKeywords.length * 0.2),
    };
  }

  return { isTriggered: false, confidence: 0.1 };
}
