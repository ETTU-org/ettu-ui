/**
 * Tests unitaires pour le module Snippets
 * 
 * Ce fichier contient des exemples de tests pour les principales
 * fonctionnalités du module Snippets.
 * 
 * Pour exécuter les tests :
 * ```bash
 * npm test -- --testPathPattern=snippets
 * ```
 */

import { SnippetUtils, SUPPORTED_LANGUAGES, LANGUAGE_CATEGORIES } from '../index';
import type { Snippet } from '../../../types/snippet';

// Données de test
const mockSnippet: Snippet = {
  id: '1',
  title: 'Test Snippet',
  language: 'javascript',
  code: 'console.log("Hello, World!");',
  description: 'Un snippet de test',
  tags: ['test', 'example'],
  project: 'Test Project',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

const mockSnippets: Snippet[] = [
  mockSnippet,
  {
    id: '2',
    title: 'Python Function',
    language: 'python',
    code: 'def hello():\n    print("Hello, Python!")',
    description: 'Une fonction Python',
    tags: ['python', 'function'],
    project: 'Python Project',
    createdAt: new Date('2025-01-02'),
    updatedAt: new Date('2025-01-02'),
  },
];

describe('SnippetUtils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = SnippetUtils.generateId();
      const id2 = SnippetUtils.generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('validateSnippet', () => {
    it('should validate correct snippet data', () => {
      const validData = {
        title: 'Test',
        language: 'javascript',
        code: 'console.log("test")',
        description: 'Test description',
        tags: ['test'],
        project: 'Test Project',
      };

      expect(SnippetUtils.validateSnippet(validData)).toBe(true);
    });

    it('should reject invalid snippet data', () => {
      const invalidData = {
        title: '',
        language: 'javascript',
        code: 'console.log("test")',
        // description manquante
        tags: ['test'],
        project: 'Test Project',
      };

      expect(SnippetUtils.validateSnippet(invalidData)).toBe(false);
    });

    it('should reject non-object data', () => {
      expect(SnippetUtils.validateSnippet(null)).toBe(false);
      expect(SnippetUtils.validateSnippet(undefined)).toBe(false);
      expect(SnippetUtils.validateSnippet('string')).toBe(false);
      expect(SnippetUtils.validateSnippet(123)).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-01-15');
      const formatted = SnippetUtils.formatDate(date);
      
      expect(formatted).toMatch(/\d{1,2} [a-zA-Z]{3,4} \d{4}/);
    });
  });

  describe('normalizeLanguage', () => {
    it('should normalize language names', () => {
      expect(SnippetUtils.normalizeLanguage('  JavaScript  ')).toBe('javascript');
      expect(SnippetUtils.normalizeLanguage('PYTHON')).toBe('python');
      expect(SnippetUtils.normalizeLanguage('TypeScript')).toBe('typescript');
    });
  });

  describe('filterSnippets', () => {
    it('should filter by search term', () => {
      const result = SnippetUtils.filterSnippets(
        mockSnippets,
        'javascript',
        '',
        ''
      );
      
      expect(result).toHaveLength(1);
      expect(result[0].language).toBe('javascript');
    });

    it('should filter by language', () => {
      const result = SnippetUtils.filterSnippets(
        mockSnippets,
        '',
        'python',
        ''
      );
      
      expect(result).toHaveLength(1);
      expect(result[0].language).toBe('python');
    });

    it('should filter by project', () => {
      const result = SnippetUtils.filterSnippets(
        mockSnippets,
        '',
        '',
        'Test Project'
      );
      
      expect(result).toHaveLength(1);
      expect(result[0].project).toBe('Test Project');
    });

    it('should combine multiple filters', () => {
      const result = SnippetUtils.filterSnippets(
        mockSnippets,
        'console',
        'javascript',
        'Test Project'
      );
      
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return empty array when no matches', () => {
      const result = SnippetUtils.filterSnippets(
        mockSnippets,
        'nonexistent',
        '',
        ''
      );
      
      expect(result).toHaveLength(0);
    });
  });
});

describe('Constants', () => {
  describe('SUPPORTED_LANGUAGES', () => {
    it('should contain expected languages', () => {
      expect(SUPPORTED_LANGUAGES).toContain('javascript');
      expect(SUPPORTED_LANGUAGES).toContain('python');
      expect(SUPPORTED_LANGUAGES).toContain('typescript');
      expect(SUPPORTED_LANGUAGES).toContain('html');
      expect(SUPPORTED_LANGUAGES).toContain('css');
    });

    it('should have correct number of languages', () => {
      expect(SUPPORTED_LANGUAGES).toHaveLength(43);
    });
  });

  describe('LANGUAGE_CATEGORIES', () => {
    it('should have expected categories', () => {
      const categories = Object.keys(LANGUAGE_CATEGORIES);
      
      expect(categories).toContain('Web Frontend');
      expect(categories).toContain('Backend & Systems');
      expect(categories).toContain('Scripting & Shell');
      expect(categories).toContain('Data & Analytics');
      expect(categories).toContain('DevOps & Config');
      expect(categories).toContain('Documentation');
    });

    it('should have languages in correct categories', () => {
      expect(LANGUAGE_CATEGORIES['Web Frontend']).toContain('javascript');
      expect(LANGUAGE_CATEGORIES['Backend & Systems']).toContain('python');
      expect(LANGUAGE_CATEGORIES['Documentation']).toContain('markdown');
    });
  });
});

/**
 * Tests d'intégration pour les composants
 * 
 * Ces tests nécessitent React Testing Library et Jest
 * pour être exécutés correctement.
 */

/*
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SnippetList from './SnippetList';
import SnippetEditor from './SnippetEditor';

describe('SnippetList Component', () => {
  const mockProps = {
    snippets: mockSnippets,
    selectedSnippet: null,
    onSelect: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders snippets correctly', () => {
    render(<SnippetList {...mockProps} />);
    
    expect(screen.getByText('Test Snippet')).toBeInTheDocument();
    expect(screen.getByText('Python Function')).toBeInTheDocument();
  });

  it('calls onSelect when snippet is clicked', async () => {
    const user = userEvent.setup();
    render(<SnippetList {...mockProps} />);
    
    await user.click(screen.getByText('Test Snippet'));
    
    expect(mockProps.onSelect).toHaveBeenCalledWith(mockSnippets[0]);
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<SnippetList {...mockProps} />);
    
    await user.click(screen.getByTitle('Modifier'));
    
    expect(mockProps.onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<SnippetList {...mockProps} />);
    
    await user.click(screen.getByTitle('Supprimer'));
    
    expect(mockProps.onDelete).toHaveBeenCalled();
  });

  it('copies code to clipboard when copy button is clicked', async () => {
    const user = userEvent.setup();
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });
    
    render(<SnippetList {...mockProps} />);
    
    await user.click(screen.getByTitle('Copier le code'));
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      mockSnippets[0].code
    );
  });
});

describe('SnippetEditor Component', () => {
  const mockProps = {
    snippet: null,
    onSave: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form correctly for new snippet', () => {
    render(<SnippetEditor {...mockProps} />);
    
    expect(screen.getByText('Nouveau snippet')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nom du snippet')).toBeInTheDocument();
    expect(screen.getByText('Créer')).toBeInTheDocument();
  });

  it('renders form correctly for editing snippet', () => {
    render(<SnippetEditor {...mockProps} snippet={mockSnippet} />);
    
    expect(screen.getByText('Modifier le snippet')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Snippet')).toBeInTheDocument();
    expect(screen.getByText('Modifier')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<SnippetEditor {...mockProps} />);
    
    // Essayer de sauvegarder sans remplir les champs
    await user.click(screen.getByText('Créer'));
    
    // Vérifier qu'onSave n'a pas été appelé
    expect(mockProps.onSave).not.toHaveBeenCalled();
  });

  it('calls onSave with correct data when form is submitted', async () => {
    const user = userEvent.setup();
    render(<SnippetEditor {...mockProps} />);
    
    // Remplir le formulaire
    await user.type(screen.getByPlaceholderText('Nom du snippet'), 'Test Title');
    await user.type(screen.getByPlaceholderText('Votre code ici...'), 'console.log("test")');
    await user.type(screen.getByPlaceholderText('Description du snippet'), 'Test description');
    
    // Soumettre
    await user.click(screen.getByText('Créer'));
    
    expect(mockProps.onSave).toHaveBeenCalledWith({
      title: 'Test Title',
      language: 'javascript',
      code: 'console.log("test")',
      description: 'Test description',
      tags: [],
      project: '',
    });
  });

  it('manages tags correctly', async () => {
    const user = userEvent.setup();
    render(<SnippetEditor {...mockProps} />);
    
    // Ajouter un tag
    await user.type(screen.getByPlaceholderText('Ajouter un tag'), 'test-tag');
    await user.click(screen.getByText('+'));
    
    expect(screen.getByText('#test-tag')).toBeInTheDocument();
    
    // Supprimer le tag
    await user.click(screen.getByText('×'));
    
    expect(screen.queryByText('#test-tag')).not.toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<SnippetEditor {...mockProps} />);
    
    await user.click(screen.getByText('Annuler'));
    
    expect(mockProps.onCancel).toHaveBeenCalled();
  });
});
*/

/**
 * Tests de performance
 */
describe('Performance Tests', () => {
  it('should filter large datasets efficiently', () => {
    // Générer un grand nombre de snippets
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i.toString(),
      title: `Snippet ${i}`,
      language: i % 2 === 0 ? 'javascript' : 'python',
      code: `console.log(${i})`,
      description: `Description ${i}`,
      tags: [`tag-${i}`],
      project: `Project ${i % 10}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const startTime = performance.now();
    
    const result = SnippetUtils.filterSnippets(
      largeDataset,
      'javascript',
      '',
      ''
    );
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    expect(result).toHaveLength(500); // 50% sont javascript
    expect(duration).toBeLessThan(100); // Moins de 100ms
  });
});

/**
 * Instructions pour exécuter les tests
 * 
 * 1. Installer les dépendances de test :
 *    npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
 * 
 * 2. Configurer Jest dans package.json :
 *    "scripts": {
 *      "test": "jest",
 *      "test:watch": "jest --watch",
 *      "test:coverage": "jest --coverage"
 *    }
 * 
 * 3. Exécuter les tests :
 *    npm test
 *    npm run test:watch
 *    npm run test:coverage
 */
