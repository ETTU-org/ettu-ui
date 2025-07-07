# 🧠 ETTU UI – Espace de Travail Technique Unifié

Frontend officiel de **ETTU** (Espace de Travail Technique Unifié), un outil personnel d’organisation pour développeurs.

> Centralisez vos notes Markdown, snippets, tâches et projets techniques. Rapide, local, versionné.

---

## ⚙️ Stack technique

- ⚛️ [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- ⚡ [Vite](https://vitejs.dev/)
- 🎨 [TailwindCSS](https://tailwindcss.com/)
- 🔍 [Fuse.js](https://fusejs.io/) (recherche plein texte)
- 🧠 [Zustand](https://github.com/pmndrs/zustand) (à venir – gestion d’état)
- 📝 [CodeMirror](https://codemirror.net/) (à venir – éditeur markdown/snippets)

---

## 🚀 Lancer le projet en local

```bash
# 1. Cloner le dépôt
git clone https://github.com/ETTU-org/ettu-ui.git
cd ettu-ui

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur de dev
npm run dev
```

## 📁 Arborescence du projet

```bash
ettu-ui/
├── public/             # Assets publics
├── src/
│   ├── assets/         # Logos, icônes, images
│   ├── components/     # Composants UI
│   ├── pages/          # Pages principales (Notes, Snippets, Projets…)
│   ├── store/          # Zustand store (état global, à venir)
│   ├── styles/         # Fichiers CSS/Tailwind
│   ├── utils/          # Fonctions utilitaires
│   ├── App.tsx         # App principale
│   └── main.tsx        # Entrée Vite
├── index.html
├── tailwind.config.js
└── vite.config.ts
```

## 📌 Roadmap (MVP Été 2025)

    ✅ Setup React + Vite + TypeScript

    ✅ Intégration TailwindCSS

    ⏳ Ajout éditeur Markdown (CodeMirror)

    ⏳ Composants de notes/snippets

    ⏳ Interface projets et tâches

    ⏳ Intégration API backend (Axum - Rust)

    ⏳ Système de versionning local (Git, diff)

## 👨‍💻 Contribuer

Pré-requis

    Node.js 18+

    npm ou pnpm

    Git

Convention Git

    main = production-ready

    dev/feature-xyz = branche par fonctionnalité

    PR = squash + merge après review

## 🪪 Licence

MIT — libre d'utilisation, modification et distribution.

## ✉️ Contact

    Organisation : ETTU-org
    Contact dev : github.com/ETTU-org
