/**
 * Page d'administration du stockage sécurisé
 * 
 * @file AdminStoragePage.tsx
 * @author BOSSIS--GUYON Jules
 * @date 2025-07-14
 */

import { useState, useEffect } from 'react';
import { 
  Database, 
  Shield, 
  Trash2, 
  Download, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import Layout from '../layouts/Layout';
import { secureLocalStorage } from '../utils/secureLocalStorage';
import { MigrationUtils } from '../utils/migrationUtils';

interface MigrationResult {
  migrated: number;
  skipped: number;
  errors: number;
  errorDetails: Array<{ key: string; error: string }>;
  migratedItems: Array<{ oldKey: string; newKey: string }>;
}

export default function AdminStoragePage() {
  const [stats, setStats] = useState({
    totalItems: 0,
    totalSize: 0,
    expiredItems: 0,
    oldestItem: null as number | null,
  });
  const [keys, setKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);

  const loadStats = () => {
    setIsLoading(true);
    try {
      const currentStats = secureLocalStorage.getStats();
      const currentKeys = secureLocalStorage.getAllKeys();
      
      setStats(currentStats);
      setKeys(currentKeys);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer les données expirées ?')) {
      const cleaned = secureLocalStorage.cleanup();
      loadStats();
      alert(`${cleaned} éléments expirés supprimés.`);
    }
  };

  const handleClearAll = () => {
    if (confirm('⚠️ ATTENTION: Cela supprimera TOUTES les données stockées de manière sécurisée. Continuer ?')) {
      if (confirm('Dernière confirmation: Toutes vos notes, snippets et préférences seront perdus !')) {
        secureLocalStorage.clear();
        loadStats();
        alert('Toutes les données ont été supprimées.');
      }
    }
  };

  const handleMigration = () => {
    if (confirm('Lancer la migration automatique des données localStorage vers secureStorage ?')) {
      const result = MigrationUtils.performFullMigration(true);
      setMigrationResult(result);
      loadStats();
    }
  };

  const handleExportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      stats: stats,
      keys: keys,
      data: {} as Record<string, string>
    };

    // Exporter toutes les données
    keys.forEach(key => {
      const value = secureLocalStorage.getItem(key);
      if (value) {
        data.data[key] = value;
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ettu-secure-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-gray-800 rounded-lg p-8 text-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Administration du stockage sécurisé</h1>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold">Éléments stockés</h3>
              </div>
              <p className="text-2xl font-bold text-blue-400">{stats.totalItems}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold">Taille totale</h3>
              </div>
              <p className="text-2xl font-bold text-green-400">
                {(stats.totalSize / 1024).toFixed(2)} KB
              </p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold">Éléments expirés</h3>
              </div>
              <p className="text-2xl font-bold text-yellow-400">{stats.expiredItems}</p>
            </div>

            <div className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold">Plus ancien</h3>
              </div>
              <p className="text-sm text-purple-400">
                {stats.oldestItem 
                  ? new Date(stats.oldestItem).toLocaleDateString()
                  : 'Aucun'
                }
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Actions de maintenance */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Maintenance
              </h3>
              <div className="space-y-3">
                <button
                  onClick={loadStats}
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Chargement...' : 'Actualiser les statistiques'}
                </button>
                
                <button
                  onClick={handleCleanup}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Nettoyer les données expirées
                </button>
                
                <button
                  onClick={handleExportData}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Exporter toutes les données
                </button>
              </div>
            </div>

            {/* Actions de migration */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Migration
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleMigration}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Migrer depuis localStorage
                </button>
                
                <button
                  onClick={handleClearAll}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer toutes les données
                </button>
              </div>
            </div>
          </div>

          {/* Résultat de la migration */}
          {migrationResult && (
            <div className="bg-gray-700 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Résultat de la migration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-green-900 rounded p-3">
                  <p className="font-medium text-green-200">Migrés</p>
                  <p className="text-2xl font-bold text-green-400">{migrationResult.migrated}</p>
                </div>
                <div className="bg-yellow-900 rounded p-3">
                  <p className="font-medium text-yellow-200">Ignorés</p>
                  <p className="text-2xl font-bold text-yellow-400">{migrationResult.skipped}</p>
                </div>
                <div className="bg-red-900 rounded p-3">
                  <p className="font-medium text-red-200">Erreurs</p>
                  <p className="text-2xl font-bold text-red-400">{migrationResult.errors}</p>
                </div>
              </div>
              {migrationResult.errorDetails.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-red-400 mb-2">Erreurs détaillées:</h4>
                  <ul className="text-sm space-y-1">
                    {migrationResult.errorDetails.map((error, index: number) => (
                      <li key={index} className="text-red-300">
                        {error.key}: {error.error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Liste des clés */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Clés stockées ({keys.length})</h3>
            {keys.length === 0 ? (
              <p className="text-gray-400">Aucune donnée stockée</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {keys.map((key, index) => (
                  <div key={index} className="bg-gray-600 rounded px-3 py-2 text-sm">
                    <code className="text-blue-300">{key}</code>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Informations de sécurité */}
          <div className="bg-blue-900 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-200">
              <Shield className="w-5 h-5" />
              Informations de sécurité
            </h3>
            <div className="text-sm text-blue-200 space-y-2">
              <p>• Chiffrement AES-256 avec clés dérivées PBKDF2</p>
              <p>• Validation d'intégrité avec checksum MD5</p>
              <p>• Compression automatique des données</p>
              <p>• Expiration automatique configurable</p>
              <p>• Validation et sanitisation des entrées</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
