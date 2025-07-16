import Layout from "../layouts/Layout";

/**
 * Page À propos (About)
 * Application ETTU - Outil de gestion de notes et snippets
 *
 * @author BOSSIS--GUYON Jules
 * @contact contact.ettu@gmail.com
 * @date 14 juillet 2025
 */

export default function AboutPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-gray-100">
          <h1 className="text-3xl font-bold mb-8 text-center">
            À propos d'ETTU
          </h1>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Présentation du projet
              </h2>
              <p className="text-gray-300 leading-relaxed">
                <strong>ETTU</strong> est une application web conçue pour
                faciliter la gestion de notes techniques et de snippets de code.
                Elle s'adresse aux développeurs, étudiants et passionnés de
                technologie souhaitant organiser efficacement leurs
                connaissances et fragments de code dans un environnement
                moderne, sécurisé et intuitif.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Inscription sécurisée
              </h2>
              <p className="text-gray-300 leading-relaxed">
                L'accès à ETTU nécessite une inscription rapide et sécurisée.
                Vos données restent privées et ne sont jamais partagées avec des
                tiers. L'application privilégie la confidentialité et la
                sécurité de vos informations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Environnement de travail privé ou communautaire
              </h2>
              <p className="text-gray-300 leading-relaxed">
                ETTU vous permet de choisir entre un espace de travail
                personnel, où vos notes et snippets restent privés, ou un mode
                communautaire pour partager et collaborer avec d'autres
                utilisateurs. Vous gardez le contrôle total sur la visibilité de
                vos contenus.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Fonctionnalités principales
              </h2>
              <ul className="text-gray-300 leading-relaxed space-y-2 list-disc ml-6">
                <li>Gestion intuitive de notes et snippets de code</li>
                <li>Recherche rapide et organisation par tags</li>
                <li>Stockage sécurisé</li>
                <li>Interface moderne, claire et responsive</li>
                <li>Possibilité de partager ou garder ses contenus privés</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Philosophie et objectifs
              </h2>
              <p className="text-gray-300 leading-relaxed">
                ETTU est né du besoin d'un outil simple, efficace et respectueux
                de la vie privée pour centraliser ses connaissances techniques.
                L'objectif est de proposer une expérience sans distraction,
                centrée sur l'utilisateur, et adaptée aussi bien à un usage
                individuel qu'à la collaboration. Vous n'êtes même pas obligé
                d'accepter les cookies pour utiliser l'application, car elle
                fonctionne sur serveur distant mais aussi en local dans votre
                navigateur et sans partager une seule donnée sensible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Utilisation avec ou sans compte
              </h2>
              <p className="text-gray-300 leading-relaxed">
                ETTU peut être utilisé de deux façons :
                <strong className="text-white font-semibold">
                  {" "}
                  en tant qu’invité{" "}
                </strong>{" "}
                ou avec un{" "}
                <strong className="text-white font-semibold">
                  {" "}
                  compte utilisateur
                </strong>
                . Par défaut, aucun compte n’est requis : vous pouvez créer des
                notes, snippets, projets ou tâches directement dans votre
                navigateur ou votre environnement local.
                <br />
                <br />
                Cependant, en créant un compte, vous bénéficiez de
                fonctionnalités supplémentaires comme la synchronisation
                multi-appareils, le partage de projets, la collaboration ou
                encore l’historique des modifications. À tout moment, vous
                pouvez migrer vos données locales vers un compte en ligne, ou
                continuer à utiliser ETTU de façon totalement déconnectée.
              </p>
            </section>

            <div className="overflow-x-auto mt-6">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs uppercase bg-gray-800 text-gray-300">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Fonctionnalité
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Invité
                    </th>
                    <th scope="col" className="px-4 py-3 text-center">
                      Compte
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900">
                  {[
                    ["Utilisation 100% locale", "✅", "✅"],
                    ["Création de projets, notes, snippets", "✅", "✅"],
                    ["Synchronisation multi-appareils", "❌", "✅"],
                    ["Partage de projets", "❌", "✅"],
                    ["Collaboration", "❌", "✅"],
                    ["Historique des versions (serveur)", "❌", "✅"],
                    ["Export/Import local", "✅", "✅"],
                    [
                      "Conservation des données entre sessions",
                      "🟡 (si non nettoyé)",
                      "✅",
                    ],
                  ].map(([feature, guest, account]) => (
                    <tr key={feature} className="border-t border-gray-700">
                      <td className="px-4 py-3">{feature}</td>
                      <td className="px-4 py-3 text-center">{guest}</td>
                      <td className="px-4 py-3 text-center">{account}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-blue-400">
                Contact & contribution
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Pour toute question, suggestion ou envie de contribuer au
                projet, n'hésitez pas à me contacter :
              </p>
              <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-300">
                  <strong>Jules BOSSIS--GUYON</strong>
                  <br />
                  Email :{" "}
                  <a
                    href="mailto:contact.ettu@gmail.com"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    contact.ettu@gmail.com
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
