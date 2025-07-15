/**
 * Conditions Générales d'Utilisation (CGU)
 * Application ETTU - Outil de gestion de notes et snippets
 *
 * @author BOSSIS--GUYON Jules
 * @contact julesbossis@gmail.com
 * @date 14 juillet 2025
 */

import Layout from "../layouts/Layout";

export default function CGUPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-gray-100">
          <h1 className="text-3xl font-bold mb-8 text-center">
            Conditions Générales d'Utilisation
          </h1>

          <div className="space-y-8">
            {/* Article 1 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 1 - Objet et champ d'application
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (CGU) régissent
                l'utilisation de l'application ETTU, un outil de gestion de
                notes techniques et de snippets de code, développée par Jules
                BOSSIS--GUYON.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                L'utilisation de l'application implique l'acceptation pleine et
                entière des présentes CGU.
              </p>
            </section>

            {/* Article 2 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 2 - Définitions
              </h2>
              <ul className="text-gray-300 leading-relaxed space-y-2">
                <li>
                  <strong>Application</strong> : L'outil ETTU accessible via
                  l'interface web
                </li>
                <li>
                  <strong>Utilisateur</strong> : Toute personne utilisant
                  l'application
                </li>
                <li>
                  <strong>Éditeur</strong> : Jules BOSSIS--GUYON, développeur de
                  l'application
                </li>
                <li>
                  <strong>Contenu</strong> : Notes, snippets de code, et autres
                  données créées par l'utilisateur
                </li>
              </ul>
            </section>

            {/* Article 3 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 3 - Accès et utilisation
              </h2>
              <p className="text-gray-300 leading-relaxed">
                L'application ETTU est accessible gratuitement à tout
                utilisateur disposant d'un accès internet et d'un navigateur web
                compatible.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                L'utilisateur s'engage à :
              </p>
              <ul className="text-gray-300 leading-relaxed mt-2 ml-6 space-y-1">
                <li>
                  • Utiliser l'application de manière conforme à sa destination
                </li>
                <li>
                  • Ne pas porter atteinte au bon fonctionnement de
                  l'application
                </li>
                <li>
                  • Ne pas utiliser l'application à des fins illégales ou non
                  autorisées
                </li>
                <li>• Respecter les droits de propriété intellectuelle</li>
              </ul>
            </section>

            {/* Article 4 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 4 - Stockage des données
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Les données créées par l'utilisateur (notes, snippets) sont
                stockées localement dans le navigateur via le localStorage.
                Aucune donnée n'est transmise ou stockée sur des serveurs
                externes.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                L'utilisateur est responsable de la sauvegarde de ses données.
                L'éditeur ne peut être tenu responsable de la perte de données
                due à des problèmes techniques, une suppression accidentelle ou
                la réinitialisation du navigateur.
              </p>
            </section>

            {/* Article 5 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 5 - Propriété intellectuelle
              </h2>
              <p className="text-gray-300 leading-relaxed">
                L'application ETTU et son code source sont la propriété
                exclusive de Jules BOSSIS--GUYON. Tous les droits de propriété
                intellectuelle sont réservés.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                Les contenus créés par l'utilisateur (notes, snippets) restent
                la propriété exclusive de l'utilisateur.
              </p>
            </section>

            {/* Article 6 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 6 - Responsabilité
              </h2>
              <p className="text-gray-300 leading-relaxed">
                L'application est fournie "en l'état" sans garantie d'aucune
                sorte. L'éditeur ne peut être tenu responsable des dommages
                directs ou indirects résultant de l'utilisation ou de
                l'impossibilité d'utiliser l'application.
              </p>
              <p className="text-gray-300 leading-relaxed mt-4">
                L'utilisateur utilise l'application sous sa seule
                responsabilité.
              </p>
            </section>

            {/* Article 7 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 7 - Disponibilité
              </h2>
              <p className="text-gray-300 leading-relaxed">
                L'éditeur s'efforce d'assurer la disponibilité de l'application
                mais ne peut garantir un accès ininterrompu. L'application peut
                être temporairement indisponible pour maintenance ou mise à
                jour.
              </p>
            </section>

            {/* Article 8 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 8 - Modifications
              </h2>
              <p className="text-gray-300 leading-relaxed">
                L'éditeur se réserve le droit de modifier les présentes CGU à
                tout moment. Les modifications entrent en vigueur dès leur
                publication. Il est conseillé aux utilisateurs de consulter
                régulièrement les CGU.
              </p>
            </section>

            {/* Article 9 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 9 - Droit applicable et juridiction
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Les présentes CGU sont régies par le droit français. En cas de
                litige, les tribunaux français seront seuls compétents.
              </p>
            </section>

            {/* Article 10 */}
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Article 10 - Contact
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Pour toute question relative aux présentes CGU, vous pouvez
                contacter :
              </p>
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-300">
                  <strong>Jules BOSSIS--GUYON</strong>
                  <br />
                  Email :{" "}
                  <a
                    href="mailto:julesbossis@gmail.com"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    julesbossis@gmail.com
                  </a>
                </p>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              Dernière mise à jour : 14 juillet 2025
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
