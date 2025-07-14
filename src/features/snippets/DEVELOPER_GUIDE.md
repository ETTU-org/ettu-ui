# Guide du développeur - Module Snippets

## Démarrage rapide

### Prérequis
- Node.js 18+
- Extensions CodeMirror installées
- Connaissance de React/TypeScript

### Installation des dépendances
```bash
npm install @codemirror/lang-javascript @codemirror/lang-python @codemirror/lang-html @codemirror/lang-css @codemirror/lang-json @codemirror/lang-markdown
```

### Structure du code
```
src/features/snippets/
├── SnippetList.tsx          # Composant liste/détail
├── SnippetEditor.tsx        # Composant formulaire d'édition
├── README.md                # Documentation utilisateur
├── ARCHITECTURE.md          # Architecture technique
└── DEVELOPER_GUIDE.md       # Ce guide
```

## Composants principaux

### SnippetList
**Responsabilité** : Affichage et interactions avec les snippets

**Props importantes** :
- `snippets`: Liste filtrée des snippets
- `selectedSnippet`: Snippet en mode détail
- `onSelect`: Callback de sélection
- `onEdit`: Callback d'édition
- `onDelete`: Callback de suppression

**Fonctions clés** :
- `getLanguageBadgeColor()`: Couleurs des badges
- `getLanguageExtension()`: Extensions CodeMirror
- `handleCopyCode()`: Copie dans le presse-papiers

### SnippetEditor
**Responsabilité** : Création et édition de snippets

**Props importantes** :
- `snippet`: Snippet à éditer (null pour nouveau)
- `onSave`: Callback de sauvegarde
- `onCancel`: Callback d'annulation

**État interne** :
- `formData`: Données du formulaire
- `tagInput`: Saisie des tags

**Fonctions clés** :
- `getLanguageExtension()`: Extensions CodeMirror
- `handleSubmit()`: Validation et sauvegarde
- `handleAddTag()`: Gestion des tags

## Ajout de fonctionnalités

### Nouveau langage de programmation

1. **Installer l'extension CodeMirror** :
```bash
npm install @codemirror/lang-[language]
```

2. **Importer dans les composants** :
```typescript
import { [language] } from "@codemirror/lang-[language]";
```

3. **Ajouter dans `getLanguageExtension()`** :
```typescript
case 'nouveau-langage':
  return [[language]()];
```

4. **Ajouter la couleur de badge** :
```typescript
"nouveau-langage": "bg-color-class",
```

5. **Ajouter dans la liste des langages** :
```typescript
"Catégorie": {
  "nouveau-langage": "Nouveau Langage",
  // ...
}
```

### Nouvelle fonctionnalité

#### 1. Favoris
**Fichiers à modifier** :
- `types/snippet.ts` : Ajouter `isFavorite: boolean`
- `SnippetEditor.tsx` : Ajouter checkbox favori
- `SnippetList.tsx` : Ajouter icône/filtre favoris
- `SnippetsPage.tsx` : Ajouter filtre favoris

#### 2. Export/Import
**Nouveaux composants** :
- `SnippetExporter.tsx` : Interface d'export
- `SnippetImporter.tsx` : Interface d'import

**Fonctions utilitaires** :
```typescript
// utils/snippetUtils.ts
export const exportSnippets = (snippets: Snippet[]) => {
  return JSON.stringify(snippets, null, 2);
};

export const importSnippets = (data: string): Snippet[] => {
  return JSON.parse(data);
};
```

#### 3. Recherche avancée
**Nouveau composant** :
```typescript
// AdvancedSearch.tsx
interface SearchFilters {
  text: string;
  languages: string[];
  projects: string[];
  tags: string[];
  dateRange: { start: Date; end: Date };
}
```

## Gestion d'état

### État actuel (useState)
```typescript
const [snippets, setSnippets] = useState<Snippet[]>([]);
const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
```

### Migration vers Context API
```typescript
// contexts/SnippetContext.tsx
interface SnippetContextType {
  snippets: Snippet[];
  selectedSnippet: Snippet | null;
  addSnippet: (snippet: SnippetFormData) => void;
  updateSnippet: (id: string, snippet: SnippetFormData) => void;
  deleteSnippet: (id: string) => void;
  selectSnippet: (snippet: Snippet) => void;
}

export const SnippetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // État et logique métier
  return (
    <SnippetContext.Provider value={value}>
      {children}
    </SnippetContext.Provider>
  );
};
```

### Persistance localStorage
```typescript
// hooks/useLocalStorage.ts
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};
```

## Optimisations

### Performance
```typescript
// Mémorisation des filtres
const filteredSnippets = useMemo(() => {
  return snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = !languageFilter || snippet.language === languageFilter;
    const matchesProject = !projectFilter || snippet.project === projectFilter;
    
    return matchesSearch && matchesLanguage && matchesProject;
  });
}, [snippets, searchTerm, languageFilter, projectFilter]);

// Debouncing pour la recherche
const debouncedSearch = useCallback(
  debounce((term: string) => setSearchTerm(term), 300),
  []
);
```

### Lazy Loading
```typescript
// Chargement différé des extensions CodeMirror
const getLanguageExtension = useCallback(async (language: string) => {
  switch (language.toLowerCase()) {
    case 'python':
      const { python } = await import('@codemirror/lang-python');
      return [python()];
    // ...
  }
}, []);
```

## Tests

### Configuration Jest
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

### Tests unitaires
```typescript
// __tests__/SnippetList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import SnippetList from '../SnippetList';

const mockSnippets = [
  {
    id: '1',
    title: 'Test Snippet',
    language: 'javascript',
    code: 'console.log("test");',
    description: 'Test description',
    tags: ['test'],
    project: 'Test Project',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('SnippetList', () => {
  it('renders snippets correctly', () => {
    render(
      <SnippetList
        snippets={mockSnippets}
        selectedSnippet={null}
        onSelect={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
    
    expect(screen.getByText('Test Snippet')).toBeInTheDocument();
  });
});
```

## Débogage

### Logs utiles
```typescript
// Debug des filtres
console.log('Filtered snippets:', filteredSnippets);
console.log('Search term:', searchTerm);
console.log('Language filter:', languageFilter);

// Debug des extensions CodeMirror
console.log('Loading extension for:', language);
console.log('Extension loaded:', extension);
```

### Outils de développement
- React Developer Tools
- TypeScript strict mode
- ESLint avec règles React
- Prettier pour le formatage

## Bonnes pratiques

### Code
- Utiliser des types TypeScript stricts
- Documenter avec JSDoc
- Séparer la logique métier de la présentation
- Utiliser des hooks personnalisés pour la logique réutilisable

### Git
- Commits atomiques et descriptifs
- Branches feature pour les nouvelles fonctionnalités
- Code review obligatoire
- Tests automatisés en CI/CD

### Sécurité
- Validation côté client ET serveur
- Sanitisation des entrées utilisateur
- Pas de données sensibles dans les snippets
- Chiffrement pour la persistance distante

## Résolution de problèmes

### Erreurs communes
1. **Extension CodeMirror non trouvée** : Vérifier l'installation npm
2. **Types TypeScript manquants** : Ajouter les imports type-only
3. **Performance dégradée** : Implémenter le debouncing et la mémorisation
4. **Styles cassés** : Vérifier les classes Tailwind

### Support
- Documentation officielle CodeMirror
- Guide React/TypeScript
- Stack Overflow pour les problèmes spécifiques
- Issues GitHub du projet
