/**
 * Tests de sécurité pour ETTU
 * Vérifie la protection contre les XSS et la validation des entrées
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import { 
  validateNoteContent, 
  validateFilename, 
  validateUrl, 
  validateSnippetContent,
  logSecurityEvent,
  getSecurityLogs,
  clearSecurityLogs
} from '../utils/securityValidator';

// Configuration du DOM pour DOMPurify
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const window = dom.window as unknown as Window & typeof globalThis;

// Configuration de DOMPurify avec le DOM simulé
const purify = DOMPurify(window);

describe('Tests de sécurité - Protection XSS', () => {
  beforeEach(() => {
    clearSecurityLogs();
  });

  afterEach(() => {
    clearSecurityLogs();
  });

  describe('DOMPurify - Sanitisation HTML', () => {
    it('devrait nettoyer les balises script', () => {
      const maliciousInput = '<script>alert("XSS")</script>Hello';
      const sanitized = purify.sanitize(maliciousInput);
      expect(sanitized).toBe('Hello');
      expect(sanitized).not.toContain('<script>');
    });

    it('devrait nettoyer les handlers d\'événements', () => {
      const maliciousInput = '<img src="x" onerror="alert(\'XSS\')">';
      const sanitized = purify.sanitize(maliciousInput);
      expect(sanitized).not.toContain('onerror');
      expect(sanitized).not.toContain('alert');
    });

    it('devrait nettoyer les URLs javascript:', () => {
      const maliciousInput = '<a href="javascript:alert(\'XSS\')">Click me</a>';
      const sanitized = purify.sanitize(maliciousInput);
      expect(sanitized).not.toContain('javascript:');
    });

    it('devrait préserver le contenu Markdown légitime', () => {
      const legitInput = '# Titre\n\n**Gras** et *italique*\n\n`code`';
      const sanitized = purify.sanitize(legitInput);
      expect(sanitized).toContain('Titre');
      expect(sanitized).toContain('Gras');
      expect(sanitized).toContain('italique');
      expect(sanitized).toContain('code');
    });
  });

  describe('Validation des noms de fichiers', () => {
    it('devrait accepter les noms de fichiers valides', () => {
      const result = validateFilename('note-test.md');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('devrait rejeter les noms de fichiers avec caractères dangereux', () => {
      const result = validateFilename('note<script>.md');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('devrait rejeter les extensions dangereuses', () => {
      const result = validateFilename('malware.exe');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('Extension'))).toBe(true);
    });

    it('devrait rejeter les noms de fichiers trop longs', () => {
      const longName = 'a'.repeat(200) + '.md';
      const result = validateFilename(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('trop long'))).toBe(true);
    });
  });

  describe('Validation du contenu des notes', () => {
    it('devrait accepter le contenu Markdown légitime', () => {
      const content = '# Titre\n\n**Gras** et *italique*\n\n```javascript\nconsole.log("test");\n```';
      const result = validateNoteContent(content);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('devrait détecter les scripts malveillants', () => {
      const content = '# Note\n\n<script>alert("XSS")</script>';
      const result = validateNoteContent(content);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('dangereux'))).toBe(true);
    });

    it('devrait détecter les liens javascript:', () => {
      const content = '[Click me](javascript:alert("XSS"))';
      const result = validateNoteContent(content);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('dangereux'))).toBe(true);
    });

    it('devrait détecter les handlers d\'événements', () => {
      const content = '<img src="x" onerror="alert(\'XSS\')">';
      const result = validateNoteContent(content);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('dangereux'))).toBe(true);
    });

    it('devrait rejeter le contenu trop long', () => {
      const longContent = 'a'.repeat(60000);
      const result = validateNoteContent(longContent);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('trop long'))).toBe(true);
    });
  });

  describe('Validation des URLs', () => {
    it('devrait accepter les URLs HTTPS valides', () => {
      const result = validateUrl('https://example.com');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('devrait accepter les URLs HTTP valides', () => {
      const result = validateUrl('http://localhost:3000');
      console.log('URL validation result:', result);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('devrait rejeter les URLs javascript:', () => {
      const result = validateUrl('javascript:alert("XSS")');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('dangereux'))).toBe(true);
    });

    it('devrait rejeter les URLs data:', () => {
      const result = validateUrl('data:text/html,<script>alert("XSS")</script>');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('dangereux'))).toBe(true);
    });

    it('devrait rejeter les URLs malformées', () => {
      const result = validateUrl('not-an-url');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('invalide'))).toBe(true);
    });
  });

  describe('Validation des snippets', () => {
    it('devrait accepter le code légitime', () => {
      const code = 'function test() {\n  console.log("Hello");\n}';
      const result = validateSnippetContent(code);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('devrait détecter les fonctions dangereuses', () => {
      const code = 'eval("alert(\'XSS\')")';
      const result = validateSnippetContent(code);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('dangereux'))).toBe(true);
    });

    it('devrait détecter setTimeout avec code string', () => {
      const code = 'setTimeout("alert(\'XSS\')", 1000)';
      const result = validateSnippetContent(code);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('dangereux'))).toBe(true);
    });

    it('devrait rejeter les snippets trop longs', () => {
      const longCode = 'a'.repeat(15000);
      const result = validateSnippetContent(longCode);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('trop long'))).toBe(true);
    });
  });

  describe('Logging des événements de sécurité', () => {
    it('devrait enregistrer les événements de sécurité', () => {
      logSecurityEvent('test_event', { test: 'data' });
      const logs = getSecurityLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].event).toBe('test_event');
      expect(logs[0].details.test).toBe('data');
    });

    it('devrait limiter le nombre de logs', () => {
      // Créer plus de 100 logs
      for (let i = 0; i < 105; i++) {
        logSecurityEvent(`test_event_${i}`, { index: i });
      }
      const logs = getSecurityLogs();
      expect(logs.length).toBeLessThanOrEqual(100);
    });

    it('devrait nettoyer les logs', () => {
      logSecurityEvent('test_event', { test: 'data' });
      expect(getSecurityLogs()).toHaveLength(1);
      clearSecurityLogs();
      expect(getSecurityLogs()).toHaveLength(0);
    });
  });
});

describe('Tests d\'intégration - Scénarios d\'attaque XSS', () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src="x" onerror="alert(\'XSS\')">',
    '<svg onload="alert(\'XSS\')">',
    'javascript:alert("XSS")',
    '<iframe src="javascript:alert(\'XSS\')">',
    '<input type="text" value="&quot;&gt;&lt;script&gt;alert(\'XSS\')&lt;/script&gt;">',
    '<div onclick="alert(\'XSS\')">Click me</div>',
    '<a href="data:text/html,<script>alert(\'XSS\')</script>">Link</a>',
    '<style>body{background:url("javascript:alert(\'XSS\')")}</style>',
    '<meta http-equiv="refresh" content="0;url=javascript:alert(\'XSS\')">',
  ];

  it('devrait bloquer tous les payloads XSS connus', () => {
    xssPayloads.forEach(payload => {
      const contentResult = validateNoteContent(payload);
      const sanitized = purify.sanitize(payload);
      
      // Au moins une des deux protections doit fonctionner
      // ET le résultat sanitisé ne doit pas contenir de code potentiellement dangereux
      const isBlocked = !contentResult.isValid || 
                       (!sanitized.includes('alert') && 
                        !sanitized.includes('<script>') && 
                        !sanitized.includes('javascript:') &&
                        !sanitized.includes('onerror=') &&
                        !sanitized.includes('onload='));
      
      // Debug pour voir quel payload passe
      if (!isBlocked) {
        console.log('Payload XSS non bloqué:', payload);
        console.log('Validation:', contentResult);
        console.log('Sanitized:', sanitized);
      }
      
      expect(isBlocked).toBe(true);
    });
  });

  it('devrait tracer les tentatives d\'injection XSS', () => {
    clearSecurityLogs();
    
    xssPayloads.forEach(payload => {
      const result = validateNoteContent(payload);
      if (!result.isValid) {
        logSecurityEvent('invalid_content_attempted', {
          errors: result.errors,
          payload: payload
        });
      }
    });
    
    const logs = getSecurityLogs();
    expect(logs.length).toBeGreaterThan(0);
    
    const xssLogs = logs.filter(log => 
      log.event === 'invalid_content_attempted'
    );
    expect(xssLogs.length).toBeGreaterThan(0);
  });
});
