/**
 * Éditeur de notes techniques en Markdown
 * Permet de rédiger, prévisualiser et sauvegarder des notes en Markdown
 * avec auto-sauvegarde et options de formatage.
 * @file NoteEditor.tsx
 * @author BOSSIS--GUYON Jules
 * @date 2025-07-14
 *
 * Ce composant permet de créer et éditer des notes techniques en Markdown.
 * Il inclut un éditeur avec syntaxe Markdown, une prévisualisation en temps réel
 * et des fonctionnalités d'auto-sauvegarde dans le stockage sécurisé (secureStorage).
 * L'utilisateur peut insérer des modèles de texte, effacer le contenu,
 * télécharger la note au format Markdown et créer de nouvelles notes.
 * * Les fonctionnalités incluent :
 * - Éditeur Markdown avec syntaxe colorée
 * - Prévisualisation en temps réel du rendu Markdown
 * - Auto-sauvegarde dans le stockage sécurisé toutes les 2 secondes
 * - Insertion de modèles de texte (gras, italique, code, listes, liens
 *  tableaux, citations)
 * - Effacement du contenu avec confirmation
 * - Téléchargement de la note au format Markdown
 * - Création de nouvelles notes avec confirmation
 * - Stockage sécurisé avec chiffrement AES-256 des données
 */

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { ResponsiveLayout } from "../../utils/responsive";
import { secureLocalStorage } from "../../utils/secureLocalStorage";
import {
  validateNoteContent,
  validateFilename,
  logSecurityEvent,
} from "../../utils/securityValidator";

export default function NoteEditor() {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("nouvelle-note.md");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [contentValidationErrors, setContentValidationErrors] = useState<
    string[]
  >([]);

  // Charger le contenu depuis le secureStorage au démarrage
  useEffect(() => {
    // Migration des données existantes du localStorage vers secureStorage
    const migrateFromLocalStorage = () => {
      const oldContent = localStorage.getItem("noteEditor-content");
      const oldFileName = localStorage.getItem("noteEditor-fileName");

      if (oldContent && !secureLocalStorage.hasItem("noteEditor-content")) {
        console.log("Migration des données vers le stockage sécurisé...");
        secureLocalStorage.setItem("noteEditor-content", oldContent);
        if (oldFileName) {
          secureLocalStorage.setItem("noteEditor-fileName", oldFileName);
        }
        // Nettoyer les anciennes données
        localStorage.removeItem("noteEditor-content");
        localStorage.removeItem("noteEditor-fileName");
        console.log("Migration terminée avec succès");
      }
    };

    migrateFromLocalStorage();

    const savedContent = secureLocalStorage.getItem("noteEditor-content");
    const savedFileName = secureLocalStorage.getItem("noteEditor-fileName");

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

  // Auto-sauvegarde toutes les 2 secondes avec validation
  useEffect(() => {
    const interval = setInterval(() => {
      if (content.trim()) {
        // Valider le contenu avant sauvegarde
        const contentValidation = validateNoteContent(content);
        const filenameValidation = validateFilename(fileName);

        if (!contentValidation.isValid) {
          logSecurityEvent("invalid_content_attempted", {
            errors: contentValidation.errors,
            contentLength: content.length,
          });
          console.warn("Contenu invalide détecté:", contentValidation.errors);
          return;
        }

        if (!filenameValidation.isValid) {
          logSecurityEvent("invalid_filename_attempted", {
            errors: filenameValidation.errors,
            filename: fileName,
          });
          console.warn(
            "Nom de fichier invalide détecté:",
            filenameValidation.errors
          );
          return;
        }

        // Sauvegarder le contenu sanitisé
        secureLocalStorage.setItem(
          "noteEditor-content",
          contentValidation.sanitized
        );
        secureLocalStorage.setItem(
          "noteEditor-fileName",
          filenameValidation.sanitized
        );
        setLastSaved(new Date());
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [content, fileName]);

  const insertTemplate = (template: string) => {
    // Valider le template avant insertion
    const validation = validateNoteContent(template);
    if (!validation.isValid) {
      logSecurityEvent("invalid_template_attempted", {
        errors: validation.errors,
        template: template,
      });
      console.warn("Template invalide détecté:", validation.errors);
      return;
    }

    setContent((prev) => prev + "\n\n" + validation.sanitized);
  };

  const clearContent = () => {
    if (confirm("Êtes-vous sûr de vouloir effacer tout le contenu ?")) {
      setContent("");
      secureLocalStorage.removeItem("noteEditor-content");
      secureLocalStorage.removeItem("noteEditor-fileName");
      setLastSaved(null);
    }
  };

  const downloadNote = () => {
    // Valider le contenu et le nom de fichier avant téléchargement
    const contentValidation = validateNoteContent(content);
    const filenameValidation = validateFilename(fileName);

    if (!contentValidation.isValid) {
      logSecurityEvent("invalid_download_content_attempted", {
        errors: contentValidation.errors,
        contentLength: content.length,
      });
      alert(
        "Erreur: Le contenu de la note contient des éléments invalides.\n" +
          contentValidation.errors.join("\n")
      );
      return;
    }

    if (!filenameValidation.isValid) {
      logSecurityEvent("invalid_download_filename_attempted", {
        errors: filenameValidation.errors,
        filename: fileName,
      });
      alert(
        "Erreur: Le nom de fichier est invalide.\n" +
          filenameValidation.errors.join("\n")
      );
      return;
    }

    // Utiliser le contenu et nom de fichier sanitisés
    const blob = new Blob([contentValidation.sanitized], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filenameValidation.sanitized;
    a.click();
    URL.revokeObjectURL(url);

    logSecurityEvent("note_downloaded", {
      filename: filenameValidation.sanitized,
      contentLength: contentValidation.sanitized.length,
    });
  };

  const newNote = () => {
    if (
      content.trim() &&
      confirm(
        "Créer une nouvelle note ? Le contenu actuel sera perdu si non sauvegardé."
      )
    ) {
      setContent("");
      setFileName("nouvelle-note.md");
      secureLocalStorage.removeItem("noteEditor-content");
      secureLocalStorage.removeItem("noteEditor-fileName");
      setLastSaved(null);

      logSecurityEvent("new_note_created", {
        previousContentLength: content.length,
        previousFilename: fileName,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* En-tête avec actions */}
      <div className="flex-shrink-0 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
              Éditeur de Notes Techniques
            </h1>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 text-sm text-gray-300 gap-2 md:gap-0">
              <span>
                Rédigez et prévisualisez vos notes en Markdown en temps réel
              </span>
              {lastSaved && (
                <span className="text-green-400">
                  • Sauvegardé à {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={fileName}
                onChange={(e) => {
                  const newFileName = e.target.value;
                  setFileName(newFileName);

                  // Validation en temps réel
                  const validation = validateFilename(newFileName);
                  setValidationErrors(validation.errors);

                  if (!validation.isValid) {
                    logSecurityEvent("invalid_filename_input", {
                      errors: validation.errors,
                      filename: newFileName,
                    });
                  }
                }}
                className={`w-full md:w-auto px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 ${
                  validationErrors.length > 0
                    ? "border-red-500 bg-red-900 text-red-100 focus:ring-red-500"
                    : "border-gray-600 bg-gray-800 text-white focus:ring-blue-500"
                }`}
                placeholder="nom-du-fichier.md"
              />
              {validationErrors.length > 0 && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-red-900 border border-red-700 rounded text-xs text-red-100 z-10 w-full md:w-64">
                  {validationErrors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={newNote}
                className="flex-1 md:flex-none px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
              >
                Nouveau
              </button>
              <button
                onClick={downloadNote}
                className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              >
                Télécharger
              </button>
            </div>
          </div>
        </div>

        {/* Barre d'outils */}
        <div className="flex flex-wrap gap-1 md:gap-2 p-2 md:p-3 bg-gray-800 rounded-lg border border-gray-700">
          <button
            onClick={() => insertTemplate("**texte en gras**")}
            className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter du texte en gras"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => insertTemplate("*texte en italique*")}
            className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter du texte en italique"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => insertTemplate("`code inline`")}
            className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-sm hover:bg-gray-600 transition-colors font-mono"
            title="Ajouter du code inline"
          >
            &lt;/&gt;
          </button>
          <button
            onClick={() =>
              insertTemplate("```javascript\n// Votre code ici\n```")
            }
            className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter un bloc de code"
          >
            <span className="hidden md:inline">Bloc de code</span>
            <span className="md:hidden">Code</span>
          </button>
          <button
            onClick={() => insertTemplate("- Élément de liste")}
            className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter une liste"
          >
            <span className="hidden md:inline">• Liste</span>
            <span className="md:hidden">•</span>
          </button>
          <button
            onClick={() =>
              insertTemplate("[Texte du lien](https://exemple.com)")
            }
            className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter un lien"
          >
            <span className="hidden md:inline">🔗 Lien</span>
            <span className="md:hidden">🔗</span>
          </button>
          <button
            onClick={() =>
              insertTemplate(
                "| Colonne 1 | Colonne 2 |\n|-----------|-----------||\n| Données 1 | Données 2 |"
              )
            }
            className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter un tableau"
          >
            <span className="hidden md:inline">📊 Tableau</span>
            <span className="md:hidden">📊</span>
          </button>
          <button
            onClick={() => insertTemplate("> Citation")}
            className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
            title="Ajouter une citation"
          >
            <span className="hidden md:inline">💬 Citation</span>
            <span className="md:hidden">💬</span>
          </button>
          <div className="flex-1"></div>
          <button
            onClick={clearContent}
            className="px-2 md:px-3 py-1 bg-red-900 text-red-100 border border-red-700 rounded text-xs md:text-sm hover:bg-red-800 transition-colors"
            title="Effacer tout le contenu"
          >
            <span className="hidden md:inline">🗑️ Effacer</span>
            <span className="md:hidden">🗑️</span>
          </button>
        </div>
      </div>

      {/* Éditeur et prévisualisation */}
      <div className="flex-1 min-h-0">
        <ResponsiveLayout
          mainContent={
            <EditorView
              content={content}
              setContent={setContent}
              contentValidationErrors={contentValidationErrors}
              setContentValidationErrors={setContentValidationErrors}
            />
          }
          previewContent={<PreviewView content={content} />}
          tabs={[
            { id: "main", label: "Éditeur", icon: "✏️" },
            { id: "preview", label: "Aperçu", icon: "👁️" },
          ]}
        />
      </div>
    </div>
  );
}

/**
 * Composant d'éditeur Markdown
 */
function EditorView({
  content,
  setContent,
  contentValidationErrors,
  setContentValidationErrors,
}: {
  content: string;
  setContent: (value: string) => void;
  contentValidationErrors: string[];
  setContentValidationErrors: (errors: string[]) => void;
}) {
  const handleContentChange = (value: string) => {
    setContent(value);

    // Validation en temps réel du contenu
    const validation = validateNoteContent(value);
    setContentValidationErrors(validation.errors);

    if (!validation.isValid) {
      logSecurityEvent("invalid_content_input", {
        errors: validation.errors,
        contentLength: value.length,
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">Éditeur Markdown</h2>
          {contentValidationErrors.length > 0 && (
            <div className="flex items-center gap-1 text-red-400">
              <span className="text-sm">⚠️</span>
              <span className="text-xs">Erreurs détectées</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>{content.length} caractères</span>
          <span>{content.split("\n").length} lignes</span>
          <span>
            {content.split(" ").filter((word) => word.length > 0).length} mots
          </span>
        </div>
      </div>

      {/* Affichage des erreurs de validation */}
      {contentValidationErrors.length > 0 && (
        <div className="mb-3 p-3 bg-red-900 border border-red-700 rounded text-sm text-red-100">
          <div className="font-semibold mb-1">⚠️ Erreurs de validation :</div>
          {contentValidationErrors.map((error, index) => (
            <div key={index} className="ml-2">
              • {error}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
        <CodeMirror
          value={content}
          height="100%"
          extensions={[markdown()]}
          theme="dark"
          onChange={handleContentChange}
          className="text-sm"
        />
      </div>
    </div>
  );
}

/**
 * Composant de prévisualisation Markdown
 */
function PreviewView({ content }: { content: string }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">Prévisualisation</h2>
        <span className="text-sm text-gray-400">Rendu en temps réel</span>
      </div>
      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
        <MarkdownPreview content={content} />
      </div>
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  // Configuration de marked pour un rendu sécurisé
  const renderer = new marked.Renderer();

  // Personnalisation du rendu des liens pour ouvrir dans un nouvel onglet
  renderer.link = ({ href, title, tokens }) => {
    const text = tokens.map((token) => token.raw).join("");
    return `<a href="${href}" title="${
      title || ""
    }" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${text}</a>`;
  };

  // Personnalisation du rendu des blocs de code
  renderer.code = ({ text, lang }) => {
    const validLanguage = lang || "text";
    return `<pre class="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4"><code class="language-${validLanguage} text-sm text-gray-100">${text}</code></pre>`;
  };

  // Configuration de marked
  marked.setOptions({
    renderer,
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Conversion des retours à la ligne
  });

  const htmlContent = marked(content) as string;

  // Sanitiser le HTML avec DOMPurify pour éviter les XSS
  const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "code",
      "pre",
      "blockquote",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "a",
      "img",
      "div",
      "span",
    ],
    ALLOWED_ATTR: [
      "href",
      "title",
      "alt",
      "src",
      "width",
      "height",
      "class",
      "id",
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp):)?\/\/[^\s/$.?#].[^\s]*$/i,
  });

  return (
    <div className="p-4 overflow-y-auto h-full bg-gray-900 text-gray-100">
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
}
