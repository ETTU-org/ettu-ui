/**
 * Utilitaire pour nettoyer les données fictives du localStorage
 * À utiliser une seule fois pour nettoyer les données existantes
 */

export const cleanupTestData = () => {
  // Nettoyer toutes les données ETTU
  const keysToClean = [
    'ettu-projects',
    'ettu-project-notes',
    'ettu-project-snippets',
    'ettu-todos',
    'ettu-user-preferences',
    'ettu-auth-data'
  ];

  keysToClean.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🧹 Nettoyé: ${key}`);
  });

  // Nettoyer toutes les clés qui commencent par 'project-notes-' ou 'project-snippets-'
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('project-notes-') || key.startsWith('project-snippets-')) {
      localStorage.removeItem(key);
      console.log(`🧹 Nettoyé: ${key}`);
    }
  });

  console.log('✅ Nettoyage terminé ! L\'application est maintenant vide et prête pour le backend.');
};

// Fonction pour vérifier si des données de test existent encore
export const hasTestData = () => {
  try {
    const projects = localStorage.getItem('ettu-projects');
    const todos = localStorage.getItem('ettu-todos');
    const snippets = localStorage.getItem('ettu-project-snippets');

    if (projects) {
      const parsedProjects = JSON.parse(projects);
      if (parsedProjects.length > 0) {
        return true;
      }
    }

    if (todos) {
      const parsedTodos = JSON.parse(todos);
      if (parsedTodos.length > 0) {
        return true;
      }
    }

    if (snippets) {
      const parsedSnippets = JSON.parse(snippets);
      if (parsedSnippets.length > 0) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification des données de test:', error);
    return false;
  }
};

// Fonction pour afficher un résumé des données actuelles
export const showDataSummary = () => {
  try {
    const projects = JSON.parse(localStorage.getItem('ettu-projects') || '[]');
    const todos = JSON.parse(localStorage.getItem('ettu-todos') || '[]');
    const snippets = JSON.parse(localStorage.getItem('ettu-project-snippets') || '[]');

    console.log('📊 Résumé des données actuelles:');
    console.log(`   - Projets: ${projects.length}`);
    console.log(`   - Todos: ${todos.length}`);
    console.log(`   - Snippets: ${snippets.length}`);
    
    if (projects.length > 0) {
      console.log('   - Projets existants:', projects.map((p: any) => p.name).join(', '));
    }
  } catch (error) {
    console.error('Erreur lors de l\'affichage du résumé:', error);
  }
};
