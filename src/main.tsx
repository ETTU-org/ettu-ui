import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initializeSecureStorage } from './utils/storageInitializer'

// Initialiser le système de stockage sécurisé au démarrage
initializeSecureStorage().then(result => {
  if (result.initialized) {
    console.log('✅ Système de stockage initialisé avec succès');
  } else {
    console.error('❌ Échec de l\'initialisation du stockage:', result.error);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
