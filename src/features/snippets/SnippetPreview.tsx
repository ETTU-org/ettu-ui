/**
 * SnippetPreview - Composant de prévisualisation d'un snippet
 * 
 * Ce composant affiche un snippet en mode lecture seule avec :
 * - Coloration syntaxique du code
 * - Métadonnées complètes
 * - Actions rapides (copier, éditer, supprimer)
 * - Interface optimisée pour la prévisualisation
 * 
 * @component
 * @example
 * ```tsx
 * <SnippetPreview
 *   snippet={selectedSnippet}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import type { Snippet } from "../../types/snippet";

/**
 * Props pour le composant SnippetPreview
 */
interface SnippetPreviewProps {
  /** Le snippet à prévisualiser */
  snippet: Snippet;
  /** Callback appelé pour éditer le snippet */
  onEdit: (snippet: Snippet) => void;
  /** Callback appelé pour supprimer le snippet */
  onDelete: (id: string) => void;
}

/**
 * Composant de prévisualisation de snippet
 * 
 * Affiche un snippet en mode lecture seule avec toutes ses métadonnées
 * et les actions disponibles
 * 
 * @param props - Les propriétés du composant
 * @returns Le composant de prévisualisation
 */
export default function SnippetPreview({
  snippet,
  onEdit,
  onDelete,
}: SnippetPreviewProps) {
  // État pour gérer la notification de copie
  const [copied, setCopied] = useState(false);

  /**
   * Obtient la couleur de badge appropriée pour un langage donné
   * 
   * @param language - Le nom du langage de programmation
   * @returns Les classes CSS pour le badge coloré
   */
  const getLanguageBadgeColor = (language: string) => {
    const lang = language.toLowerCase();
    const colors: { [key: string]: string } = {
      // Web Frontend
      javascript: "bg-yellow-600",
      typescript: "bg-blue-600",
      html: "bg-orange-600",
      css: "bg-purple-600",
      scss: "bg-pink-600",
      less: "bg-indigo-600",
      jsx: "bg-cyan-600",
      tsx: "bg-sky-600",
      
      // Backend & Systems
      python: "bg-green-600",
      rust: "bg-orange-700",
      go: "bg-cyan-700",
      java: "bg-red-600",
      c: "bg-blue-700",
      "c++": "bg-blue-800",
      "c#": "bg-purple-700",
      php: "bg-indigo-700",
      ruby: "bg-red-700",
      kotlin: "bg-violet-600",
      swift: "bg-orange-500",
      dart: "bg-sky-700",
      scala: "bg-red-800",
      elixir: "bg-purple-800",
      
      // Scripting & Shell
      bash: "bg-gray-700",
      shell: "bg-gray-700",
      powershell: "bg-blue-900",
      makefile: "bg-green-800",
      
      // Data & Analytics
      r: "bg-blue-500",
      julia: "bg-green-500",
      matlab: "bg-orange-800",
      sql: "bg-blue-800",
      
      // DevOps & Config
      dockerfile: "bg-cyan-800",
      yaml: "bg-red-500",
      json: "bg-gray-600",
      toml: "bg-brown-600",
      ini: "bg-gray-500",
      terraform: "bg-purple-600",
      ansible: "bg-red-600",
      nginx: "bg-green-700",
      apache: "bg-red-700",
      
      // Documentation
      markdown: "bg-gray-800",
      restructuredtext: "bg-yellow-700",
      latex: "bg-green-900",
      xml: "bg-orange-700",
    };
    
    return colors[lang] || "bg-gray-600";
  };

  /**
   * Obtient l'extension CodeMirror appropriée pour un langage donné
   * 
   * @param language - Le nom du langage de programmation
   * @returns Un tableau d'extensions CodeMirror pour la coloration syntaxique
   */
  const getLanguageExtension = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return [javascript()];
      case 'typescript':
      case 'ts':
        return [javascript({ typescript: true })];
      case 'python':
      case 'py':
        return [python()];
      case 'html':
        return [html()];
      case 'css':
        return [css()];
      case 'json':
        return [json()];
      case 'markdown':
      case 'md':
        return [markdown()];
      default:
        return [];
    }
  };

  /**
   * Copie le code du snippet dans le presse-papiers
   * Affiche une notification temporaire de confirmation
   */
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 h-full flex flex-col">
      {/* En-tête avec titre et actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getLanguageBadgeColor(snippet.language)}`}>
            {snippet.language}
          </span>
          <h3 className="text-lg font-semibold text-white">{snippet.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCode}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
          >
            {copied ? "Copié !" : "Copier"}
          </button>
          <button
            onClick={() => onEdit(snippet)}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
          >
            Modifier
          </button>
          <button
            onClick={() => onDelete(snippet.id)}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Supprimer
          </button>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="mb-4">
        <p className="text-gray-300 text-sm mb-2">{snippet.description}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-2">
          <span>Projet: {snippet.project}</span>
          <span>Créé: {snippet.createdAt.toLocaleDateString()}</span>
          <span>Modifié: {snippet.updatedAt.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2">
          {snippet.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Éditeur de code en lecture seule */}
      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden">
        <CodeMirror
          value={snippet.code}
          extensions={getLanguageExtension(snippet.language)}
          theme="dark"
          editable={false}
          className="text-sm"
        />
      </div>
    </div>
  );
}
