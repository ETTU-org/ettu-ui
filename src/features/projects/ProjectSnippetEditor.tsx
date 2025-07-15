import { useState, useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { secureLocalStorage } from "../../utils/secureLocalStorage";
import type { ProjectSnippet } from "../../types/project";

// Extensions de langages disponibles
const languageExtensions = {
  javascript: javascript(),
  typescript: javascript({ typescript: true }),
  python: python(),
  html: html(),
  css: css(),
  json: json(),
  markdown: markdown(),
  text: [],
};

// Fonctions de validation simplifiées
const validateContent = (content: string | undefined) => {
  const errors: string[] = [];

  if (!content) {
    return {
      isValid: true,
      errors: [],
    };
  }

  if (content.length > 50000) {
    errors.push("Le contenu ne peut pas dépasser 50,000 caractères");
  }

  // Vérifier les scripts potentiellement dangereux
  if (content.includes("<script>") || content.includes("javascript:")) {
    errors.push("Le contenu ne peut pas contenir de scripts");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateTitle = (title: string | undefined) => {
  const errors: string[] = [];

  if (!title || title.trim() === "") {
    errors.push("Le titre ne peut pas être vide");
  }

  if (title && title.length > 100) {
    errors.push("Le titre ne peut pas dépasser 100 caractères");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Fonction de log des événements de sécurité simplifiée
const logSecurityEvent = (event: string, data: Record<string, unknown>) => {
  console.log(`[Security Event] ${event}:`, data);
};

interface ProjectSnippetEditorProps {
  projectId: string;
  projectName: string;
  onSnippetsCountChange?: (count: number) => void;
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "text", label: "Texte" },
];

const SNIPPET_TEMPLATES = {
  javascript: `function exemple() {
  // Votre code JavaScript ici
  return "Hello World";
}`,
  typescript: `interface ExempleInterface {
  nom: string;
  valeur: number;
}

function exemple(): ExempleInterface {
  return {
    nom: "exemple",
    valeur: 42
  };
}`,
  python: `def exemple():
    """Fonction d'exemple"""
    return "Hello World"

if __name__ == "__main__":
    print(exemple())`,
  html: `<!DOCTYPE html>
<html>
<head>
  <title>Exemple</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
  css: `.exemple {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
}`,
  json: `{
  "nom": "exemple",
  "version": "1.0.0",
  "description": "Exemple de snippet JSON"
}`,
  markdown: `# Titre

## Sous-titre

Contenu en **markdown** avec *italique*.

- Liste item 1
- Liste item 2

\`\`\`javascript
console.log("Code example");
\`\`\``,
  text: `Exemple de snippet texte
Vous pouvez y mettre n'importe quel contenu textuel.`,
};

/**
 * Composant d'édition de snippets pour un projet spécifique
 */
export function ProjectSnippetEditor({
  projectId,
  projectName,
  onSnippetsCountChange,
}: ProjectSnippetEditorProps) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [titleValidationErrors, setTitleValidationErrors] = useState<string[]>(
    []
  );
  const [contentValidationErrors, setContentValidationErrors] = useState<
    string[]
  >([]);
  const [snippets, setSnippets] = useState<ProjectSnippet[]>([]);
  const [currentSnippetId, setCurrentSnippetId] = useState<string | null>(null);

  // Clé pour le stockage sécurisé spécifique au projet
  const storageKey = `project-snippets-${projectId}`;

  // Charger les snippets du projet au démarrage
  useEffect(() => {
    const loadProjectSnippets = () => {
      try {
        const storedSnippets = secureLocalStorage.getItem(storageKey);
        if (storedSnippets) {
          const projectSnippets = JSON.parse(
            storedSnippets
          ) as ProjectSnippet[];
          setSnippets(projectSnippets);

          // Charger le premier snippet par défaut
          if (projectSnippets.length > 0) {
            const firstSnippet = projectSnippets[0];
            setCurrentSnippetId(firstSnippet.id);
            setContent(firstSnippet.code);
            setTitle(firstSnippet.title);
            setDescription(firstSnippet.description || "");
            setLanguage(firstSnippet.language);
            setTags(firstSnippet.tags);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des snippets du projet:",
          error
        );
        logSecurityEvent("project_snippets_load_error", {
          projectId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    loadProjectSnippets();
  }, [projectId, storageKey]);

  // Notifier le composant parent du nombre de snippets
  useEffect(() => {
    if (onSnippetsCountChange) {
      onSnippetsCountChange(snippets.length);
    }
  }, [snippets.length, onSnippetsCountChange]);

  // Sauvegarder les snippets du projet
  const saveProjectSnippets = useCallback(
    (updatedSnippets: ProjectSnippet[]) => {
      try {
        // Sauvegarder les snippets spécifiques au projet
        secureLocalStorage.setItem(storageKey, JSON.stringify(updatedSnippets));

        // Aussi sauvegarder dans le système global pour que useProjects puisse les récupérer
        const globalSnippetsKey = "ettu-project-snippets";
        const existingGlobalSnippets = JSON.parse(
          localStorage.getItem(globalSnippetsKey) || "[]"
        );

        // Supprimer les anciens snippets de ce projet
        const otherProjectSnippets = existingGlobalSnippets.filter(
          (snippet: ProjectSnippet) => snippet.projectId !== projectId
        );

        // Ajouter les nouveaux snippets de ce projet
        const updatedGlobalSnippets = [
          ...otherProjectSnippets,
          ...updatedSnippets,
        ];
        localStorage.setItem(
          globalSnippetsKey,
          JSON.stringify(updatedGlobalSnippets)
        );

        setSnippets(updatedSnippets);
        setLastSaved(new Date());

        // Notifier le changement du nombre de snippets
        if (onSnippetsCountChange) {
          onSnippetsCountChange(updatedSnippets.length);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la sauvegarde des snippets du projet:",
          error
        );
        logSecurityEvent("project_snippets_save_error", {
          projectId,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
    [projectId, storageKey, onSnippetsCountChange]
  );

  // Auto-sauvegarde (sans synchronisation automatique pour éviter les doublons)
  useEffect(() => {
    if (!currentSnippetId || !content?.trim() || !title?.trim()) return;

    const timeoutId = setTimeout(() => {
      const updatedSnippets = snippets.map((snippet) =>
        snippet.id === currentSnippetId
          ? {
              ...snippet,
              code: content,
              title,
              description,
              language,
              tags,
              updatedAt: new Date(),
            }
          : snippet
      );
      saveProjectSnippets(updatedSnippets);

      // Note: Pas de synchronisation automatique pour éviter les doublons
      // La page /snippets récupère directement les snippets via useProjects
    }, 3000); // Augmenté à 3 secondes pour réduire la fréquence

    return () => clearTimeout(timeoutId);
  }, [
    content,
    title,
    description,
    language,
    tags,
    currentSnippetId,
    snippets,
    saveProjectSnippets,
  ]);

  // Validation du contenu
  useEffect(() => {
    const contentValidation = validateContent(content);
    setContentValidationErrors(contentValidation.errors);

    const titleValidation = validateTitle(title);
    setTitleValidationErrors(titleValidation.errors);

    if (!contentValidation.isValid || !titleValidation.isValid) {
      logSecurityEvent("project_snippet_validation_error", {
        projectId,
        snippetId: currentSnippetId,
        contentErrors: contentValidation.errors,
        titleErrors: titleValidation.errors,
      });
    }
  }, [content, title, currentSnippetId, projectId]);

  // Créer un nouveau snippet
  const createNewSnippet = () => {
    const newSnippet: ProjectSnippet = {
      id: Date.now().toString(),
      projectId,
      title: "Nouveau snippet",
      description: "",
      code: SNIPPET_TEMPLATES[language as keyof typeof SNIPPET_TEMPLATES] || "",
      language,
      type: "utility",
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSnippets = [...snippets, newSnippet];
    saveProjectSnippets(updatedSnippets);

    // Note: Pas de synchronisation automatique pour éviter les doublons
    // La page /snippets récupère directement les snippets via useProjects

    setCurrentSnippetId(newSnippet.id);
    setContent(newSnippet.code);
    setTitle(newSnippet.title);
    setDescription(newSnippet.description || "");
    setLanguage(newSnippet.language);
    setTags(newSnippet.tags);
  };

  // Supprimer un snippet
  const deleteSnippet = (snippetId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce snippet ?"))
      return;

    const updatedSnippets = snippets.filter(
      (snippet) => snippet.id !== snippetId
    );
    saveProjectSnippets(updatedSnippets);

    // Note: Pas de synchronisation automatique pour éviter les doublons
    // La page /snippets récupère directement les snippets via useProjects

    if (currentSnippetId === snippetId) {
      if (updatedSnippets.length > 0) {
        const firstSnippet = updatedSnippets[0];
        setCurrentSnippetId(firstSnippet.id);
        setContent(firstSnippet.code);
        setTitle(firstSnippet.title);
        setDescription(firstSnippet.description || "");
        setLanguage(firstSnippet.language);
        setTags(firstSnippet.tags);
      } else {
        setCurrentSnippetId(null);
        setContent("");
        setTitle("");
        setDescription("");
        setLanguage("javascript");
        setTags([]);
      }
    }
  };

  // Sélectionner un snippet
  const selectSnippet = (snippet: ProjectSnippet) => {
    setCurrentSnippetId(snippet.id);
    setContent(snippet.code);
    setTitle(snippet.title);
    setDescription(snippet.description || "");
    setLanguage(snippet.language);
    setTags(snippet.tags);
  };

  // Gérer le changement de contenu
  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  // Ajouter un tag
  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Supprimer un tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Télécharger le snippet
  const downloadSnippet = () => {
    if (!content?.trim()) return;

    const extension =
      language === "javascript"
        ? "js"
        : language === "typescript"
        ? "ts"
        : language === "python"
        ? "py"
        : language === "html"
        ? "html"
        : language === "css"
        ? "css"
        : language === "json"
        ? "json"
        : language === "markdown"
        ? "md"
        : "txt";

    const fileName = `${title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")}.${extension}`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logSecurityEvent("project_snippet_downloaded", {
      projectId,
      snippetId: currentSnippetId,
      filename: fileName,
    });
  };

  // Copier le snippet dans le presse-papiers
  const copyToClipboard = async () => {
    if (!content?.trim()) return;

    try {
      await navigator.clipboard.writeText(content);
      // Vous pouvez ajouter une notification ici
      logSecurityEvent("project_snippet_copied", {
        projectId,
        snippetId: currentSnippetId,
      });
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* En-tête avec gestion des snippets */}
      <div className="flex-none p-4 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white mb-1">
              Snippets du projet: {projectName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>Organisez et réutilisez vos bouts de code</span>
              {lastSaved && (
                <span className="text-green-400">
                  • Sauvegardé à {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={createNewSnippet}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              ➕ Nouveau snippet
            </button>
          </div>
        </div>
      </div>

      {/* Liste des snippets */}
      {snippets.length > 0 && (
        <div className="flex-none p-4 border-b border-gray-700">
          <div className="flex flex-wrap gap-2">
            {snippets.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => selectSnippet(snippet)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentSnippetId === snippet.id
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <span className="font-medium">{snippet.title}</span>
                <span className="ml-1 text-xs opacity-75">
                  ({snippet.language})
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSnippet(snippet.id);
                  }}
                  className="ml-2 text-red-400 hover:text-red-300"
                  title="Supprimer"
                >
                  ✕
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire de métadonnées */}
      {currentSnippetId && (
        <div className="flex-none p-4 border-b border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Titre du snippet
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 ${
                  titleValidationErrors.length > 0
                    ? "border-red-500 bg-red-900 text-red-100 focus:ring-red-500"
                    : "border-gray-600 bg-gray-800 text-white focus:ring-blue-500"
                }`}
                placeholder="Titre du snippet"
              />
              {titleValidationErrors.length > 0 && (
                <div className="mt-1 text-xs text-red-400">
                  {titleValidationErrors.map((error, index) => (
                    <div key={index}>• {error}</div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Langage
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description (optionnelle)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description du snippet"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-blue-200 hover:text-white"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  className="flex-1 px-3 py-1 border border-gray-600 bg-gray-800 text-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ajouter un tag"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={downloadSnippet}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
              disabled={!content?.trim()}
            >
              💾 Télécharger
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
              disabled={!content?.trim()}
            >
              📋 Copier
            </button>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 min-h-0">
        {currentSnippetId ? (
          <div className="flex flex-col h-full p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">
                  Éditeur de Code
                </h2>
                {contentValidationErrors.length > 0 && (
                  <div className="flex items-center gap-1 text-red-400">
                    <span className="text-sm">⚠️</span>
                    <span className="text-xs">Erreurs détectées</span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>{content?.length || 0} caractères</span>
                <span>{content?.split("\n").length || 0} lignes</span>
              </div>
            </div>

            {/* Affichage des erreurs de validation */}
            {contentValidationErrors.length > 0 && (
              <div className="mb-3 p-3 bg-red-900 border border-red-700 rounded text-sm text-red-100">
                <div className="font-semibold mb-1">
                  ⚠️ Erreurs de validation :
                </div>
                {contentValidationErrors.map((error, index) => (
                  <div key={index} className="ml-2">
                    • {error}
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
              <CodeMirror
                value={content || ""}
                height="100%"
                extensions={[
                  languageExtensions[
                    language as keyof typeof languageExtensions
                  ],
                ]}
                theme="dark"
                onChange={handleContentChange}
                className="text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="mb-4">Aucun snippet créé pour ce projet</p>
              <button
                onClick={createNewSnippet}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ➕ Créer votre premier snippet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
