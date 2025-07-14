#!/bin/bash

# Script de démarrage pour le mode développement sécurisé
# Lance l'application sur le port 5199 avec authentification

echo "🔒 Démarrage du mode développement sécurisé"
echo "============================================="

# Vérifier si le port 5199 est disponible
if lsof -Pi :5199 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Le port 5199 est déjà utilisé"
    echo "🔧 Arrêt du processus existant..."
    kill -9 $(lsof -ti:5199) 2>/dev/null || true
    sleep 2
fi

# Lancer Vite sur le port 5199
echo "🚀 Lancement sur le port 5199..."
echo "🔑 Authentification requise : admin/admin"
echo "🌐 URL: http://localhost:5199"
echo ""
echo "📋 Fonctionnalités disponibles:"
echo "  • Panel d'administration"
echo "  • Tests de sécurité"
echo "  • Gestion du stockage"
echo "  • Logs de sécurité"
echo "  • Outils de développement"
echo ""

# Exporter la variable d'environnement pour indiquer le mode dev
export VITE_DEV_MODE=true
export VITE_DEV_PORT=5199

# Lancer Vite avec le port personnalisé
npm run dev -- --port 5199 --host
