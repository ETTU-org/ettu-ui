import { useState, useEffect, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { secureLocalStorage } from '../../utils/secureLocalStorage';

// Fonctions de validation simplifiées
const validateContent = (content: string) => {
  const errors: string[] = [];
  
  if (content.length > 50000) {
    errors.push('Le contenu ne peut pas dépasser 50,000 caractères');
  }
  
  // Vérifier les scripts potentiellement dangereux
  if (content.includes('<script>') || content.includes('javascript:')) {
    errors.push('Le contenu ne peut pas contenir de scripts');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateFilename = (filename: string) => {
  const errors: string[] = [];
  
  if (!filename || filename.trim() === '') {
    errors.push('Le nom de fichier ne peut pas être vide');
  }
  
  if (filename.length > 255) {
    errors.push('Le nom de fichier ne peut pas dépasser 255 caractères');
  }
  
  // Caractères interdits
  const forbiddenChars = /[<>:"/\\|?*]/;
  if (forbiddenChars.test(filename)) {
    errors.push('Le nom de fichier contient des caractères interdits');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Fonction de log des événements de sécurité simplifiée
const logSecurityEvent = (event: string, data: Record<string, unknown>) => {
  console.log(`[Security Event] ${event}:`, data);
};

interface ProjectNoteEditorProps {
  projectId: string;
  projectName: string;
  onNotesCountChange?: (count: number) => void;
}

interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Composant d'édition de notes pour un projet spécifique
 */
export function ProjectNoteEditor({ projectId, projectName, onNotesCountChange }: ProjectNoteEditorProps) {
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('note-projet.md');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [contentValidationErrors, setContentValidationErrors] = useState<string[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [notes, setNotes] = useState<ProjectNote[]>([]);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  // Clé pour le stockage sécurisé spécifique au projet
  const storageKey = `project-notes-${projectId}`;

  // Charger les notes du projet au démarrage
  useEffect(() => {
    const loadProjectNotes = () => {
      try {
        const storedNotes = secureLocalStorage.getItem(storageKey);
        if (storedNotes) {
          const projectNotes = JSON.parse(storedNotes) as ProjectNote[];
          setNotes(projectNotes);
          
          // Charger la première note par défaut
          if (projectNotes.length > 0) {
            const firstNote = projectNotes[0];
            setCurrentNoteId(firstNote.id);
            setContent(firstNote.content);
            setFileName(firstNote.title);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des notes du projet:', error);
        logSecurityEvent('project_notes_load_error', {
          projectId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    };

    loadProjectNotes();
  }, [projectId, storageKey]);

  // Notifier le composant parent du nombre de notes
  useEffect(() => {
    if (onNotesCountChange) {
      onNotesCountChange(notes.length);
    }
  }, [notes.length, onNotesCountChange]);

  // Sauvegarder les notes du projet
  const saveProjectNotes = useCallback((updatedNotes: ProjectNote[]) => {
    try {
      secureLocalStorage.setItem(storageKey, JSON.stringify(updatedNotes));
      setNotes(updatedNotes);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notes du projet:', error);
      logSecurityEvent('project_notes_save_error', {
        projectId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [projectId, storageKey]);

  // Auto-sauvegarde
  useEffect(() => {
    if (!currentNoteId || !content.trim()) return;

    const timeoutId = setTimeout(() => {
      const updatedNotes = notes.map(note => 
        note.id === currentNoteId 
          ? { ...note, content, title: fileName, updatedAt: new Date() }
          : note
      );
      saveProjectNotes(updatedNotes);
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [content, fileName, currentNoteId, notes, saveProjectNotes]);

  // Validation du contenu
  useEffect(() => {
    const validation = validateContent(content);
    setContentValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      logSecurityEvent('project_note_content_validation_error', {
        projectId,
        noteId: currentNoteId,
        errors: validation.errors
      });
    }
  }, [content, currentNoteId, projectId]);

  // Créer une nouvelle note
  const createNewNote = () => {
    const newNote: ProjectNote = {
      id: Date.now().toString(),
      projectId,
      title: 'Nouvelle note.md',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedNotes = [...notes, newNote];
    saveProjectNotes(updatedNotes);
    setCurrentNoteId(newNote.id);
    setContent('');
    setFileName(newNote.title);
  };

  // Supprimer une note
  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveProjectNotes(updatedNotes);
    
    if (currentNoteId === noteId) {
      if (updatedNotes.length > 0) {
        const firstNote = updatedNotes[0];
        setCurrentNoteId(firstNote.id);
        setContent(firstNote.content);
        setFileName(firstNote.title);
      } else {
        setCurrentNoteId(null);
        setContent('');
        setFileName('note-projet.md');
      }
    }
  };

  // Sélectionner une note
  const selectNote = (note: ProjectNote) => {
    setCurrentNoteId(note.id);
    setContent(note.content);
    setFileName(note.title);
  };

  // Gérer le changement de contenu
  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  // Effacer le contenu
  const clearContent = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tout le contenu ?')) {
      setContent('');
      logSecurityEvent('project_note_content_cleared', {
        projectId,
        noteId: currentNoteId
      });
    }
  };

  // Insérer un template
  const insertTemplate = (template: string) => {
    setContent(prev => prev + '\n' + template);
  };

  // Télécharger la note
  const downloadNote = () => {
    if (!content.trim()) return;

    const validation = validateFilename(fileName);
    const finalFileName = validation.isValid ? fileName : 'note-projet.md';
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logSecurityEvent('project_note_downloaded', {
      projectId,
      noteId: currentNoteId,
      filename: finalFileName
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* En-tête avec gestion des notes */}
      <div className="flex-none p-4 border-b border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white mb-1">
              Notes du projet: {projectName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>
                Rédigez et organisez vos notes en Markdown
              </span>
              {lastSaved && (
                <span className="text-green-400">
                  • Sauvegardé à {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={createNewNote}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
            >
              ➕ Nouvelle note
            </button>
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-4 py-2 rounded text-sm transition-colors ${
                isPreviewMode 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              } text-white`}
            >
              {isPreviewMode ? '📝 Éditer' : '👁️ Prévisualiser'}
            </button>
          </div>
        </div>
      </div>

      {/* Liste des notes */}
      {notes.length > 0 && (
        <div className="flex-none p-4 border-b border-gray-700">
          <div className="flex flex-wrap gap-2">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => selectNote(note)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  currentNoteId === note.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {note.title}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNote(note.id);
                  }}
                  className="ml-2 text-red-400 hover:text-red-300"
                  title="Supprimer"
                >
                  ✕
                </button>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Barre d'outils */}
      {currentNoteId && (
        <div className="flex-none p-4 border-b border-gray-700">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => {
                    const newFileName = e.target.value;
                    setFileName(newFileName);
                    
                    const validation = validateFilename(newFileName);
                    setValidationErrors(validation.errors);
                    
                    if (!validation.isValid) {
                      logSecurityEvent('project_note_invalid_filename', {
                        projectId,
                        noteId: currentNoteId,
                        errors: validation.errors,
                        filename: newFileName
                      });
                    }
                  }}
                  className={`w-full md:w-auto px-3 py-1 border rounded text-sm focus:outline-none focus:ring-2 ${
                    validationErrors.length > 0 
                      ? 'border-red-500 bg-red-900 text-red-100 focus:ring-red-500' 
                      : 'border-gray-600 bg-gray-800 text-white focus:ring-blue-500'
                  }`}
                  placeholder="nom-de-la-note.md"
                />
                {validationErrors.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 p-2 bg-red-900 border border-red-700 rounded text-xs text-red-100 z-10 w-full md:w-64">
                    {validationErrors.map((error, index) => (
                      <div key={index}>• {error}</div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={downloadNote}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                disabled={!content.trim()}
              >
                💾 Télécharger
              </button>
            </div>
            
            {/* Templates */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => insertTemplate("# Titre\n\nContenu...")}
                className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
              >
                📄 Titre
              </button>
              <button
                onClick={() => insertTemplate("- [ ] Tâche à faire")}
                className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
              >
                ✅ Tâche
              </button>
              <button
                onClick={() => insertTemplate("```\ncode\n```")}
                className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
              >
                💻 Code
              </button>
              <button
                onClick={() => insertTemplate("[Texte du lien](https://exemple.com)")}
                className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
              >
                🔗 Lien
              </button>
              <button
                onClick={() => insertTemplate("| Colonne 1 | Colonne 2 |\n|-----------|-----------||\n| Données 1 | Données 2 |")}
                className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
              >
                📊 Tableau
              </button>
              <button
                onClick={() => insertTemplate("> Citation")}
                className="px-2 md:px-3 py-1 bg-gray-700 border border-gray-600 text-white rounded text-xs md:text-sm hover:bg-gray-600 transition-colors"
              >
                💬 Citation
              </button>
              <div className="flex-1"></div>
              <button
                onClick={clearContent}
                className="px-2 md:px-3 py-1 bg-red-900 text-red-100 border border-red-700 rounded text-xs md:text-sm hover:bg-red-800 transition-colors"
              >
                🗑️ Effacer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="flex-1 min-h-0">
        {currentNoteId ? (
          isPreviewMode ? (
            <PreviewView content={content} />
          ) : (
            <EditorView 
              content={content} 
              setContent={handleContentChange}
              contentValidationErrors={contentValidationErrors}
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="mb-4">Aucune note créée pour ce projet</p>
              <button
                onClick={createNewNote}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                ➕ Créer votre première note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Composant d'édition Markdown
 */
function EditorView({ 
  content, 
  setContent, 
  contentValidationErrors 
}: { 
  content: string;
  setContent: (content: string) => void;
  contentValidationErrors: string[];
}) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">
            Éditeur Markdown
          </h2>
          {contentValidationErrors.length > 0 && (
            <div className="flex items-center gap-1 text-red-400">
              <span className="text-sm">⚠️</span>
              <span className="text-xs">Erreurs détectées</span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <span>{content.length} caractères</span>
          <span>{content.split("\n").length} lignes</span>
          <span>
            {content.split(" ").filter((word) => word.length > 0).length} mots
          </span>
        </div>
      </div>
      
      {/* Affichage des erreurs de validation */}
      {contentValidationErrors.length > 0 && (
        <div className="mb-3 p-3 bg-red-900 border border-red-700 rounded text-sm text-red-100">
          <div className="font-semibold mb-1">⚠️ Erreurs de validation :</div>
          {contentValidationErrors.map((error, index) => (
            <div key={index} className="ml-2">• {error}</div>
          ))}
        </div>
      )}
      
      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
        <CodeMirror
          value={content}
          height="100%"
          extensions={[markdown()]}
          theme="dark"
          onChange={setContent}
          className="text-sm"
        />
      </div>
    </div>
  );
}

/**
 * Composant de prévisualisation Markdown
 */
function PreviewView({ content }: { content: string }) {
  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-white">
          Prévisualisation
        </h2>
        <span className="text-sm text-gray-400">Rendu en temps réel</span>
      </div>
      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
        <MarkdownPreview content={content} />
      </div>
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  // Configuration de marked pour un rendu sécurisé
  const renderer = new marked.Renderer();

  // Personnalisation du rendu des liens
  renderer.link = ({ href, title, tokens }) => {
    const text = tokens.map((token) => token.raw).join("");
    return `<a href="${href}" title="${
      title || ""
    }" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">${text}</a>`;
  };

  // Personnalisation du rendu des blocs de code
  renderer.code = ({ text, lang }) => {
    const validLanguage = lang || "text";
    return `<pre class="bg-gray-800 border border-gray-700 rounded-lg p-4 overflow-x-auto mb-4"><code class="language-${validLanguage} text-sm text-gray-100">${text}</code></pre>`;
  };

  // Configuration de marked
  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
  });

  const htmlContent = marked(content) as string;

  // Sanitiser le HTML avec DOMPurify
  const sanitizedHtml = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'code', 'pre', 'blockquote',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img',
      'div', 'span'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height',
      'class', 'id'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|ftp):)?\/\/[^\s/$.?#].[^\s]*$/i
  });

  return (
    <div className="p-4 overflow-y-auto h-full bg-gray-900 text-gray-100">
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
    </div>
  );
}
