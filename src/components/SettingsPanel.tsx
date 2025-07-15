/**
 * Composant de paramètres utilisateur avec stockage sécurisé
 *
 * @file SettingsPanel.tsx
 * @author BOSSIS--GUYON Jules
 * @date 2025-07-14
 */

import React, { useState } from "react";
import { Settings, Download, Upload, RotateCcw, Save, X } from "lucide-react";
import {
  useUserPreferences,
  type UserPreferences,
} from "../hooks/useUserPreferences";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "general" | "editor" | "security";

/**
 * Composant de panneau de paramètres
 *
 * Permet de configurer toutes les préférences utilisateur de manière sécurisée
 */
export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    preferences,
    updatePreference,
    resetPreferences,
    exportPreferences,
    importPreferences,
  } = useUserPreferences();

  const [activeTab, setActiveTab] = useState<TabType>("general");
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const success = await importPreferences(file);
    setIsImporting(false);

    if (success) {
      alert("Préférences importées avec succès !");
    } else {
      alert("Erreur lors de l'importation des préférences.");
    }

    // Reset input
    event.target.value = "";
  };

  const handleReset = () => {
    if (
      confirm("Êtes-vous sûr de vouloir réinitialiser toutes les préférences ?")
    ) {
      resetPreferences();
      alert("Préférences réinitialisées avec succès !");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Paramètres</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "general" as const, label: "Général" },
            { id: "editor" as const, label: "Éditeur" },
            { id: "security" as const, label: "Sécurité" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Onglet Général */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Paramètres généraux
              </h3>

              {/* Thème */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Thème
                </label>
                <select
                  value={preferences.theme}
                  onChange={(e) =>
                    updatePreference(
                      "theme",
                      e.target.value as UserPreferences["theme"]
                    )
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                  <option value="system">Système</option>
                </select>
              </div>

              {/* Langue */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Langue
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) =>
                    updatePreference(
                      "language",
                      e.target.value as UserPreferences["language"]
                    )
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                </select>
              </div>

              {/* Taille de police */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Taille de police
                </label>
                <select
                  value={preferences.fontSize}
                  onChange={(e) =>
                    updatePreference(
                      "fontSize",
                      e.target.value as UserPreferences["fontSize"]
                    )
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Petite</option>
                  <option value="medium">Moyenne</option>
                  <option value="large">Grande</option>
                </select>
              </div>

              {/* Options booléennes */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) =>
                      updatePreference("notifications", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Notifications</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) =>
                      updatePreference("soundEnabled", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Sons</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.compactMode}
                    onChange={(e) =>
                      updatePreference("compactMode", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Mode compact</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.developerMode}
                    onChange={(e) =>
                      updatePreference("developerMode", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Mode développeur</span>
                </label>
              </div>
            </div>
          )}

          {/* Onglet Éditeur */}
          {activeTab === "editor" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Paramètres d'éditeur
              </h3>

              {/* Auto-sauvegarde */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) =>
                      updatePreference("autoSave", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Auto-sauvegarde</span>
                </label>

                {preferences.autoSave && (
                  <div className="ml-7 space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                      Intervalle (secondes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={preferences.autoSaveInterval}
                      onChange={(e) =>
                        updatePreference(
                          "autoSaveInterval",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Options d'éditeur */}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.editorWordWrap}
                    onChange={(e) =>
                      updatePreference("editorWordWrap", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">
                    Retour à la ligne automatique
                  </span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.showLineNumbers}
                    onChange={(e) =>
                      updatePreference("showLineNumbers", e.target.checked)
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Numéros de ligne</span>
                </label>
              </div>

              {/* Taille de tabulation */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Taille de tabulation
                </label>
                <select
                  value={preferences.tabSize}
                  onChange={(e) =>
                    updatePreference("tabSize", parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={2}>2 espaces</option>
                  <option value={4}>4 espaces</option>
                  <option value={8}>8 espaces</option>
                </select>
              </div>
            </div>
          )}

          {/* Onglet Sécurité */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">
                Sécurité et données
              </h3>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">
                  Stockage sécurisé
                </h4>
                <p className="text-sm text-gray-400 mb-3">
                  Vos données sont chiffrées avec AES-256 et stockées localement
                  dans votre navigateur. Aucune information n'est transmise à
                  des serveurs externes.
                </p>
                <div className="text-xs text-gray-500">
                  <p>• Chiffrement AES-256</p>
                  <p>• Validation d'intégrité</p>
                  <p>• Compression des données</p>
                  <p>• Expiration automatique</p>
                </div>
              </div>

              <div className="bg-yellow-900 rounded-lg p-4">
                <h4 className="font-medium text-yellow-200 mb-2">
                  Information importante
                </h4>
                <p className="text-sm text-yellow-300">
                  La perte de vos données de navigateur (cache, localStorage)
                  entraînera la perte définitive de toutes vos notes et
                  préférences. Pensez à exporter régulièrement vos données.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={exportPreferences}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {isImporting ? "Importation..." : "Importer"}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              disabled={isImporting}
              className="hidden"
            />
          </label>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors ml-auto"
          >
            <Save className="w-4 h-4" />
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
