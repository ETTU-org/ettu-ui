import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";

export default function NoteEditor() {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("nouvelle-note.md");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Charger le contenu depuis le localStorage au démarrage
  useEffect(() => {
    const savedContent = localStorage.getItem('noteEditor-content');
    const savedFileName = localStorage.getItem('noteEditor-fileName');
    
    if (savedContent) {
      setContent(savedContent);
      setLastSaved(new Date());
    } else {
      // Contenu par défaut si aucune sauvegarde
      setContent(`# Guide d'utilisation de l'éditeur

## Fonctionnalités supportées

### Formatage de texte
- **Texte en gras** avec \`**texte**\`
- *Texte en italique* avec \`*texte*\`
- \`Code inline\` avec des backticks

### Listes
- Liste à puces
- Liste numérotée

1. Premier élément
2. Deuxième élément
3. Troisième élément

### Liens et images
[Lien vers GitHub](https://github.com)

### Blocs de code
\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

### Citations
> Ceci est une citation
> qui peut s'étendre sur plusieurs lignes

### Tableaux
| Colonne 1 | Colonne 2 | Colonne 3 |
|-----------|-----------|-----------|
| Données 1 | Données 2 | Données 3 |
| Données 4 | Données 5 | Données 6 |

---

Commencez à écrire votre note technique !`);
    }
    
    if (savedFileName) {
      setFileName(savedFileName);
    }
  }, []);

  // Auto-sauvegarde toutes les 2 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (content.trim()) {
        localStorage.setItem('noteEditor-content', content);
        localStorage.setItem('noteEditor-fileName', fileName);
        setLastSaved(new Date());
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [content, fileName]);

  const insertTemplate = (template: string) => {
    setContent(prev => prev + "\n\n" + template);
  };

  const clearContent = () => {
    if (confirm("Êtes-vous sûr de vouloir effacer tout le contenu ?")) {
      setContent("");
      localStorage.removeItem('noteEditor-content');
      localStorage.removeItem('noteEditor-fileName');
      setLastSaved(null);
    }
  };

  const downloadNote = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const newNote = () => {
    if (content.trim() && confirm("Créer une nouvelle note ? Le contenu actuel sera perdu si non sauvegardé.")) {
      setContent("");
      setFileName("nouvelle-note.md");
      localStorage.removeItem('noteEditor-content');
      localStorage.removeItem('noteEditor-fileName');
      setLastSaved(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* En-tête avec actions */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Éditeur de Notes Techniques
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>Rédigez et prévisualisez vos notes en Markdown en temps réel</span>
              {lastSaved && (
                <span className="text-green-400">
                  • Sauvegardé à {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="px-3 py-1 border border-gray-600 bg-gray-800 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="nom-du-fichier.md"
            />
            <button
              onClick={newNote}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Nouveau
            </button>
            <button
              onClick={downloadNote}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              Télécharger
            </button>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="flex flex-wrap gap-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
          <button
            onClick={() => insertTemplate("**texte en gras**")}
            className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter du texte en gras"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => insertTemplate("*texte en italique*")}
            className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter du texte en italique"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => insertTemplate("`code inline`")}
            className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors font-mono"
            title="Ajouter du code inline"
          >
            &lt;/&gt;
          </button>
          <button
            onClick={() => insertTemplate("```javascript\n// Votre code ici\n```")}
            className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter un bloc de code"
          >
            Bloc de code
          </button>
          <button
            onClick={() => insertTemplate("- Élément de liste")}
            className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter une liste"
          >
            • Liste
          </button>
          <button
            onClick={() => insertTemplate("[Texte du lien](https://exemple.com)")}
            className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter un lien"
          >
            🔗 Lien
          </button>
          <button
            onClick={() => insertTemplate("| Colonne 1 | Colonne 2 |\n|-----------|-----------||\n| Données 1 | Données 2 |")}
            className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter un tableau"
          >
            📊 Tableau
          </button>
          <button
            onClick={() => insertTemplate("> Citation")}
            className="px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter une citation"
          >
            💬 Citation
          </button>
          <div className="flex-1"></div>
          <button
            onClick={clearContent}
            className="px-3 py-1 bg-red-900 text-red-100 border border-red-700 rounded text-sm hover:bg-red-800 transition-colors"
            title="Effacer tout le contenu"
          >
            🗑️ Effacer
          </button>
        </div>
      </div>

      {/* Éditeur et prévisualisation */}
      <div className="flex-1 grid md:grid-cols-2 gap-6 min-h-0">
        {/* Éditeur */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">
              Éditeur Markdown
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>{content.length} caractères</span>
              <span>{content.split('\n').length} lignes</span>
              <span>{content.split(' ').filter(word => word.length > 0).length} mots</span>
            </div>
          </div>
          <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
            <CodeMirror
              value={content}
              height="100%"
              extensions={[markdown()]}
              theme="dark"
              onChange={(value) => setContent(value)}
              className="text-sm"
            />
          </div>
        </div>

        {/* Prévisualisation */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">
              Prévisualisation
            </h2>
            <span className="text-sm text-gray-400">Rendu en temps réel</span>
          </div>
          <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
            <MarkdownPreview content={content} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  // Configuration de marked pour un rendu sécurisé
  const renderer = new marked.Renderer();
  
  // Personnalisation du rendu des liens pour ouvrir dans un nouvel onglet
  renderer.link = ({ href, title, tokens }) => {
    const text = tokens.map(token => token.raw).join('');
    return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${text}</a>`;
  };

  // Personnalisation du rendu des blocs de code
  renderer.code = ({ text, lang }) => {
    const validLanguage = lang || 'text';
    return `<pre class="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4"><code class="language-${validLanguage} text-sm text-gray-100">${text}</code></pre>`;
  };

  // Configuration de marked
  marked.setOptions({
    renderer,
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Conversion des retours à la ligne
  });

  const htmlContent = marked(content);

  return (
    <div className="p-4 overflow-y-auto h-full bg-gray-900 text-gray-100">
      <div 
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
