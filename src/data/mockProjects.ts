/**
 * Données de test pour les projets
 */

import type { ProjectStructure, ProjectNote, ProjectSnippet } from '../types/project';

export const MOCK_PROJECTS: ProjectStructure[] = [
  {
    id: '1',
    name: 'ETTU - Interface Utilisateur',
    description: 'Application web de gestion de projets techniques avec React, TypeScript et Tailwind',
    color: '#3B82F6',
    status: 'active',
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-07-15'),
    stats: {
      totalNotes: 12,
      totalSnippets: 8,
      totalTasks: 15,
      completedTasks: 7,
      lastActivity: new Date('2025-07-15')
    },
    settings: {
      allowPublicSharing: false,
      defaultNoteType: 'documentation',
      defaultSnippetLanguage: 'typescript'
    },
    metadata: {
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'Vite'],
      team: ['Développeur Principal', 'Designer UI/UX'],
      repository: 'https://github.com/ETTU-org/ettu-ui',
      documentation: 'https://ettu-docs.com'
    }
  },
  {
    id: '2',
    name: 'API REST Node.js',
    description: 'API backend pour l\'application ETTU avec authentification JWT et base de données MongoDB',
    color: '#10B981',
    status: 'active',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-07-14'),
    stats: {
      totalNotes: 8,
      totalSnippets: 15,
      totalTasks: 22,
      completedTasks: 18,
      lastActivity: new Date('2025-07-14')
    },
    settings: {
      allowPublicSharing: true,
      defaultNoteType: 'analysis',
      defaultSnippetLanguage: 'javascript'
    },
    metadata: {
      technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Mongoose'],
      team: ['Développeur Backend', 'DevOps'],
      repository: 'https://github.com/ETTU-org/ettu-api',
      documentation: 'https://api-docs.ettu.com'
    }
  },
  {
    id: '3',
    name: 'Application Mobile Flutter',
    description: 'Version mobile de l\'application ETTU pour iOS et Android',
    color: '#8B5CF6',
    status: 'paused',
    createdAt: new Date('2025-03-10'),
    updatedAt: new Date('2025-06-20'),
    stats: {
      totalNotes: 5,
      totalSnippets: 12,
      totalTasks: 18,
      completedTasks: 5,
      lastActivity: new Date('2025-06-20')
    },
    settings: {
      allowPublicSharing: false,
      defaultNoteType: 'idea',
      defaultSnippetLanguage: 'dart'
    },
    metadata: {
      technologies: ['Flutter', 'Dart', 'Firebase', 'Provider'],
      team: ['Développeur Mobile'],
      repository: 'https://github.com/ETTU-org/ettu-mobile'
    }
  },
  {
    id: '4',
    name: 'Système de Déploiement DevOps',
    description: 'Infrastructure et pipeline CI/CD pour tous les projets ETTU',
    color: '#F59E0B',
    status: 'completed',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-05-15'),
    stats: {
      totalNotes: 15,
      totalSnippets: 6,
      totalTasks: 12,
      completedTasks: 12,
      lastActivity: new Date('2025-05-15')
    },
    settings: {
      allowPublicSharing: true,
      defaultNoteType: 'documentation',
      defaultSnippetLanguage: 'yaml'
    },
    metadata: {
      technologies: ['Docker', 'Kubernetes', 'GitHub Actions', 'AWS', 'Terraform'],
      team: ['DevOps Engineer', 'Administrateur Système'],
      repository: 'https://github.com/ETTU-org/ettu-devops',
      documentation: 'https://devops.ettu.com'
    }
  },
  {
    id: '5',
    name: 'Extension VS Code',
    description: 'Extension pour intégrer ETTU directement dans VS Code',
    color: '#EF4444',
    status: 'active',
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-07-12'),
    stats: {
      totalNotes: 7,
      totalSnippets: 10,
      totalTasks: 8,
      completedTasks: 3,
      lastActivity: new Date('2025-07-12')
    },
    settings: {
      allowPublicSharing: true,
      defaultNoteType: 'idea',
      defaultSnippetLanguage: 'typescript'
    },
    metadata: {
      technologies: ['TypeScript', 'VS Code API', 'Webpack'],
      team: ['Développeur Extension'],
      repository: 'https://github.com/ETTU-org/ettu-vscode',
      documentation: 'https://marketplace.visualstudio.com/items?itemName=ettu.ettu-extension'
    }
  },
  {
    id: '6',
    name: 'Plateforme Analytics',
    description: 'Dashboard d\'analyse des données utilisateur et métriques d\'usage',
    color: '#06B6D4',
    status: 'archived',
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2025-01-30'),
    stats: {
      totalNotes: 20,
      totalSnippets: 5,
      totalTasks: 25,
      completedTasks: 20,
      lastActivity: new Date('2025-01-30')
    },
    settings: {
      allowPublicSharing: false,
      defaultNoteType: 'analysis',
      defaultSnippetLanguage: 'python'
    },
    metadata: {
      technologies: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
      team: ['Data Analyst', 'Développeur Backend'],
      repository: 'https://github.com/ETTU-org/ettu-analytics'
    }
  }
];

export const MOCK_NOTES: ProjectNote[] = [
  {
    id: 'note-1',
    projectId: '1',
    title: 'Architecture des composants React',
    content: 'Documentation de l\'architecture des composants principaux de l\'application ETTU. Nous utilisons une approche modulaire avec des hooks personnalisés pour la gestion d\'état.',
    type: 'documentation',
    tags: ['react', 'architecture', 'composants'],
    createdAt: new Date('2025-07-10'),
    updatedAt: new Date('2025-07-12')
  },
  {
    id: 'note-2',
    projectId: '1',
    title: 'Problème de performance sur le filtrage',
    content: 'Le filtrage des projets devient lent avec plus de 100 éléments. Envisager l\'utilisation d\'un debounce ou d\'une pagination.',
    type: 'analysis',
    tags: ['performance', 'filtrage', 'optimisation'],
    createdAt: new Date('2025-07-08'),
    updatedAt: new Date('2025-07-08')
  },
  {
    id: 'note-3',
    projectId: '2',
    title: 'Stratégie d\'authentification JWT',
    content: 'Implémentation de l\'authentification avec tokens JWT. Durée de vie de 1h pour les access tokens et 7 jours pour les refresh tokens.',
    type: 'documentation',
    tags: ['authentification', 'jwt', 'sécurité'],
    createdAt: new Date('2025-07-05'),
    updatedAt: new Date('2025-07-05')
  },
  {
    id: 'note-4',
    projectId: '3',
    title: 'Idée: Synchronisation offline',
    content: 'Permettre à l\'application mobile de fonctionner en mode offline avec synchronisation automatique une fois reconnectée.',
    type: 'idea',
    tags: ['mobile', 'offline', 'synchronisation'],
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2025-06-15')
  },
  {
    id: 'note-5',
    projectId: '4',
    title: 'Configuration Kubernetes',
    content: 'Documentation complète de la configuration Kubernetes pour le déploiement des microservices ETTU.',
    type: 'documentation',
    tags: ['kubernetes', 'déploiement', 'microservices'],
    createdAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-05-12')
  }
];

export const MOCK_SNIPPETS: ProjectSnippet[] = [
  {
    id: 'snippet-1',
    projectId: '1',
    title: 'Hook personnalisé useProjects',
    description: 'Hook React pour la gestion des projets avec localStorage',
    language: 'typescript',
    code: `import { useState, useEffect } from 'react';
import type { ProjectStructure } from '../types/project';

export function useProjects() {
  const [projects, setProjects] = useState<ProjectStructure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProjects = localStorage.getItem('ettu-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    setLoading(false);
  }, []);

  const createProject = (projectData: Partial<ProjectStructure>) => {
    const newProject: ProjectStructure = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    } as ProjectStructure;
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('ettu-projects', JSON.stringify(updatedProjects));
  };

  return { projects, loading, createProject };
}`,
    type: 'function',
    tags: ['react', 'hook', 'typescript'],
    createdAt: new Date('2025-07-10'),
    updatedAt: new Date('2025-07-10')
  },
  {
    id: 'snippet-2',
    projectId: '1',
    title: 'Composant ProjectCard',
    description: 'Composant pour afficher une carte de projet',
    language: 'typescript',
    code: `interface ProjectCardProps {
  project: ProjectStructure;
  onSelect: (project: ProjectStructure) => void;
  onEdit: (project: ProjectStructure) => void;
  onDelete: (projectId: string) => void;
}

export function ProjectCard({ project, onSelect, onEdit, onDelete }: ProjectCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div 
            className="w-4 h-4 rounded-full" 
            style={{ backgroundColor: project.color }}
          />
          <h3 className="font-semibold text-white">{project.name}</h3>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => onEdit(project)}>Modifier</button>
          <button onClick={() => onDelete(project.id)}>Supprimer</button>
        </div>
      </div>
      <p className="text-gray-300 mt-2">{project.description}</p>
    </div>
  );
}`,
    type: 'component',
    tags: ['react', 'component', 'ui'],
    createdAt: new Date('2025-07-08'),
    updatedAt: new Date('2025-07-08')
  },
  {
    id: 'snippet-3',
    projectId: '2',
    title: 'Middleware d\'authentification JWT',
    description: 'Middleware Express pour vérifier les tokens JWT',
    language: 'javascript',
    code: `const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token d\\'accès requis' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;`,
    type: 'function',
    tags: ['node', 'express', 'jwt', 'middleware'],
    createdAt: new Date('2025-07-05'),
    updatedAt: new Date('2025-07-05')
  },
  {
    id: 'snippet-4',
    projectId: '3',
    title: 'Widget Flutter personnalisé',
    description: 'Widget Flutter pour afficher les statistiques de projet',
    language: 'dart',
    code: `import 'package:flutter/material.dart';

class ProjectStatsWidget extends StatelessWidget {
  final int totalNotes;
  final int totalSnippets;
  final int totalTasks;
  final int completedTasks;

  const ProjectStatsWidget({
    Key? key,
    required this.totalNotes,
    required this.totalSnippets,
    required this.totalTasks,
    required this.completedTasks,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            _buildStatRow('Notes', totalNotes, Icons.note),
            _buildStatRow('Snippets', totalSnippets, Icons.code),
            _buildStatRow('Tâches', completedTasks, Icons.check_circle),
          ],
        ),
      ),
    );
  }

  Widget _buildStatRow(String label, int value, IconData icon) {
    return Row(
      children: [
        Icon(icon),
        SizedBox(width: 8),
        Text(label),
        Spacer(),
        Text(value.toString()),
      ],
    );
  }
}`,
    type: 'component',
    tags: ['flutter', 'dart', 'widget'],
    createdAt: new Date('2025-06-18'),
    updatedAt: new Date('2025-06-18')
  },
  {
    id: 'snippet-5',
    projectId: '4',
    title: 'Configuration Docker Compose',
    description: 'Configuration Docker Compose pour l\'environnement de développement',
    language: 'yaml',
    code: `version: '3.8'

services:
  app:
    build: 
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongo:27017/ettu
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:`,
    type: 'template',
    tags: ['docker', 'compose', 'development'],
    createdAt: new Date('2025-05-08'),
    updatedAt: new Date('2025-05-08')
  }
];
