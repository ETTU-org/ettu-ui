/**
 * Configuration des informations légales pour ETTU
 * 
 * Ce fichier centralise toutes les informations légales utilisées
 * dans les documents CGU, Politique de Confidentialité et Mentions Légales.
 * 
 * ⚠️ IMPORTANT : Mettez à jour ces informations avant le déploiement !
 */

export const LEGAL_CONFIG = {
  // Informations sur le responsable/éditeur
  editor: {
    name: "BOSSIS--GUYON Jules",
    email: "contact.ettu@gmail.com",
    status: "Développeur indépendant",
    quality: "Développeur et responsable de l'application ETTU"
  },

  // Informations sur l'application
  app: {
    name: "ETTU",
    fullName: "ETTU - Outil d'organisation pour développeurs",
    description: "Application web de gestion de notes et de snippets de code",
    version: "1.0",
    technology: "React, TypeScript, Vite",
    license: "MIT License"
  },

  // Informations d'hébergement (à adapter selon votre choix)
  hosting: {
    platform: "À définir (GitHub Pages, Netlify, ou Vercel)",
    location: "Serveurs en Europe/États-Unis",
    security: "HTTPS, certificats SSL",
    provider: "À compléter selon le choix final"
  },

  // Repository et code source
  repository: {
    platform: "GitHub",
    url: "GitHub (lien à définir)", // À compléter
    organization: "ettu-org" // À adapter si nécessaire
  },

  // Dates importantes
  dates: {
    lastUpdate: () => new Date().toLocaleDateString('fr-FR'),
    effectiveDate: () => new Date().toLocaleDateString('fr-FR')
  },

  // Informations de contact
  contact: {
    email: "contact.ettu@gmail.com",
    subject: "[ETTU] Contact légal",
    responseTime: "Sous 72 heures",
    legalSubject: "[ETTU] Mentions légales",
    privacySubject: "[ETTU] Données personnelles",
    cguSubject: "[ETTU] Conditions d'utilisation"
  },

  // Informations CNIL (autorité de contrôle)
  cnil: {
    name: "CNIL",
    address: "3 Place de Fontenoy - TSA 80715",
    postalCode: "75334 PARIS CEDEX 07",
    phone: "01 53 73 22 22",
    website: "www.cnil.fr"
  },

  // Juridiction et droit applicable
  jurisdiction: {
    law: "Droit français",
    court: "Tribunaux français",
    language: "Français"
  },

  // Fonctionnalités de l'application (pour les documents légaux)
  features: {
    storage: "Local (localStorage du navigateur)",
    dataTransfer: "Aucune transmission vers des serveurs externes",
    cookies: "Aucun cookie de tracking",
    thirdParty: "Aucun service tiers",
    analytics: "Aucune analyse ou tracking"
  },

  // URLs des documents légaux
  urls: {
    legal: "/legal",
    cgu: "/cgu",
    privacy: "/privacy-policy",
    legalNotice: "/legal-notice"
  }
};

// Fonctions utilitaires pour accéder aux informations
export const getLegalInfo = () => LEGAL_CONFIG;
export const getEditorInfo = () => LEGAL_CONFIG.editor;
export const getAppInfo = () => LEGAL_CONFIG.app;
export const getContactInfo = () => LEGAL_CONFIG.contact;
export const getCurrentDate = () => new Date().toLocaleDateString('fr-FR');
