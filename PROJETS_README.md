# Système de Gestion de Projets - ETTU

## Vue d'ensemble

Le système de gestion de projets d'ETTU permet aux utilisateurs de créer, modifier, visualiser et organiser des projets techniques. Chaque projet peut regrouper des notes techniques, des snippets de code, et des tâches.

## Fonctionnalités principales

### 🗂️ Gestion des projets

- **Création de projets** : Nom, description, couleur, statut, technologies, équipe
- **Modification et suppression** : Interface intuitive pour gérer les projets
- **Statuts** : Actif, En pause, Terminé, Archivé
- **Métadonnées** : Technologies utilisées, membres de l'équipe, liens vers le dépôt et la documentation

### 📝 Notes techniques

- **Organisation par projet** : Chaque note est associée à un projet spécifique
- **Types de notes** : Documentation, Analyse, Idées, Problèmes, Solutions
- **Tags** : Système de tags pour une organisation fine
- **Recherche** : Recherche dans le contenu des notes

### 💻 Snippets de code

- **Langage** : Support de multiples langages de programmation
- **Types** : Composants, Fonctions, Classes, Configurations, etc.
- **Syntaxe** : Coloration syntaxique (prévue)
- **Réutilisabilité** : Code facilement copiable et réutilisable

### ✅ Tâches (intégration TODO)

- **Liaison avec les projets** : Les tâches peuvent être associées à des projets
- **Filtrage** : Voir toutes les tâches d'un projet spécifique
- **Synchronisation** : Avec le système TODO existant

## Structure des données

### Projet (`ProjectStructure`)

```typescript
interface ProjectStructure {
  id: string;
  name: string;
  description?: string;
  color: string;
  status: "active" | "paused" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    technologies: string[];
    team?: string[];
    repository?: string;
    documentation?: string;
  };
  stats: {
    totalNotes: number;
    totalSnippets: number;
    totalTasks: number;
    lastActivity: Date;
  };
}
```

### Note (`ProjectNote`)

```typescript
interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  type: "documentation" | "analysis" | "idea" | "problem" | "solution";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Snippet (`ProjectSnippet`)

```typescript
interface ProjectSnippet {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  language: string;
  code: string;
  type: "component" | "function" | "class" | "config" | "util" | "other";
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Composants principaux

### 1. `ProjectManager`

Composant principal qui orchestre toutes les fonctionnalités :

- Gestion des vues (grille/liste)
- Filtrage et recherche
- Statistiques
- Navigation entre les différentes sections

### 2. `ProjectDetail`

Interface détaillée pour un projet spécifique :

- Vue d'ensemble du projet
- Onglets pour notes, snippets, tâches
- Actions (modifier, supprimer)
- Statistiques du projet

### 3. `ProjectForm`

Formulaire de création/modification :

- Validation des données
- Gestion des technologies et équipe
- Interface utilisateur intuitive

### 4. `ProjectList`

Affichage des projets :

- Vue grille et liste
- Actions rapides sur chaque projet
- Tri et filtrage

### 5. `ProjectFilters`

Système de filtrage avancé :

- Par statut
- Par technologies
- Par plage de dates
- Recherche textuelle

### 6. `ProjectStats`

Tableau de bord avec métriques :

- Statistiques globales
- Répartition par statut
- Activité récente

## Persistance des données

Les données sont stockées dans le localStorage du navigateur avec les clés suivantes :

- `ettu-projects` : Liste des projets
- `ettu-project-notes` : Notes organisées par projet
- `ettu-project-snippets` : Snippets organisés par projet

## Intégration avec le système TODO

Le système de projets s'intègre avec le système TODO existant :

- Les tâches peuvent être associées à des projets
- Filtrage des tâches par projet
- Statistiques des tâches par projet

## Hook principal : `useProjects`

Le hook `useProjects` fournit toutes les fonctionnalités nécessaires :

```typescript
const {
  projects, // Liste complète des projets
  filteredProjects, // Projets filtrés
  filter, // État du filtre actuel
  loading, // État de chargement
  stats, // Statistiques globales
  createProject, // Créer un nouveau projet
  updateProject, // Mettre à jour un projet
  deleteProject, // Supprimer un projet
  createNote, // Créer une note
  createSnippet, // Créer un snippet
  setFilter, // Définir des filtres
  clearFilter, // Réinitialiser les filtres
  getProjectNotes, // Récupérer les notes d'un projet
  getProjectSnippets, // Récupérer les snippets d'un projet
} = useProjects();
```

## Navigation

Le système de projets est accessible via :

- **URL** : `/projects`
- **Navigation** : Lien "Projets" dans le header
- **Intégration** : Avec le système de routing React Router

## Thème et design

Le système suit le thème dark d'ETTU :

- Couleurs principales : grays (900, 800, 700)
- Couleurs d'accent : blue, green, purple, orange
- Interface cohérente avec le reste de l'application

## Améliorations futures

1. **Éditeur de code** : Coloration syntaxique pour les snippets
2. **Export/Import** : Sauvegarde et restauration des projets
3. **Collaboration** : Partage de projets entre utilisateurs
4. **Intégration Git** : Synchronisation avec les dépôts
5. **Templates** : Modèles de projets préconfigurés
6. **Notifications** : Rappels et alertes de projet
7. **Recherche avancée** : Recherche full-text dans tous les contenus
8. **Tableau de bord** : Vue d'ensemble de l'activité
9. **Intégration calendrier** : Planification des tâches
10. **Métriques avancées** : Analyse de productivité

## Utilisation

1. **Créer un projet** : Bouton "Nouveau projet" dans l'interface principale
2. **Ajouter du contenu** : Utiliser les onglets Notes et Snippets dans le détail du projet
3. **Organiser** : Utiliser les filtres et la recherche pour retrouver rapidement
4. **Collaborer** : Ajouter des membres d'équipe et des liens vers la documentation
5. **Suivre** : Utiliser les statistiques pour suivre la progression

---

**Note** : Ce système est conçu pour évoluer avec les besoins des utilisateurs et peut être étendu avec de nouvelles fonctionnalités selon les retours d'usage.
