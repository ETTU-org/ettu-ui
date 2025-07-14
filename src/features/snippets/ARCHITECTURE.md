# Architecture du Module Snippets

## Vue d'ensemble

Le module Snippets est conçu pour gérer des extraits de code techniques dans une application React/TypeScript. Il offre une interface complète pour créer, éditer, organiser et rechercher des snippets de code.

## Structure des fichiers

```
src/
├── features/snippets/
│   ├── SnippetList.tsx          # Composant d'affichage des snippets
│   ├── SnippetEditor.tsx        # Composant d'édition/création
│   ├── README.md                # Documentation du module
│   └── ARCHITECTURE.md          # Cette documentation
├── pages/
│   └── SnippetsPage.tsx         # Page principale
└── types/
    └── snippet.ts               # Types TypeScript
```

## Architecture des composants

### 1. SnippetsPage (Container)
- **Responsabilité** : Orchestration générale et gestion d'état
- **État géré** :
  - `snippets`: Liste complète des snippets
  - `selectedSnippet`: Snippet actuellement sélectionné
  - `editingSnippet`: Snippet en cours d'édition
  - `searchTerm`: Terme de recherche
  - `languageFilter`: Filtre par langage
  - `projectFilter`: Filtre par projet
  - `showEditor`: Affichage de l'éditeur

### 2. SnippetList (Présentation)
- **Responsabilité** : Affichage et interactions avec la liste
- **Fonctionnalités** :
  - Affichage liste/détail adaptatif
  - Actions rapides (copier, éditer, supprimer)
  - Badges colorés par langage
  - Gestion responsive

### 3. SnippetEditor (Présentation)
- **Responsabilité** : Création et édition de snippets
- **Fonctionnalités** :
  - Formulaire complet avec validation
  - Éditeur CodeMirror avec coloration syntaxique
  - Sélection de langage par catégories
  - Gestion des tags et métadonnées

## Flux de données

```
SnippetsPage (état central)
├── filtrage/recherche → filteredSnippets
├── SnippetList
│   ├── selectedSnippet (props)
│   ├── onSelect → setSelectedSnippet
│   ├── onEdit → handleEditSnippet
│   └── onDelete → handleDeleteSnippet
└── SnippetEditor
    ├── snippet (props)
    ├── onSave → handleSaveSnippet
    └── onCancel → handleCancelEdit
```

## Gestion d'état

### État local (useState)
- **Avantages** : Simplicité, performance, pas de dépendances externes
- **Inconvénients** : Données perdues au rafraîchissement
- **Adapté pour** : Prototypage, démonstration, environnement de développement

### Évolution possible vers une gestion d'état plus robuste
- **localStorage** : Persistance locale simple
- **Context API** : Partage d'état entre composants
- **Redux/Zustand** : Gestion d'état complexe
- **API Backend** : Persistance serveur avec synchronisation

## Langages supportés

Le module supporte 43 langages organisés en 6 catégories :

1. **Web Frontend** : JavaScript, TypeScript, HTML, CSS, etc.
2. **Backend & Systems** : Python, Java, C++, Rust, Go, etc.
3. **Scripting & Shell** : Bash, PowerShell, Makefile
4. **Data & Analytics** : R, Julia, MATLAB, SQL
5. **DevOps & Config** : Docker, YAML, JSON, Terraform, etc.
6. **Documentation** : Markdown, LaTeX, XML

## Fonctionnalités techniques

### Éditeur de code (CodeMirror)
- Coloration syntaxique automatique
- Thème sombre intégré
- Extensions par langage
- Mode lecture seule pour la prévisualisation

### Filtrage et recherche
- Recherche textuelle dans titre/description/code
- Filtres par langage et projet
- Combinaison de filtres
- Réactivité en temps réel

### Interface utilisateur
- Design responsive (mobile/desktop)
- Badges colorés par langage
- Actions rapides accessibles
- Feedback visuel (animations, notifications)

## Bonnes pratiques implémentées

### TypeScript
- Types stricts pour toutes les données
- Interfaces bien définies
- Import type-only pour les types
- Documentation JSDoc complète

### React
- Composants fonctionnels avec hooks
- Séparation container/présentation
- Props typées et documentées
- Gestion d'état locale optimisée

### Accessibilité
- Labels appropriés pour les formulaires
- Navigation au clavier
- Contrastes de couleurs respectés
- Hiérarchie HTML sémantique

### Performance
- Filtrage côté client optimisé
- Debouncing potentiel pour la recherche
- Lazy loading des extensions CodeMirror
- Mémorisation des calculs coûteux

## Extensibilité

### Ajout de nouveaux langages
1. Installer l'extension CodeMirror correspondante
2. Ajouter le langage dans `getLanguageExtension()`
3. Ajouter la couleur de badge dans `getLanguageBadgeColor()`
4. Mettre à jour la liste des langages dans l'éditeur

### Nouvelles fonctionnalités
- **Export/Import** : Sérialisation JSON/YAML
- **Favoris** : Ajout d'un champ `isFavorite`
- **Partage** : Génération d'URLs ou de codes
- **Historique** : Versioning des modifications
- **Thèmes** : Personnalisation de l'interface

### Intégrations possibles
- **Git** : Synchronisation avec des dépôts
- **VS Code** : Extension pour l'éditeur
- **API externes** : GitHub Gists, Pastebin
- **Équipes** : Partage collaboratif

## Tests recommandés

### Tests unitaires
- Fonctions utilitaires (filtrage, recherche)
- Composants isolés avec React Testing Library
- Validation des types TypeScript

### Tests d'intégration
- Flux complet création/édition/suppression
- Interactions entre composants
- Persistance des données

### Tests end-to-end
- Parcours utilisateur complet
- Tests de régression
- Compatibilité navigateurs

## Déploiement et maintenance

### Surveillance
- Erreurs JavaScript côté client
- Performance des filtres avec de gros volumes
- Utilisation des fonctionnalités

### Maintenance
- Mise à jour des dépendances CodeMirror
- Ajout de nouveaux langages populaires
- Optimisation des performances si nécessaire

### Métriques suggérées
- Nombre de snippets créés
- Langages les plus utilisés
- Fonctionnalités les plus sollicitées
- Temps de recherche/filtrage
