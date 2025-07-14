import React, { useState } from 'react';
import { 
  testSecureStorage, 
  cleanupTestData, 
  cleanupCorrupted, 
  runDiagnostic, 
  resetStorage,
  runDebugTests
} from '../utils/testSecureStorage_NEW';

const TestSecureStorage: React.FC = () => {
  const [testOutput, setTestOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const captureConsole = (callback: () => void) => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    
    let output = '';
    
    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalLog.apply(console, args);
    };
    
    console.warn = (...args) => {
      output += '⚠️ ' + args.join(' ') + '\n';
      originalWarn.apply(console, args);
    };
    
    console.error = (...args) => {
      output += '❌ ' + args.join(' ') + '\n';
      originalError.apply(console, args);
    };
    
    try {
      callback();
    } finally {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    }
    
    return output;
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestOutput('🔧 Démarrage des tests...\n');
    
    try {
      const output = captureConsole(() => {
        testSecureStorage();
      });
      
      setTestOutput(output);
    } catch (error) {
      setTestOutput(prev => prev + `\n❌ Erreur lors des tests: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const cleanup = () => {
    const output = captureConsole(() => {
      cleanupTestData();
    });
    setTestOutput(prev => prev + '\n' + output);
  };

  const cleanupCorruptedData = () => {
    const output = captureConsole(() => {
      cleanupCorrupted();
    });
    setTestOutput(prev => prev + '\n' + output);
  };

  const diagnose = () => {
    const output = captureConsole(() => {
      runDiagnostic();
    });
    setTestOutput(prev => prev + '\n' + output);
  };

  const runDebug = () => {
    const output = captureConsole(() => {
      runDebugTests();
    });
    setTestOutput(prev => prev + '\n' + output);
  };

  const resetAll = () => {
    if (window.confirm('⚠️ ATTENTION: Cela va supprimer TOUTES les données du localStorage. Continuer?')) {
      const output = captureConsole(() => {
        resetStorage();
      });
      setTestOutput(prev => prev + '\n' + output);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Test du Système SecureStorage</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button
          onClick={runTests}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors text-sm"
        >
          {isRunning ? '🔄 Tests...' : '🚀 Tests'}
        </button>
        
        <button
          onClick={diagnose}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
        >
          � Diagnostic
        </button>
        
        <button
          onClick={cleanupCorruptedData}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors text-sm"
        >
          🧹 Nettoyer
        </button>
        
        <button
          onClick={cleanup}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors text-sm"
        >
          🗑️ Tests
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={runDebug}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm"
        >
          🔧 Debug
        </button>
        
        <button
          onClick={resetAll}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
        >
          🚨 Reset complet
        </button>
        
        <button
          onClick={() => setTestOutput('')}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm"
        >
          🗑️ Effacer console
        </button>
      </div>

      <div className="bg-black rounded-lg p-4 font-mono text-sm overflow-auto max-h-96">
        <pre className="whitespace-pre-wrap">{testOutput || 'Aucun test exécuté'}</pre>
      </div>

      <div className="mt-6 text-sm text-gray-400">
        <p className="mb-2">
          <strong>Fonctionnalités disponibles :</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>🚀 Tests</strong> : Suite complète de tests du système</li>
          <li><strong>🔍 Diagnostic</strong> : Analyse l'état du localStorage</li>
          <li><strong>🧹 Nettoyer</strong> : Supprime les données corrompues</li>
          <li><strong>🗑️ Tests</strong> : Nettoie les données de test</li>
          <li><strong>🚨 Reset</strong> : Supprime TOUTES les données (destructif)</li>
        </ul>
      </div>
    </div>
  );
};

export default TestSecureStorage;
