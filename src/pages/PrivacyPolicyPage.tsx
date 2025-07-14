import React from "react";
import Layout from "../layouts/Layout";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-gray-100">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Politique de Confidentialité
          </h1>

          <div className="space-y-8">
            <section>
              <p className="text-sm text-gray-400 mb-4">
                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
              </p>

              <p className="mb-4 text-gray-300 leading-relaxed">
                Cette politique de confidentialité décrit comment ETTU collecte,
                utilise et protège vos informations personnelles lorsque vous
                utilisez notre application.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                1. Responsable du traitement
              </h2>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>Nom :</strong> BOSSIS--GUYON Jules
                </p>
                <p className="text-gray-300">
                  <strong>Email :</strong> julesbossis@gmail.com
                </p>
                <p className="text-gray-300">
                  <strong>Qualité :</strong> Développeur et responsable de
                  l'application ETTU
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                2. Données collectées
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                L'application ETTU est conçue pour fonctionner localement sur
                votre appareil. Nous collectons et traitons les types de données
                suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  <strong>Contenu des notes :</strong> Texte, code et
                  métadonnées que vous saisissez
                </li>
                <li>
                  <strong>Snippets de code :</strong> Fragments de code que vous
                  sauvegardez
                </li>
                <li>
                  <strong>Préférences utilisateur :</strong> Paramètres de
                  l'interface et de l'éditeur
                </li>
                <li>
                  <strong>Données techniques :</strong> Informations nécessaires
                  au bon fonctionnement de l'application
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                3. Base légale du traitement
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Le traitement de vos données personnelles est basé sur :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  <strong>Votre consentement :</strong> Pour l'utilisation de
                  l'application
                </li>
                <li>
                  <strong>Exécution d'un contrat :</strong> Pour fournir les
                  services demandés
                </li>
                <li>
                  <strong>Intérêt légitime :</strong> Pour améliorer
                  l'application et corriger les bugs
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                4. Stockage et sécurité
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Vos données sont stockées localement sur votre appareil :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Utilisation du localStorage du navigateur</li>
                <li>Aucune transmission vers des serveurs externes</li>
                <li>Données chiffrées selon les standards du navigateur</li>
                <li>Accès limité aux données de votre session</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                5. Partage des données
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Nous ne partageons, ne vendons, ni ne transférons vos données
                personnelles à des tiers, sauf dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Obligation légale ou réglementaire</li>
                <li>Protection de nos droits et sécurité</li>
                <li>Avec votre consentement explicite</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                6. Durée de conservation
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Vos données sont conservées :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Tant que vous utilisez l'application</li>
                <li>Jusqu'à suppression manuelle de votre part</li>
                <li>Jusqu'à vidage du cache/localStorage du navigateur</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                7. Vos droits
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>
                  <strong>Droit d'accès :</strong> Consulter vos données
                  personnelles
                </li>
                <li>
                  <strong>Droit de rectification :</strong> Corriger vos données
                </li>
                <li>
                  <strong>Droit d'effacement :</strong> Supprimer vos données
                </li>
                <li>
                  <strong>Droit d'opposition :</strong> Vous opposer au
                  traitement
                </li>
                <li>
                  <strong>Droit à la portabilité :</strong> Récupérer vos
                  données
                </li>
                <li>
                  <strong>Droit de limitation :</strong> Limiter le traitement
                </li>
              </ul>
              <p className="mt-4 text-gray-300">
                Pour exercer vos droits, contactez-nous à :{" "}
                <strong className="text-blue-400">julesbossis@gmail.com</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                8. Cookies et technologies similaires
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                L'application utilise le localStorage du navigateur pour :
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-300">
                <li>Sauvegarder vos notes et snippets</li>
                <li>Mémoriser vos préférences</li>
                <li>Améliorer l'expérience utilisateur</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                9. Modifications de cette politique
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Nous pouvons modifier cette politique de confidentialité à tout
                moment. Les modifications seront effectives dès leur publication
                sur cette page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                10. Contact
              </h2>
              <div className="bg-blue-900 p-4 rounded-lg">
                <p className="mb-2 text-gray-300">
                  Pour toute question concernant cette politique de
                  confidentialité ou l'exercice de vos droits :
                </p>
                <p className="text-gray-300">
                  <strong>Email :</strong> julesbossis@gmail.com
                </p>
                <p className="text-gray-300">
                  <strong>Délai de réponse :</strong> Sous 30 jours maximum
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                11. Autorité de contrôle
              </h2>
              <p className="mb-4 text-gray-300 leading-relaxed">
                Vous avez le droit d'introduire une réclamation auprès de la
                CNIL :
              </p>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-300">
                  <strong>CNIL</strong>
                </p>
                <p className="text-gray-300">3 Place de Fontenoy - TSA 80715</p>
                <p className="text-gray-300">75334 PARIS CEDEX 07</p>
                <p className="text-gray-300">Téléphone : 01 53 73 22 22</p>
                <p className="text-gray-300">Site web : www.cnil.fr</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;
