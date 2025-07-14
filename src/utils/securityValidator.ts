/**
 * Module de validation sécurisé pour ETTU
 * Valide et sanitise les entrées utilisateur pour éviter les vulnérabilités
 */

import validator from 'validator';
import DOMPurify from 'dompurify';

/**
 * Configuration de sécurité pour la validation
 */
const SECURITY_CONFIG = {
  maxLength: {
    title: 200,
    note: 50000,
    snippet: 10000,
    filename: 100
  },
  patterns: {
    filename: /^[a-zA-Z0-9._-]+$/,
    safeString: /^[a-zA-Z0-9\s\-._,!?():;'"]+$/
  }
};

/**
 * Valide et sanitise un nom de fichier
 */
export function validateFilename(filename: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Vérifier la longueur
  if (filename.length > SECURITY_CONFIG.maxLength.filename) {
    errors.push(`Nom de fichier trop long (max ${SECURITY_CONFIG.maxLength.filename} caractères)`);
  }
  
  // Vérifier les caractères dangereux
  if (!SECURITY_CONFIG.patterns.filename.test(filename)) {
    errors.push('Nom de fichier contient des caractères non autorisés');
  }
  
  // Vérifier les extensions dangereuses
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js', '.jar'];
  const hasExtension = dangerousExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  if (hasExtension) {
    errors.push('Extension de fichier non autorisée');
  }
  
  // Sanitiser
  const sanitized = validator.escape(filename)
    .replace(/[<>:"/\\|?*]/g, '')
    .trim();
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
}

/**
 * Valide et sanitise le contenu d'une note
 */
export function validateNoteContent(content: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Vérifier la longueur
  if (content.length > SECURITY_CONFIG.maxLength.note) {
    errors.push(`Contenu trop long (max ${SECURITY_CONFIG.maxLength.note} caractères)`);
  }
  
  // Détecter les scripts malveillants
  const scriptPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi,
    /&lt;script/gi,
    /&gt;.*?&lt;\/script&gt;/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi
  ];
  
  const hasScript = scriptPatterns.some(pattern => pattern.test(content));
  if (hasScript) {
    errors.push('Contenu contient du code potentiellement dangereux');
  }
  
  // Sanitiser le contenu Markdown (garde la structure Markdown mais nettoie le HTML)
  const sanitized = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
}

/**
 * Valide et sanitise le contenu d'un snippet
 */
export function validateSnippetContent(content: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Vérifier la longueur
  if (content.length > SECURITY_CONFIG.maxLength.snippet) {
    errors.push(`Snippet trop long (max ${SECURITY_CONFIG.maxLength.snippet} caractères)`);
  }
  
  // Pour les snippets, on est plus permissif car c'est du code
  // Mais on vérifie quand même les patterns dangereux
  const dangerousPatterns = [
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi
  ];
  
  const hasDangerous = dangerousPatterns.some(pattern => pattern.test(content));
  if (hasDangerous) {
    errors.push('Snippet contient du code potentiellement dangereux');
  }
  
  // Sanitisation légère pour les snippets (on garde le code mais enlève les balises HTML)
  const sanitized = content.replace(/<[^>]*>/g, '');
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
}

/**
 * Valide une URL
 */
export function validateUrl(url: string): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Vérifier les domaines dangereux d'abord
  const dangerousDomains = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:'
  ];
  
  const isDangerous = dangerousDomains.some(domain => url.toLowerCase().startsWith(domain));
  if (isDangerous) {
    errors.push('URL contient un protocole dangereux');
  }
  
  // Vérifier avec une approche plus basique pour les URLs HTTP/HTTPS
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      errors.push('Protocole non autorisé');
    }
  } catch {
    // Si URL() échoue, essayer avec validator
    if (!validator.isURL(url, {
      protocols: ['http', 'https'],
      require_protocol: true,
      allow_underscores: true
    })) {
      errors.push('URL invalide');
    }
  }
  
  const sanitized = validator.escape(url);
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
}

/**
 * Valide une chaîne générique
 */
export function validateString(input: string, maxLength: number = 1000): {
  isValid: boolean;
  sanitized: string;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (input.length > maxLength) {
    errors.push(`Texte trop long (max ${maxLength} caractères)`);
  }
  
  const sanitized = validator.escape(input);
  
  return {
    isValid: errors.length === 0,
    sanitized,
    errors
  };
}

/**
 * Interface pour les logs de sécurité
 */
interface SecurityLog {
  timestamp: string;
  event: string;
  details: Record<string, unknown>;
  userAgent: string;
  url: string;
}

/**
 * Fonction utilitaire pour logger les tentatives d'attaque
 */
export function logSecurityEvent(event: string, details: Record<string, unknown>): void {
  const securityLog: SecurityLog = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.warn('🚨 Événement de sécurité détecté:', securityLog);
  
  // En production, on pourrait envoyer cela à un service de monitoring
  // ou le stocker dans localStorage pour analyse
  try {
    const existingLogs = JSON.parse(localStorage.getItem('security-logs') || '[]');
    existingLogs.push(securityLog);
    
    // Garder seulement les 100 derniers logs
    if (existingLogs.length > 100) {
      existingLogs.splice(0, existingLogs.length - 100);
    }
    
    localStorage.setItem('security-logs', JSON.stringify(existingLogs));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du log de sécurité:', error);
  }
}

/**
 * Fonction pour récupérer les logs de sécurité
 */
export function getSecurityLogs(): SecurityLog[] {
  try {
    return JSON.parse(localStorage.getItem('security-logs') || '[]');
  } catch (error) {
    console.error('Erreur lors de la récupération des logs de sécurité:', error);
    return [];
  }
}

/**
 * Fonction pour nettoyer les logs de sécurité
 */
export function clearSecurityLogs(): void {
  localStorage.removeItem('security-logs');
}
