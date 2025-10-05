
import React, { useState, useCallback } from 'react';
import type { DbSchema } from '../types';
import { checkQueryCoherence, interpretQueryResults } from '../services/geminiService';
import { LoadingSpinner, SparklesIcon, CheckCircleIcon } from './icons';

interface QueryPanelProps {
  schema: DbSchema | null;
}

export const QueryPanel: React.FC<QueryPanelProps> = ({ schema }) => {
  const [query, setQuery] = useState('SELECT\n    c.ville,\n    COUNT(DISTINCT c.id_client) AS nombre_clients,\n    SUM(cmd.montant_total) AS chiffre_affaires_total\nFROM\n    clients c\nJOIN\n    commandes cmd ON c.id_client = cmd.id_client\nGROUP BY\n    c.ville\nORDER BY\n    chiffre_affaires_total DESC\nLIMIT 10;');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<'interpretation' | 'coherence' | null>(null);

  const handleRequest = useCallback(async (analysisType: 'interpretation' | 'coherence') => {
    if (!query.trim() || !schema) {
      setError("Veuillez écrire une requête avant de demander une analyse.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiResponse(null);
    setActiveAnalysis(analysisType);

    try {
      const schemaString = JSON.stringify(schema, null, 2);
      let result;
      if (analysisType === 'interpretation') {
        result = await interpretQueryResults(query, schemaString);
      } else {
        result = await checkQueryCoherence(query, schemaString);
      }
      setAiResponse(result);
    } catch (err) {
      console.error(err);
      setError("L'IA n'a pas pu traiter votre requête. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [query, schema]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full animate-fade-in">
      {/* Left side: Query Editor */}
      <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Éditeur de Requête SQL</h3>
          <p className="text-sm text-slate-500">Écrivez votre requête ici pour l'analyser avec l'IA.</p>
        </div>
        <div className="flex-1 p-1">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-full p-3 font-mono text-sm border-0 rounded-md resize-none focus:ring-2 focus:ring-indigo-500"
            placeholder="SELECT * FROM clients..."
          />
        </div>
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleRequest('interpretation')}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
          >
            {isLoading && activeAnalysis === 'interpretation' ? <LoadingSpinner /> : <SparklesIcon className="h-5 w-5" />}
            Aide à l'interprétation
          </button>
          <button
            onClick={() => handleRequest('coherence')}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 bg-slate-600 text-white font-medium py-2 px-4 rounded-md hover:bg-slate-700 disabled:bg-slate-400 transition-colors"
          >
             {isLoading && activeAnalysis === 'coherence' ? <LoadingSpinner /> : <CheckCircleIcon className="h-5 w-5" />}
             Vérifier la cohérence
          </button>
        </div>
      </div>

      {/* Right side: AI Response */}
      <div className="flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Analyse de l'IA</h3>
          <p className="text-sm text-slate-500">Les retours de l'assistant IA apparaîtront ici.</p>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <LoadingSpinner />
              <p className="mt-2">L'IA analyse votre requête...</p>
            </div>
          )}
          {error && <p className="text-red-500">{error}</p>}
          {!isLoading && !aiResponse && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
                <SparklesIcon className="h-12 w-12 mb-2" />
                <p>Votre analyse apparaîtra ici.</p>
            </div>
          )}
          {aiResponse && <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br />') }} />}
        </div>
      </div>
    </div>
  );
};
