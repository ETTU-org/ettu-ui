/**
 * Bouton pour réinitialiser le localStorage avec les données de test
 */

import { MOCK_PROJECTS, MOCK_NOTES, MOCK_SNIPPETS } from "../data/mockProjects";

export default function TestDataInitializer() {
  const initializeTestData = () => {
    if (
      window.confirm(
        "Voulez-vous réinitialiser les données avec les projets de test ?"
      )
    ) {
      // Sauvegarder les données de test
      localStorage.setItem("ettu-projects", JSON.stringify(MOCK_PROJECTS));
      localStorage.setItem("ettu-project-notes", JSON.stringify(MOCK_NOTES));
      localStorage.setItem(
        "ettu-project-snippets",
        JSON.stringify(MOCK_SNIPPETS)
      );

      // Recharger la page pour voir les changements
      window.location.reload();
    }
  };

  const clearAllData = () => {
    if (
      window.confirm("Voulez-vous supprimer toutes les données des projets ?")
    ) {
      localStorage.removeItem("ettu-projects");
      localStorage.removeItem("ettu-project-notes");
      localStorage.removeItem("ettu-project-snippets");

      // Recharger la page
      window.location.reload();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2">
      <button
        onClick={initializeTestData}
        className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm shadow-lg"
      >
        🔄 Charger données de test
      </button>
      <button
        onClick={clearAllData}
        className="block w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm shadow-lg"
      >
        🗑️ Vider les données
      </button>
    </div>
  );
}
