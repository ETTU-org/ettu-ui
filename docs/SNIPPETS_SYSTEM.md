# 📝 Documentation Système Snippets - ETTU

## 📋 Vue d'ensemble

Le système Snippets d'ETTU est une solution complète pour la gestion d'extraits de code techniques avec :

- **Interface utilisateur complète** : Création, édition, visualisation, filtrage et copie
- **Support multi-langages** : 43 langages organisés en 6 catégories
- **Éditeur avancé** : CodeMirror avec coloration syntaxique
- **Gestion des métadonnées** : Tags, projets, descriptions
- **Interface responsive** : Optimisée mobile et desktop
- **Architecture modulaire** : Composants réutilisables
- **Stockage sécurisé** : Intégration avec secureStorage

## 🏗️ Architecture

### Structure des fichiers

```
src/
├── features/snippets/
│   ├── SnippetList.tsx              # Composant d'affichage des snippets
│   ├── SnippetEditor.tsx            # Composant d'édition/création
│   ├── SnippetPreview.tsx           # Composant de prévisualisation
│   ├── index.ts                     # Point d'entrée du module
│   └── README.md                    # Documentation utilisateur
├── pages/
│   └── SnippetsPage.tsx             # Page principale
├── types/
│   └── snippet.ts                   # Types TypeScript
└── App.tsx                          # Route ajoutée
```

### Composants principaux

#### 1. SnippetsPage (Container)
**Responsabilité** : Orchestration générale et gestion d'état

**État géré** :
- `snippets`: Liste complète des snippets
- `selectedSnippet`: Snippet actuellement sélectionné
- `editingSnippet`: Snippet en cours d'édition
- `searchTerm`: Terme de recherche
- `languageFilter`: Filtre par langage
- `projectFilter`: Filtre par projet

#### 2. SnippetList (Présentation)
**Responsabilité** : Affichage et interactions avec la liste

**Fonctionnalités** :
- Affichage liste/détail adaptatif
- Actions rapides (copier, éditer, supprimer)
- Badges colorés par langage
- Gestion responsive

#### 3. SnippetEditor (Présentation)
**Responsabilité** : Création et édition de snippets

**Fonctionnalités** :
- Formulaire complet avec validation
- Éditeur CodeMirror avec coloration syntaxique
- Sélection de langage par catégories
- Gestion des tags et métadonnées

#### 4. SnippetPreview (Présentation)
**Responsabilité** : Prévisualisation et actions sur les snippets

**Fonctionnalités** :
- Affichage formaté du code
- Actions rapides (copier, éditer)
- Métadonnées enrichies
- Support multi-langages

## 🚀 Utilisation

### Installation des dépendances
```bash
npm install @codemirror/lang-javascript @codemirror/lang-python @codemirror/lang-html @codemirror/lang-css @codemirror/lang-json @codemirror/lang-markdown
```

### Intégration de base
```typescript
// Dans SnippetsPage.tsx
import { useSecureStorage } from "../hooks/useSecureStorage";
import { SnippetList, SnippetEditor, SnippetPreview } from "../features/snippets";

const SnippetsPage = () => {
  const {
    data: snippets,
    setData: setSnippets,
    loading,
    error
  } = useSecureStorage<Snippet[]>('user-snippets', []);

  return (
    <ResponsiveLayout
      editorContent={
        <div className="h-full flex flex-col">
          <SnippetList 
            snippets={filteredSnippets}
            onSelect={setSelectedSnippet}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <SnippetEditor 
            snippet={editingSnippet}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      }
      previewContent={
        <SnippetPreview 
          snippet={selectedSnippet}
          onEdit={handleEdit}
          onCopy={handleCopy}
        />
      }
    />
  );
};
```

## 📝 Types TypeScript

### Interface Snippet
```typescript
export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: SupportedLanguage;
  tags: string[];
  project?: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorite: boolean;
}
```

### Langages supportés
```typescript
export type SupportedLanguage = 
  | 'javascript' | 'typescript' | 'python' | 'java' | 'cpp' | 'c'
  | 'html' | 'css' | 'scss' | 'json' | 'xml' | 'yaml'
  | 'markdown' | 'latex' | 'plaintext'
  | 'bash' | 'powershell' | 'dockerfile' | 'sql'
  | 'react' | 'vue' | 'angular' | 'svelte'
  | 'nodejs' | 'php' | 'ruby' | 'go' | 'rust'
  | 'swift' | 'kotlin' | 'dart' | 'scala'
  | 'r' | 'matlab' | 'perl' | 'lua'
  | 'assembly' | 'verilog' | 'vhdl'
  | 'graphql' | 'protobuf' | 'terraform'
  | 'nginx' | 'apache' | 'regex';
```

### Catégories de langages
```typescript
export const LANGUAGE_CATEGORIES = {
  'Web Frontend': ['javascript', 'typescript', 'html', 'css', 'scss', 'react', 'vue', 'angular', 'svelte'],
  'Backend': ['nodejs', 'python', 'java', 'php', 'ruby', 'go', 'rust', 'cpp', 'c'],
  'Mobile': ['swift', 'kotlin', 'dart', 'java'],
  'Data & Config': ['json', 'xml', 'yaml', 'sql', 'graphql', 'protobuf'],
  'DevOps': ['bash', 'powershell', 'dockerfile', 'terraform', 'nginx', 'apache'],
  'Other': ['markdown', 'latex', 'plaintext', 'r', 'matlab', 'perl', 'lua', 'assembly', 'verilog', 'vhdl', 'regex']
};
```

## 🎨 Fonctionnalités

### Création de snippets
```typescript
const createSnippet = (snippetData: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newSnippet: Snippet = {
    ...snippetData,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  setSnippets(prev => [...prev, newSnippet]);
};
```

### Filtrage et recherche
```typescript
const filteredSnippets = useMemo(() => {
  return snippets.filter(snippet => {
    const matchesSearch = !searchTerm || 
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLanguage = !languageFilter || snippet.language === languageFilter;
    const matchesProject = !projectFilter || snippet.project === projectFilter;
    
    return matchesSearch && matchesLanguage && matchesProject;
  });
}, [snippets, searchTerm, languageFilter, projectFilter]);
```

### Coloration syntaxique
```typescript
const getLanguageExtension = (language: SupportedLanguage) => {
  const extensions = {
    javascript: [javascript()],
    typescript: [javascript({ typescript: true })],
    python: [python()],
    html: [html()],
    css: [css()],
    json: [json()],
    markdown: [markdown()],
    // ... autres langages
  };
  
  return extensions[language] || [];
};
```

### Badges colorés
```typescript
const getLanguageBadgeColor = (language: SupportedLanguage): string => {
  const colors = {
    javascript: 'bg-yellow-600',
    typescript: 'bg-blue-600',
    python: 'bg-green-600',
    html: 'bg-orange-600',
    css: 'bg-purple-600',
    react: 'bg-cyan-600',
    // ... autres couleurs
  };
  
  return colors[language] || 'bg-gray-600';
};
```

## 📱 Interface Responsive

### Layout adaptatif
```typescript
// Mobile : Vue par onglets
<ResponsiveLayout
  editorContent={
    <div className="h-full flex flex-col">
      <SnippetList />
      <SnippetEditor />
    </div>
  }
  previewContent={<SnippetPreview />}
  mobileTabsConfig={{
    editorLabel: "Snippets",
    previewLabel: "Aperçu",
    editorIcon: "📝",
    previewIcon: "🔍"
  }}
/>
```

### Optimisations mobiles
```typescript
// Taille d'éditeur adaptative
const editorHeight = isMobile ? '200px' : '400px';

// Pagination pour mobile
const ITEMS_PER_PAGE = isMobile ? 10 : 20;
```

## 💾 Stockage et Persistance

### Intégration secureStorage
```typescript
import { useSecureStorage } from "../hooks/useSecureStorage";

const {
  data: snippets,
  setData: setSnippets,
  loading,
  error
} = useSecureStorage<Snippet[]>('user-snippets', []);
```

### Sauvegarde automatique
```typescript
// Auto-sauvegarde après modification
useEffect(() => {
  if (snippets.length > 0) {
    const saveTimer = setTimeout(() => {
      secureStorage.setItem('snippets-backup', JSON.stringify(snippets));
    }, 5000);
    
    return () => clearTimeout(saveTimer);
  }
}, [snippets]);
```

### Migration des données
```typescript
// Migration depuis localStorage vers secureStorage
const migrateSnippets = () => {
  const oldSnippets = localStorage.getItem('snippets');
  if (oldSnippets) {
    try {
      const parsed = JSON.parse(oldSnippets);
      setSnippets(parsed);
      localStorage.removeItem('snippets');
    } catch (error) {
      console.error('Erreur migration snippets:', error);
    }
  }
};
```

## 🧪 Tests

### Tests unitaires
```typescript
// Dans snippets.test.ts
describe('Snippets System', () => {
  test('création de snippet', () => {
    const snippet = createSnippet({
      title: 'Test',
      description: 'Description',
      code: 'console.log("test")',
      language: 'javascript',
      tags: ['test'],
      isFavorite: false
    });
    
    expect(snippet.id).toBeDefined();
    expect(snippet.createdAt).toBeInstanceOf(Date);
  });
  
  test('filtrage par langage', () => {
    const filtered = filterSnippets(snippets, '', 'javascript', '');
    expect(filtered.every(s => s.language === 'javascript')).toBe(true);
  });
});
```

### Tests d'intégration
```typescript
// Test interface utilisateur
test('ajout de snippet via interface', async () => {
  const { getByText, getByLabelText } = render(<SnippetsPage />);
  
  fireEvent.click(getByText('Nouveau snippet'));
  fireEvent.change(getByLabelText('Titre'), { target: { value: 'Test' } });
  fireEvent.click(getByText('Sauvegarder'));
  
  expect(getByText('Test')).toBeInTheDocument();
});
```

## 🚀 Déploiement

### Configuration de production
```typescript
// Optimisations pour production
const isProduction = process.env.NODE_ENV === 'production';

const snippetConfig = {
  maxSnippets: isProduction ? 1000 : 100,
  maxCodeLength: isProduction ? 10000 : 5000,
  enableAnalytics: isProduction
};
```

### Lazy loading
```typescript
// Chargement à la demande des extensions CodeMirror
const loadLanguageExtension = async (language: SupportedLanguage) => {
  const extensions = await import(`@codemirror/lang-${language}`);
  return extensions.default();
};
```

## 📊 Monitoring

### Métriques d'utilisation
```typescript
const trackSnippetUsage = (action: string, language: SupportedLanguage) => {
  const event = {
    action,
    language,
    timestamp: Date.now(),
    sessionId: sessionStorage.getItem('session-id')
  };
  
  // Envoi vers analytics
  console.log('📊 Snippet usage:', event);
};
```

### Performance
```typescript
// Monitoring des performances
const performanceTimer = performance.now();
// ... opération
const duration = performance.now() - performanceTimer;

if (duration > 100) {
  console.warn(`⚠️ Opération lente: ${duration}ms`);
}
```

## 🔧 Extensibilité

### Ajout de nouveaux langages
```typescript
// 1. Ajouter dans les types
export type SupportedLanguage = 'existing' | 'newlang';

// 2. Ajouter l'extension CodeMirror
const getLanguageExtension = (language: SupportedLanguage) => {
  const extensions = {
    // ... existing
    newlang: [newlangExtension()]
  };
  return extensions[language] || [];
};

// 3. Ajouter la couleur de badge
const getLanguageBadgeColor = (language: SupportedLanguage): string => {
  const colors = {
    // ... existing
    newlang: 'bg-indigo-600'
  };
  return colors[language] || 'bg-gray-600';
};
```

### Plugins personnalisés
```typescript
// Interface pour plugins
interface SnippetPlugin {
  name: string;
  version: string;
  onSnippetCreate?: (snippet: Snippet) => Snippet;
  onSnippetUpdate?: (snippet: Snippet) => Snippet;
  onSnippetDelete?: (snippet: Snippet) => void;
}

// Système de plugins
const plugins: SnippetPlugin[] = [];

const applyPlugins = (action: string, snippet: Snippet) => {
  return plugins.reduce((acc, plugin) => {
    const handler = plugin[`onSnippet${action}`];
    return handler ? handler(acc) : acc;
  }, snippet);
};
```

## 📞 Support

**Documentation :** `/docs/SNIPPETS_SYSTEM.md`  
**Tests :** `npm run test:snippets`  
**Issues :** GitHub Issues  
**Support :** julesbossis@gmail.com

---

*Documentation mise à jour le 14 juillet 2025*  
*Prochaine révision : Avant déploiement production*
