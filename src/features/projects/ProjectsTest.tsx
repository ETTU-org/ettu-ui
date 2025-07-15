/**
 * Test de base pour le système de gestion de projets
 * Permet de valider que les principales fonctionnalités sont opérationnelles
 */

import { useProjects } from "../../hooks/useProjects";
import { PROJECT_STATUSES } from "../../types/project";

export default function ProjectsTest() {
  const {
    projects,
    filteredProjects,
    filter,
    loading,
    stats,
    createProject,
    updateProject,
    deleteProject,
    createNote,
    createSnippet,
    clearFilter,
    getProjectNotes,
    getProjectSnippets,
  } = useProjects();

  const handleCreateTestProject = () => {
    const testProject = {
      name: "Projet de Test",
      description: "Un projet de test pour valider le système",
      color: "#3B82F6",
      status: "active" as const,
      technologies: ["React", "TypeScript", "Vite"],
      team: ["Développeur 1", "Développeur 2"],
      repository: "https://github.com/test/project",
      documentation: "https://docs.test.com",
    };

    createProject(testProject);
  };

  const handleCreateTestNote = () => {
    if (projects.length === 0) {
      alert("Créez d'abord un projet");
      return;
    }

    const testNote = {
      title: "Note de test",
      content: "Contenu de la note de test avec des informations importantes.",
      type: "documentation" as const,
      tags: ["test", "documentation"],
    };

    createNote(projects[0].id, testNote);
  };

  const handleCreateTestSnippet = () => {
    if (projects.length === 0) {
      alert("Créez d'abord un projet");
      return;
    }

    const testSnippet = {
      title: "Snippet de test",
      description: "Un snippet de test React",
      language: "typescript",
      code: `function TestComponent() {
  return (
    <div>
      <h1>Test Component</h1>
      <p>Ceci est un composant de test</p>
    </div>
  );
}`,
      type: "component" as const,
      tags: ["react", "typescript", "component"],
    };

    createSnippet(projects[0].id, testSnippet);
  };

  return (
    <div className="bg-gray-900 text-white p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Test du Système de Projets</h1>

      {/* Statistiques */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Statistiques</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {stats.totalProjects}
            </div>
            <div className="text-sm text-gray-400">Projets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {stats.totalNotes}
            </div>
            <div className="text-sm text-gray-400">Notes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {stats.totalSnippets}
            </div>
            <div className="text-sm text-gray-400">Snippets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {stats.totalTasks}
            </div>
            <div className="text-sm text-gray-400">Tâches</div>
          </div>
        </div>
      </div>

      {/* Actions de test */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Actions de Test</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleCreateTestProject}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Créer un projet de test
          </button>
          <button
            onClick={handleCreateTestNote}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            disabled={projects.length === 0}
          >
            Ajouter une note de test
          </button>
          <button
            onClick={handleCreateTestSnippet}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            disabled={projects.length === 0}
          >
            Ajouter un snippet de test
          </button>
          <button
            onClick={clearFilter}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Filtre actuel */}
      {(filter.status && filter.status.length > 0) ||
      (filter.technologies && filter.technologies.length > 0) ||
      filter.search ? (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filtre Actuel</h2>
          <div className="space-y-2">
            {filter.status && filter.status.length > 0 && (
              <div>
                <span className="font-medium">Status:</span>{" "}
                {filter.status.join(", ")}
              </div>
            )}
            {filter.technologies && filter.technologies.length > 0 && (
              <div>
                <span className="font-medium">Technologies:</span>{" "}
                {filter.technologies.join(", ")}
              </div>
            )}
            {filter.search && (
              <div>
                <span className="font-medium">Recherche:</span> {filter.search}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Liste des projets */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Projets ({filteredProjects.length})
        </h2>
        {loading && (
          <div className="text-center py-8">
            <div className="text-gray-400">Chargement...</div>
          </div>
        )}
        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Aucun projet trouvé. Créez votre premier projet !
          </div>
        )}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid gap-4">
            {filteredProjects.map((project) => {
              const notes = getProjectNotes(project.id);
              const snippets = getProjectSnippets(project.id);
              const statusConfig = PROJECT_STATUSES.find(
                (s) => s.value === project.status
              );

              return (
                <div key={project.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <h3 className="font-semibold">{project.name}</h3>
                    </div>
                    {statusConfig && (
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                    )}
                  </div>

                  {project.description && (
                    <p className="text-gray-300 text-sm mb-3">
                      {project.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <span>{notes.length} notes</span>
                    <span>{snippets.length} snippets</span>
                    <span>{project.stats.totalTasks} tâches</span>
                  </div>

                  {project.metadata.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.metadata.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() =>
                        updateProject(project.id, {
                          status:
                            project.status === "active" ? "paused" : "active",
                        })
                      }
                      className="text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                    >
                      {project.status === "active"
                        ? "Mettre en pause"
                        : "Réactiver"}
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
