import React from "react";
import Layout from "../layouts/Layout";

const LegalNoticePage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-gray-100">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Mentions Légales
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                1. Informations sur l'éditeur
              </h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Nom :</strong> BOSSIS--GUYON Jules
                </p>
                <p className="text-gray-300">
                  <strong>Qualité :</strong> Développeur indépendant
                </p>
                <p className="text-gray-300">
                  <strong>Email :</strong> contact.ettu@gmail.com
                </p>
                <p className="text-gray-300">
                  <strong>Statut :</strong> Personne physique
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                2. Description du service
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                <strong>ETTU</strong> est une application web de gestion de
                notes et de snippets de code développée en React/TypeScript.
                L'application fonctionne entièrement côté client (frontend) et
                stocke les données localement dans le navigateur.
              </p>
              <div className="bg-blue-900 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Type :</strong> Application web gratuite
                </p>
                <p className="text-gray-300">
                  <strong>Technologie :</strong> React, TypeScript, Vite
                </p>
                <p className="text-gray-300">
                  <strong>Hébergement :</strong> GitHub Pages / Netlify / Vercel
                </p>
                <p className="text-gray-300">
                  <strong>Stockage :</strong> Local (localStorage du navigateur)
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                3. Hébergement
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                L'application est hébergée sur une plateforme d'hébergement web
                :
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Plateforme :</strong> À définir (GitHub Pages,
                  Netlify, ou Vercel)
                </p>
                <p className="text-gray-300">
                  <strong>Localisation :</strong> Serveurs en Europe/États-Unis
                </p>
                <p className="text-gray-300">
                  <strong>Sécurité :</strong> HTTPS, certificats SSL
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                4. Propriété intellectuelle
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                L'application ETTU et son code source sont protégés par le droit
                d'auteur :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  <strong>Code source :</strong> Licence MIT (usage libre avec
                  attribution)
                </li>
                <li>
                  <strong>Interface utilisateur :</strong> Création originale
                </li>
                <li>
                  <strong>Bibliothèques tierces :</strong> Soumises à leurs
                  licences respectives
                </li>
                <li>
                  <strong>Contenu utilisateur :</strong> Reste la propriété de
                  l'utilisateur
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                5. Utilisation du service
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                L'utilisation de l'application ETTU est soumise aux conditions
                suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Usage personnel et professionnel autorisé</li>
                <li>Respect des lois en vigueur</li>
                <li>Pas d'utilisation malveillante ou nuisible</li>
                <li>Respect des droits d'auteur sur le contenu créé</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                6. Limitations de responsabilité
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                L'éditeur ne saurait être tenu responsable :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  De la perte de données due à des dysfonctionnements techniques
                </li>
                <li>De l'interruption temporaire ou définitive du service</li>
                <li>De l'usage fait par l'utilisateur de l'application</li>
                <li>Des dommages indirects résultant de l'utilisation</li>
              </ul>
              <div className="bg-yellow-900 p-4 rounded-lg mt-4">
                <p className="text-yellow-200">
                  <strong>⚠️ Recommandation :</strong> Effectuez régulièrement
                  des sauvegardes de vos données importantes via la fonction
                  d'export.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                7. Données personnelles
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Le traitement des données personnelles est régi par notre
                <a
                  href="/privacy-policy"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Politique de Confidentialité
                </a>
                .
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Principe :</strong> Minimisation des données
                  collectées
                </p>
                <p className="text-gray-300">
                  <strong>Stockage :</strong> Local uniquement (localStorage)
                </p>
                <p className="text-gray-300">
                  <strong>Conformité :</strong> RGPD (Règlement Général sur la
                  Protection des Données)
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                8. Droit applicable
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Les présentes mentions légales sont soumises au droit français.
                En cas de litige, les tribunaux français seront compétents.
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Droit applicable :</strong> Droit français
                </p>
                <p className="text-gray-300">
                  <strong>Juridiction :</strong> Tribunaux français
                </p>
                <p className="text-gray-300">
                  <strong>Langue :</strong> Français
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                9. Cookies et technologies de suivi
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                L'application utilise uniquement les technologies suivantes :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  <strong>localStorage :</strong> Stockage local des données
                  utilisateur
                </li>
                <li>
                  <strong>sessionStorage :</strong> Données temporaires de
                  session
                </li>
                <li>
                  <strong>Aucun cookie :</strong> Pas de tracking ou d'analyse
                </li>
                <li>
                  <strong>Aucun service tiers :</strong> Pas de Google
                  Analytics, etc.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                10. Open Source
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                L'application ETTU est un projet open source :
              </p>
              <div className="bg-green-900 p-4 rounded-lg">
                <p className="text-green-200">
                  <strong>Repository :</strong> GitHub (lien à définir)
                </p>
                <p className="text-green-200">
                  <strong>Licence :</strong> MIT License
                </p>
                <p className="text-green-200">
                  <strong>Contributions :</strong> Ouvertes à la communauté
                </p>
                <p className="text-green-200">
                  <strong>Documentation :</strong> Disponible sur GitHub
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                11. Contact
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Pour toute question concernant ces mentions légales :
              </p>
              <div className="bg-blue-900 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Email :</strong> contact.ettu@gmail.com
                </p>
                <p className="text-gray-300">
                  <strong>Objet :</strong> [ETTU] Mentions légales
                </p>
                <p className="text-gray-300">
                  <strong>Délai de réponse :</strong> Sous 72 heures
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                12. Mise à jour
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Ces mentions légales peuvent être modifiées à tout moment. La
                version en vigueur est celle publiée sur cette page.
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Dernière mise à jour :</strong>{" "}
                  {new Date().toLocaleDateString("fr-FR")}
                </p>
                <p className="text-gray-300">
                  <strong>Version :</strong> 1.0
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LegalNoticePage;
