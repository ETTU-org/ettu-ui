/**
 * Page de gestion des snippets de code
 *
 * Cette page permet aux utilisateurs de :
 * - Créer de nouveaux snippets de code
 * - Éditer des snippets existants
 * - Visualiser et organiser leurs snippets
 * - Filtrer par langage, projet ou tags
 * - Rechercher dans les snippets
 *
 * Architecture :
 * - Gestion d'état local avec useState (stockage en mémoire)
 * - Interface à deux colonnes : liste + éditeur/prévisualisation
 * - Filtrage et recherche en temps réel
 * - Support de 43 langages de programmation organisés en 6 catégories
 *
 * @component
 * @example
 * ```tsx
 * <SnippetsPage />
 * ```
 */

import { useState } from "react";
import Layout from "../layouts/Layout";
import SnippetList from "../features/snippets/SnippetList";
import SnippetEditor from "../features/snippets/SnippetEditor";
import type { Snippet } from "../types/snippet";

/**
 * Composant principal de la page Snippets
 *
 * Gère l'état global des snippets et orchestre les interactions
 * entre la liste, l'éditeur et les fonctionnalités de filtrage
 *
 * @returns Le composant de page des snippets
 */
export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([
    {
      id: "1",
      title: "Fonction de debounce",
      language: "JavaScript",
      code: `function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`,
      description:
        "Fonction utilitaire pour limiter la fréquence d'exécution d'une fonction",
      tags: ["utils", "performance"],
      project: "Projet Web",
      createdAt: new Date("2025-01-10"),
      updatedAt: new Date("2025-01-10"),
    },
    {
      id: "2",
      title: "Validation email regex",
      language: "JavaScript",
      code: `const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

function validateEmail(email) {
  return emailRegex.test(email);
}`,
      description: "Validation d'email avec regex simple",
      tags: ["validation", "regex"],
      project: "Formulaires",
      createdAt: new Date("2025-01-12"),
      updatedAt: new Date("2025-01-12"),
    },
    {
      id: "3",
      title: "Composant Button React",
      language: "TSX",
      code: `interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  children 
}: ButtonProps) {
  const baseClasses = "font-semibold rounded transition-colors focus:outline-none focus:ring-2";
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${disabled ? 'opacity-50 cursor-not-allowed' : ''}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}`,
      description: "Composant Button réutilisable avec variants et tailles",
      tags: ["react", "component", "ui"],
      project: "Design System",
      createdAt: new Date("2025-01-14"),
      updatedAt: new Date("2025-01-14"),
    },
    {
      id: "4",
      title: "Script de déploiement Docker",
      language: "Bash",
      code: `#!/bin/bash

# Variables
IMAGE_NAME="myapp"
TAG="latest"
CONTAINER_NAME="myapp-container"

# Construire l'image
echo "Building Docker image..."
docker build -t $IMAGE_NAME:$TAG .

# Arrêter le conteneur existant
echo "Stopping existing container..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Démarrer le nouveau conteneur
echo "Starting new container..."
docker run -d --name $CONTAINER_NAME -p 3000:3000 $IMAGE_NAME:$TAG

echo "Deployment completed!"`,
      description: "Script automatisé pour déployer une application Docker",
      tags: ["docker", "deployment", "automation"],
      project: "DevOps",
      createdAt: new Date("2025-01-13"),
      updatedAt: new Date("2025-01-13"),
    },
    {
      id: "5",
      title: "Analyse de données avec Pandas",
      language: "Python",
      code: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

def analyze_sales_data(filepath):
    """Analyse des données de ventes"""
    
    # Charger les données
    df = pd.read_csv(filepath)
    
    # Nettoyage des données
    df['date'] = pd.to_datetime(df['date'])
    df = df.dropna()
    
    # Calculs statistiques
    total_sales = df['amount'].sum()
    avg_sale = df['amount'].mean()
    monthly_sales = df.groupby(df['date'].dt.month)['amount'].sum()
    
    # Visualisation
    plt.figure(figsize=(10, 6))
    monthly_sales.plot(kind='bar')
    plt.title('Ventes mensuelles')
    plt.xlabel('Mois')
    plt.ylabel('Montant')
    plt.show()
    
    return {
        'total': total_sales,
        'average': avg_sale,
        'monthly': monthly_sales
    }`,
      description: "Fonction d'analyse de données de ventes avec visualisation",
      tags: ["data-analysis", "pandas", "visualization"],
      project: "Data Science",
      createdAt: new Date("2025-01-15"),
      updatedAt: new Date("2025-01-15"),
    },
    {
      id: "6",
      title: "Configuration Nginx",
      language: "NGINX",
      code: `server {
    listen 80;
    server_name example.com www.example.com;
    
    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    # SSL Configuration
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Root directory
    root /var/www/html;
    index index.html index.htm;
    
    # Location blocks
    location / {
        try_files $uri $uri/ =404;
    }
    
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Cache static files
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}`,
      description: "Configuration Nginx complète avec SSL, proxy et cache",
      tags: ["nginx", "ssl", "proxy", "cache"],
      project: "Infrastructure",
      createdAt: new Date("2025-01-16"),
      updatedAt: new Date("2025-01-16"),
    },
  ]);

  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  // Filtrer les snippets
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesLanguage =
      !selectedLanguage || snippet.language === selectedLanguage;
    const matchesProject =
      !selectedProject || snippet.project === selectedProject;

    return matchesSearch && matchesLanguage && matchesProject;
  });

  // Obtenir les langages uniques
  const languages = Array.from(new Set(snippets.map((s) => s.language))).sort();

  // Obtenir les projets uniques
  const projects = Array.from(new Set(snippets.map((s) => s.project))).sort();

  const handleSaveSnippet = (
    snippet: Omit<Snippet, "id" | "createdAt" | "updatedAt">
  ) => {
    if (selectedSnippet) {
      // Modifier un snippet existant
      setSnippets((prev) =>
        prev.map((s) =>
          s.id === selectedSnippet.id
            ? {
                ...snippet,
                id: selectedSnippet.id,
                createdAt: selectedSnippet.createdAt,
                updatedAt: new Date(),
              }
            : s
        )
      );
    } else {
      // Créer un nouveau snippet
      const newSnippet: Snippet = {
        ...snippet,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSnippets((prev) => [newSnippet, ...prev]);
    }
    setIsEditing(false);
    setSelectedSnippet(null);
  };

  const handleDeleteSnippet = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce snippet ?")) {
      setSnippets((prev) => prev.filter((s) => s.id !== id));
      if (selectedSnippet?.id === id) {
        setSelectedSnippet(null);
      }
    }
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setSelectedSnippet(snippet);
    setIsEditing(true);
  };

  const handleNewSnippet = () => {
    setSelectedSnippet(null);
    setIsEditing(true);
  };

  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* En-tête */}
        <div className="flex-shrink-0 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Gestionnaire de Snippets
              </h1>
              <p className="text-gray-300">
                Organisez et gérez vos extraits de code techniques
              </p>
            </div>
            <button
              onClick={handleNewSnippet}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              + Nouveau Snippet
            </button>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Rechercher par titre, description ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les langages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous les projets</option>
              {projects.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 grid md:grid-cols-2 gap-6 min-h-0">
          {/* Liste des snippets */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">
                Snippets ({filteredSnippets.length})
              </h2>
            </div>
            <div className="flex-1 overflow-hidden">
              <SnippetList
                snippets={filteredSnippets}
                selectedSnippet={selectedSnippet}
                onSelect={setSelectedSnippet}
                onEdit={handleEditSnippet}
                onDelete={handleDeleteSnippet}
              />
            </div>
          </div>

          {/* Éditeur/Visualiseur */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white">
                {isEditing ? "Éditeur" : "Prévisualisation"}
              </h2>
              {selectedSnippet && !isEditing && (
                <button
                  onClick={() => handleEditSnippet(selectedSnippet)}
                  className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                >
                  Modifier
                </button>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              {isEditing ? (
                <SnippetEditor
                  snippet={selectedSnippet}
                  onSave={handleSaveSnippet}
                  onCancel={() => {
                    setIsEditing(false);
                    setSelectedSnippet(null);
                  }}
                />
              ) : selectedSnippet ? (
                <SnippetList
                  snippets={[selectedSnippet]}
                  selectedSnippet={selectedSnippet}
                  onSelect={() => {}}
                  onEdit={handleEditSnippet}
                  onDelete={handleDeleteSnippet}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-800 border border-gray-700 rounded-lg">
                  <p className="text-gray-400">
                    Sélectionnez un snippet pour le visualiser ou créez-en un
                    nouveau
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
