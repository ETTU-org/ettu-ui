import { useState, useEffect, useCallback } from "react";
import Layout from "../layouts/Layout";
import type { Snippet } from "../types/snippet";
import type { ProjectSnippet } from "../types/project";
import { useProjects } from "../hooks/useProjects";

// Fonction pour convertir les snippets de projet en snippets globaux
const convertProjectSnippetToGlobalSnippet = (
  projectSnippet: ProjectSnippet,
  projectName: string
): Snippet => {
  return {
    id: projectSnippet.id,
    title: projectSnippet.title,
    language: projectSnippet.language,
    code: projectSnippet.code, // Les ProjectSnippet ont une propriété 'code' dans les types
    description: projectSnippet.description || "",
    tags: projectSnippet.tags || [],
    project: projectName,
    createdAt: projectSnippet.createdAt,
    updatedAt: projectSnippet.updatedAt,
  };
};

export default function SnippetsPage() {
  const { projects, snippets: projectSnippets } = useProjects();
  const [globalSnippets, setGlobalSnippets] = useState<Snippet[]>([]);
  const [allSnippets, setAllSnippets] = useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newSnippetTitle, setNewSnippetTitle] = useState("");
  const [newSnippetCode, setNewSnippetCode] = useState("");
  const [newSnippetLanguage, setNewSnippetLanguage] = useState("javascript");
  const [newSnippetDescription, setNewSnippetDescription] = useState("");

  // Charger les snippets globaux au démarrage
  useEffect(() => {
    const loadGlobalSnippets = () => {
      try {
        const stored = localStorage.getItem("global-snippets");
        if (stored) {
          const parsed = JSON.parse(stored) as Snippet[];
          setGlobalSnippets(parsed);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des snippets globaux:", error);
      }
    };

    loadGlobalSnippets();
  }, []);

  // Sauvegarder les snippets globaux
  const saveGlobalSnippets = useCallback((snippets: Snippet[]) => {
    try {
      localStorage.setItem("global-snippets", JSON.stringify(snippets));
      setGlobalSnippets(snippets);
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde des snippets globaux:",
        error
      );
    }
  }, []);

  // Récupérer tous les snippets des projets
  useEffect(() => {
    const snippets: Snippet[] = [];

    // Ajouter les snippets des projets
    projectSnippets.forEach((snippet) => {
      const project = projects.find((p) => p.id === snippet.projectId);
      if (project) {
        snippets.push(
          convertProjectSnippetToGlobalSnippet(snippet, project.name)
        );
      }
    });

    // Ajouter les snippets globaux
    globalSnippets.forEach((snippet) => {
      snippets.push(snippet);
    });

    setAllSnippets(snippets);
  }, [projectSnippets, projects, globalSnippets]);

  // Créer un nouveau snippet global
  const createGlobalSnippet = () => {
    if (!newSnippetTitle.trim() || !newSnippetCode.trim()) {
      alert("Veuillez remplir au moins le titre et le code du snippet.");
      return;
    }

    const newSnippet: Snippet = {
      id: Date.now().toString(),
      title: newSnippetTitle.trim(),
      language: newSnippetLanguage,
      code: newSnippetCode,
      description: newSnippetDescription.trim(),
      tags: [],
      project: "", // Pas de projet = snippet global
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedGlobalSnippets = [...globalSnippets, newSnippet];
    saveGlobalSnippets(updatedGlobalSnippets);
    setIsCreating(false);
    setNewSnippetTitle("");
    setNewSnippetCode("");
    setNewSnippetDescription("");
    setNewSnippetLanguage("javascript");
  };

  // Supprimer un snippet
  const deleteSnippet = (snippet: Snippet) => {
    if (snippet.project) {
      alert(
        "Vous ne pouvez pas supprimer un snippet lié à un projet depuis cette page."
      );
      return;
    }

    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer le snippet "${snippet.title}" ?`
      )
    ) {
      return;
    }

    // Supprimer le snippet global
    const updatedGlobalSnippets = globalSnippets.filter(
      (s) => s.id !== snippet.id
    );
    saveGlobalSnippets(updatedGlobalSnippets);

    if (selectedSnippet?.id === snippet.id) {
      setSelectedSnippet(null);
    }
  };

  // Filtrer les snippets
  const filteredSnippets = allSnippets.filter((snippet) => {
    const matchesSearch =
      !searchTerm ||
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLanguage =
      !selectedLanguage || snippet.language === selectedLanguage;
    const matchesProject =
      !selectedProject || snippet.project === selectedProject;

    return matchesSearch && matchesLanguage && matchesProject;
  });

  // Obtenir les projets et langages disponibles
  const availableProjects = Array.from(
    new Set(allSnippets.map((s) => s.project).filter(Boolean))
  );
  const availableLanguages = Array.from(
    new Set(allSnippets.map((s) => s.language).filter(Boolean))
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Snippets</h1>
          <p className="text-white">
            Gérez vos extraits de code créés dans vos projets
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les langages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les projets</option>
            {availableProjects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Liste des snippets */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Snippets ({filteredSnippets.length})
              </h2>
              <button
                onClick={() => setIsCreating(true)}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
              >
                + Nouveau
              </button>
            </div>

            {/* Formulaire de création */}
            {isCreating && (
              <div className="mb-4 p-4 border border-green-200 rounded-lg bg-green-50">
                <h3 className="font-medium mb-2 text-black">
                  Créer un nouveau snippet
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Titre du snippet"
                    value={newSnippetTitle}
                    onChange={(e) => setNewSnippetTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <select
                    value={newSnippetLanguage}
                    onChange={(e) => setNewSnippetLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="html">HTML</option>
                    <option value="css">CSS</option>
                    <option value="json">JSON</option>
                    <option value="markdown">Markdown</option>
                    <option value="text">Texte</option>
                  </select>
                  <textarea
                    placeholder="Description (optionnelle)"
                    value={newSnippetDescription}
                    onChange={(e) => setNewSnippetDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <textarea
                    placeholder="Code du snippet"
                    value={newSnippetCode}
                    onChange={(e) => setNewSnippetCode(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={createGlobalSnippet}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                    >
                      Créer
                    </button>
                    <button
                      onClick={() => {
                        setIsCreating(false);
                        setNewSnippetTitle("");
                        setNewSnippetCode("");
                        setNewSnippetDescription("");
                        setNewSnippetLanguage("javascript");
                      }}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSnippets.map((snippet) => (
                <div
                  key={snippet.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedSnippet?.id === snippet.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedSnippet(snippet)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {snippet.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {snippet.language}
                      </span>
                      {!snippet.project && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSnippet(snippet);
                          }}
                          className="text-red-500 hover:text-red-700 text-xs"
                          title="Supprimer ce snippet"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {snippet.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-blue-600">
                      {snippet.project || "Snippet global"}
                    </span>
                    <div className="flex gap-1">
                      {snippet.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {filteredSnippets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun snippet trouvé
                </div>
              )}
            </div>
          </div>

          {/* Aperçu du snippet */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-4">Aperçu</h2>
            {selectedSnippet ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedSnippet.title}
                  </h3>
                  <p className="text-gray-600">{selectedSnippet.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {selectedSnippet.language}
                    </span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {selectedSnippet.project}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="text-sm text-gray-800 overflow-x-auto">
                    <code>{selectedSnippet.code}</code>
                  </pre>
                </div>
                <div className="mt-4 flex gap-2">
                  {selectedSnippet.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Sélectionnez un snippet pour le voir
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
