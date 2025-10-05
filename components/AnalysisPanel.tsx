
import React from 'react';
import type { AnalysisResult } from '../types';
import { LinkIcon, VariableIcon, LightBulbIcon } from './icons';

interface AnalysisPanelProps {
  analysis: AnalysisResult | null;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>L'analyse du schéma est en cours de chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <LightBulbIcon className="w-6 h-6 text-yellow-500" />
          Résumé de l'Analyse IA
        </h3>
        <p className="bg-white p-4 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
          {analysis.summary}
        </p>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <LinkIcon className="w-6 h-6 text-sky-500" />
          Relations entre les Tables
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.relationships.map((rel, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between text-sm font-mono mb-2">
                <span className="font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">{rel.fromTable}.{rel.fromColumn}</span>
                <span className="text-slate-400">&rarr;</span>
                <span className="font-semibold bg-green-100 text-green-800 px-2 py-1 rounded">{rel.toTable}.{rel.toColumn}</span>
              </div>
              <p className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-0.5 rounded-full mb-2">{rel.type}</p>
              <p className="text-slate-600 text-sm">{rel.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <VariableIcon className="w-6 h-6 text-purple-500" />
          Variables Clés à Explorer
        </h3>
        <ul className="space-y-3">
          {analysis.keyVariables.map((kv, index) => (
            <li key={index} className="bg-white p-4 rounded-lg border border-slate-200">
              <p className="font-semibold text-slate-700">
                <span className="font-mono bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">{kv.table}.{kv.column}</span>
              </p>
              <p className="text-slate-600 mt-2 text-sm">{kv.reason}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
