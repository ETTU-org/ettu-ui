/**
 * SnippetEditor - Composant d'édition et de création de snippets
 * 
 * Ce composant fournit une interface complète pour créer de nouveaux snippets
 * ou modifier des snippets existants. Il inclut un formulaire avec validation
 * et un éditeur de code avec coloration syntaxique.
 * 
 * @component
 * @example
 * ```tsx
 * <SnippetEditor
 *   snippet={selectedSnippet}
 *   onSave={handleSave}
 *   onCancel={handleCancel}
 * />
 * ```
 */

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import type { Snippet, SnippetFormData } from "../../types/snippet";

/**
 * Props pour le composant SnippetEditor
 */
interface SnippetEditorProps {
  /** Le snippet à éditer (null pour un nouveau snippet) */
  snippet: Snippet | null;
  /** Callback appelé lors de la sauvegarde du snippet */
  onSave: (snippet: SnippetFormData) => void;
  /** Callback appelé lors de l'annulation de l'édition */
  onCancel: () => void;
}

/**
 * Composant d'édition de snippets de code
 * 
 * Permet de créer et modifier des snippets avec :
 * - Un éditeur de code avec coloration syntaxique (CodeMirror)
 * - Sélection du langage par catégories
 * - Gestion des tags et métadonnées
 * - Validation des champs obligatoires
 * 
 * @param props - Les propriétés du composant
 * @returns Le composant d'édition de snippet
 */
export default function SnippetEditor({ snippet, onSave, onCancel }: SnippetEditorProps) {
  // État du formulaire
  const [formData, setFormData] = useState<SnippetFormData>({
    title: "",
    language: "javascript",
    code: "",
    description: "",
    tags: [],
    project: "",
  });

  // État pour la saisie de nouveaux tags
  const [tagInput, setTagInput] = useState("");

  // Mise à jour du formulaire quand le snippet change
  useEffect(() => {
    if (snippet) {
      setFormData({
        title: snippet.title,
        language: snippet.language,
        code: snippet.code,
        description: snippet.description,
        tags: snippet.tags,
        project: snippet.project,
      });
    }
  }, [snippet]);

  /**
   * Obtient l'extension CodeMirror appropriée pour un langage donné
   * 
   * @param language - Le nom du langage de programmation
   * @returns Un tableau d'extensions CodeMirror pour la coloration syntaxique
   */

  const getLanguageExtension = (language: string) => {
    const lang = language.toLowerCase();
    switch (lang) {
      case "javascript":
      case "js":
        return [javascript({ jsx: false })];
      case "typescript":
      case "ts":
        return [javascript({ jsx: false, typescript: true })];
      case "jsx":
        return [javascript({ jsx: true })];
      case "tsx":
        return [javascript({ jsx: true, typescript: true })];
      case "python":
      case "py":
        return [python()];
      case "html":
        return [html()];
      case "css":
      case "scss":
      case "less":
        return [css()];
      case "json":
        return [json()];
      case "markdown":
      case "md":
        return [markdown()];
      case "bash":
      case "shell":
      case "sh":
        return []; // Pas d'extension spécifique, mais CodeMirror gère bien
      case "yaml":
      case "yml":
        return []; // Peut être ajouté avec @codemirror/lang-yaml si nécessaire
      case "xml":
        return [html()]; // HTML parser fonctionne bien pour XML
      case "sql":
        return []; // Peut être ajouté avec @codemirror/lang-sql si nécessaire
      default:
        return [];
    }
  };

  /**
   * Gestionnaire de soumission du formulaire
   * Valide les champs obligatoires et appelle onSave
   * 
   * @param e - L'événement de soumission du formulaire
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs obligatoires
    if (!formData.title.trim() || !formData.code.trim()) {
      alert("Le titre et le code sont obligatoires");
      return;
    }
    
    onSave(formData);
  };

  /**
   * Ajoute un nouveau tag à la liste des tags
   * Évite les doublons et les tags vides
   */
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  /**
   * Supprime un tag de la liste
   * 
   * @param tagToRemove - Le tag à supprimer
   */
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Gestionnaire de touches pour l'input des tags
   * Permet d'ajouter un tag en appuyant sur Entrée
   * 
   * @param e - L'événement clavier
   */
  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  /**
   * Configuration des langages organisés par catégories
   * Facilite la sélection et l'organisation des langages supportés
   */

  const languages = {
    "Web Frontend": ["JavaScript", "TypeScript", "HTML", "CSS", "SCSS", "Less", "JSX", "TSX"],
    "Backend & Systems": ["Python", "Rust", "Go", "Java", "C", "C++", "C#", "PHP", "Ruby", "Kotlin", "Swift", "Dart", "Scala", "Elixir"],
    "Scripting & Shell": ["Bash", "Shell", "PowerShell", "Makefile"],
    "Data & Analytics": ["R", "Julia", "MATLAB", "SQL"],
    "DevOps & Config": ["Dockerfile", "YAML", "JSON", "TOML", "INI", "Terraform", "Ansible", "NGINX", "Apache"],
    "Documentation": ["Markdown", "reStructuredText", "LaTeX", "XML"]
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg h-full flex flex-col">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            {snippet ? "Modifier le snippet" : "Nouveau snippet"}
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Titre *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du snippet"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Langage
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(languages).map(([category, langs]) => (
                  <optgroup key={category} label={category}>
                    {langs.map(lang => (
                      <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Description du snippet"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Projet
              </label>
              <input
                type="text"
                value={formData.project}
                onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nom du projet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ajouter un tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition-colors"
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-400 hover:text-red-300 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Code *
          </label>
          <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden">
            <CodeMirror
              value={formData.code}
              onChange={(value) => setFormData(prev => ({ ...prev, code: value }))}
              extensions={getLanguageExtension(formData.language)}
              theme="dark"
              className="text-sm"
              placeholder="Votre code ici..."
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {snippet ? "Modifier" : "Créer"}
          </button>
        </div>
      </form>
    </div>
  );
}
