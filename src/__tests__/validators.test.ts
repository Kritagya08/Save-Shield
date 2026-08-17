import { describe, it, expect } from 'vitest';
import {
  validatePhoneNumber,
  validateEmail,
  validateContactName,
  sanitizeInput,
} from '../utils/validators';

describe('Input Validators Utility', () => {
  describe('validatePhoneNumber', () => {
    it('approves valid phone numbers', () => {
      expect(validatePhoneNumber('+12345678901').isValid).toBe(true);
      expect(validatePhoneNumber('9876543210').isValid).toBe(true);
      expect(validatePhoneNumber('+91 98765-43210').isValid).toBe(true);
    });

    it('rejects invalid or empty phone numbers', () => {
      expect(validatePhoneNumber('').isValid).toBe(false);
      expect(validatePhoneNumber('123').isValid).toBe(false);
      expect(validatePhoneNumber('abc-def-ghij').isValid).toBe(false);
    });
  });

  describe('validateEmail', () => {
    it('approves valid email addresses', () => {
      expect(validateEmail('user@saveshield.org').isValid).toBe(true);
      expect(validateEmail('emergency.contact@domain.co.in').isValid).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email').isValid).toBe(false);
      expect(validateEmail('@domain.com').isValid).toBe(false);
      expect(validateEmail('').isValid).toBe(false);
    });
  });

  describe('validateContactName', () => {
    it('approves valid contact names', () => {
      expect(validateContactName('Jane Doe').isValid).toBe(true);
      expect(validateContactName('Mom').isValid).toBe(true);
    });

    it('rejects names that are too short or empty', () => {
      expect(validateContactName('A').isValid).toBe(false);
      expect(validateContactName('').isValid).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('escapes HTML special characters', () => {
      const unsafe = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(unsafe);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('&lt;script&gt;');
    });
  });
});
