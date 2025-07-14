# Documentation - Module Snippets

## Vue d'ensemble

Le module Snippets permet de gérer des extraits de code techniques dans l'application ETTU. Il offre une interface complète pour créer, modifier, visualiser et organiser des snippets par langage et projet.

## Architecture

```
src/
├── features/snippets/
│   ├── SnippetList.tsx      # Composant de liste et visualisation
│   └── SnippetEditor.tsx    # Composant d'édition/création
├── pages/
│   └── SnippetsPage.tsx     # Page principale
└── types/
    └── snippet.ts           # Types TypeScript
```

## Fonctionnalités

### ✅ Gestion des snippets
- **Création** : Nouveau snippet avec formulaire complet
- **Modification** : Édition des snippets existants
- **Suppression** : Suppression avec confirmation
- **Copie** : Copie du code vers le presse-papiers

### ✅ Organisation
- **Filtrage** : Par titre, description, tags, langage, projet
- **Tri** : Organisation automatique par date de modification
- **Catégorisation** : 43 langages organisés en 6 catégories

### ✅ Interface utilisateur
- **Éditeur de code** : CodeMirror avec coloration syntaxique
- **Vue en deux colonnes** : Liste + Éditeur/Prévisualisation
- **Thème sombre** : Cohérent avec l'application
- **Responsive** : Adaptation mobile

## Langages supportés

### Web Frontend (8)
JavaScript, TypeScript, HTML, CSS, SCSS, Less, JSX, TSX

### Backend & Systems (14)
Python, Rust, Go, Java, C, C++, C#, PHP, Ruby, Kotlin, Swift, Dart, Scala, Elixir

### Scripting & Shell (4)
Bash, Shell, PowerShell, Makefile

### Data & Analytics (4)
R, Julia, MATLAB, SQL

### DevOps & Config (9)
Dockerfile, YAML, JSON, TOML, INI, Terraform, Ansible, NGINX, Apache

### Documentation (4)
Markdown, reStructuredText, LaTeX, XML

## Structure des données

```typescript
interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  description: string;
  tags: string[];
  project: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Utilisation

### Accès
- **URL** : `/snippets`
- **Navigation** : Depuis la page d'accueil ou le menu

### Workflow typique
1. **Consultation** : Parcourir les snippets existants
2. **Filtrage** : Utiliser la recherche et les filtres
3. **Création** : Cliquer sur "Nouveau Snippet"
4. **Édition** : Sélectionner un snippet et cliquer "Modifier"
5. **Utilisation** : Copier le code d'un snippet

## Dépendances

- **@uiw/react-codemirror** : Éditeur de code
- **@codemirror/lang-\*** : Extensions pour différents langages
- **React Router** : Navigation
- **Tailwind CSS** : Styling

## Persistance

- **Version actuelle** : Données en mémoire (session)
- **Évolution prévue** : Intégration avec API/base de données
- **Format** : JSON, prêt pour sérialisation

## Performances

- **Filtrage** : Calcul côté client, instantané
- **Rendu** : Virtualisation pour grandes listes
- **Coloration** : Lazy loading des extensions CodeMirror

## Extensibilité

- **Nouveaux langages** : Ajout facile dans la configuration
- **Nouvelles catégories** : Structure flexible
- **Nouvelles fonctionnalités** : Architecture modulaire

## Tests recommandés

1. **Création** : Créer des snippets dans différents langages
2. **Édition** : Modifier titre, code, tags, projet
3. **Filtrage** : Tester recherche et filtres
4. **Copie** : Vérifier la copie dans le presse-papiers
5. **Responsive** : Tester sur mobile/tablette
6. **Performance** : Avec de nombreux snippets

## Roadmap

- [ ] Sauvegarde locale (localStorage)
- [ ] Export/import de snippets
- [ ] Favoris et étoiles
- [ ] Partage de snippets
- [ ] Historique des modifications
- [ ] Recherche avancée (regex)
- [ ] Thèmes d'éditeur personnalisés
- [ ] Intégration Git
