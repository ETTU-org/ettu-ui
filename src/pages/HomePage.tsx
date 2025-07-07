import Layout from "../components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white">ETTU</h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          Espace de Travail Technique Unifié — organisez vos notes, snippets,
          projets et tâches en toute simplicité.
        </p>
        <div className="mt-6">
          <a
            className="px-6 py-3 bg-white text-gray-900 font-semibold rounded shadow hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            href="/notes"
          >
            Commencer →
          </a>
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Notes Markdown",
            desc: "Éditeur complet, preview, tags et versionning.",
          },
          {
            title: "Snippets intelligents",
            desc: "Stockez vos extraits de code par langage, projet ou tag.",
          },
          {
            title: "TODO Techniques",
            desc: "Gardez une trace claire de vos tâches liées à vos projets.",
          },
          {
            title: "Versionning Git",
            desc: "Suivi de toutes vos modifications localement, automatiquement.",
          },
          {
            title: "Recherche instantanée",
            desc: "Retrouvez vos données techniques avec Fuse.js.",
          },
          {
            title: "100% local & open source",
            desc: "Pas d’inscription, pas de cloud, juste votre environnement.",
          },
        ].map(({ title, desc }) => (
          <div
            key={title}
            className="p-6 bg-gray-800 rounded shadow hover:shadow-xl hover:-translate-y-1 transition duration-300 transform"
          >
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-2 text-gray-400">{desc}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}
