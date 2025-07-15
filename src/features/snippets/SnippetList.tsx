/**
 * SnippetList - Composant d'affichage et de gestion des snippets
 *
 * Ce composant affiche une liste de snippets avec deux modes :
 * - Mode liste : Vue compacte avec aperçu
 * - Mode détail : Vue complète d'un snippet spécifique
 *
 * Fonctionnalités :
 * - Affichage avec coloration syntaxique
 * - Copie vers le presse-papiers
 * - Actions rapides (éditer, supprimer)
 * - Badges colorés par langage
 * - Support responsive
 *
 * @component
 * @example
 * ```tsx
 * <SnippetList
 *   snippets={filteredSnippets}
 *   selectedSnippet={selectedSnippet}
 *   onSelectSnippet={setSelectedSnippet}
 *   onEditSnippet={handleEdit}
 *   onDeleteSnippet={handleDelete}
 *   viewMode="list"
 * />
 * ```
 */

import { useState } from "react";
import type { Snippet } from "../../types/snippet.js";

/**
 * Props pour le composant SnippetList
 */
interface SnippetListProps {
  /** Liste des snippets à afficher */
  snippets: Snippet[];
  /** Snippet actuellement sélectionné */
  selectedSnippet: Snippet | null;
  /** Callback appelé lors de la sélection d'un snippet */
  onSelect: (snippet: Snippet) => void;
  /** Callback appelé pour éditer un snippet */
  onEdit: (snippet: Snippet) => void;
  /** Callback appelé pour supprimer un snippet */
  onDelete: (id: string) => void;
}

/**
 * Composant de liste des snippets de code
 *
 * Affiche une liste de snippets avec :
 * - Prévisualisation du code
 * - Actions rapides (éditer, supprimer, copier)
 * - Badges colorés pour les langages
 * - Informations sur les tags et projets
 * - Design responsive
 *
 * @param props - Les propriétés du composant
 * @returns Le composant de liste des snippets
 */
export default function SnippetList({
  snippets,
  selectedSnippet,
  onSelect,
  onEdit,
  onDelete,
}: SnippetListProps) {
  // État pour gérer les notifications de copie
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
   * Copie le code d'un snippet dans le presse-papiers
   * Affiche une notification temporaire de confirmation
   *
   * @param snippet - Le snippet dont le code doit être copié
   */
  const handleCopyCode = async (snippet: Snippet) => {
    try {
      await navigator.clipboard.writeText(snippet.code);
      setCopiedId(snippet.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Erreur lors de la copie:", err);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {snippets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Aucun snippet trouvé</p>
          </div>
        ) : (
          snippets.map((snippet) => (
            <div
              key={snippet.id}
              className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                selectedSnippet && selectedSnippet.id === snippet.id
                  ? "bg-gray-700 border-blue-500"
                  : "bg-gray-900 border-gray-700 hover:bg-gray-700"
              }`}
              onClick={() => onSelect(snippet)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium text-white ${getLanguageBadgeColor(
                      snippet.language
                    )}`}
                  >
                    {snippet.language}
                  </span>
                  <h3 className="font-semibold text-white text-sm">
                    {snippet.title}
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyCode(snippet);
                    }}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                    title="Copier le code"
                  >
                    {copiedId === snippet.id ? "✓" : "📋"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(snippet);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(snippet.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                {snippet.description}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <span>{snippet.project}</span>
                  <span>•</span>
                  <span>{snippet.tags.join(", ")}</span>
                </div>
                <span>{snippet.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
