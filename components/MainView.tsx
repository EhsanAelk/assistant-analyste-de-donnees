
import React, { useState } from 'react';
import type { AnalysisResult, DbSchema } from '../types';
import { Sidebar } from './Sidebar';
import { AnalysisPanel } from './AnalysisPanel';
import { QuestionPanel } from './QuestionPanel';
import { QueryPanel } from './QueryPanel';
import { BrainIcon, ChartBarIcon, DocumentTextIcon, QuestionMarkCircleIcon, RefreshIcon } from './icons';

interface MainViewProps {
  dbName: string;
  schema: DbSchema | null;
  analysis: AnalysisResult | null;
  questions: string[] | null;
  onReset: () => void;
}

type Tab = 'analysis' | 'questions' | 'query';

export const MainView: React.FC<MainViewProps> = ({ dbName, schema, analysis, questions, onReset }) => {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analysis':
        return <AnalysisPanel analysis={analysis} />;
      case 'questions':
        return <QuestionPanel questions={questions} />;
      case 'query':
        return <QueryPanel schema={schema} />;
      default:
        return null;
    }
  };

  const TabButton = ({ tabId, icon, label }: { tabId: Tab, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabId
          ? 'bg-indigo-600 text-white'
          : 'text-slate-600 hover:bg-slate-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="flex h-screen">
      <Sidebar schema={schema} dbName={dbName} onReset={onReset} />
      <main className="flex-1 flex flex-col p-6 bg-slate-50 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-100 p-2 rounded-lg">
                <BrainIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Tableau de Bord de l'Analyste</h1>
          </div>
        </header>
        <div className="border-b border-slate-200 mb-6">
          <nav className="flex space-x-2" aria-label="Tabs">
            <TabButton tabId="analysis" icon={<DocumentTextIcon className="h-5 w-5" />} label="Analyse du Schéma" />
            <TabButton tabId="questions" icon={<QuestionMarkCircleIcon className="h-5 w-5" />} label="Questions Suggérées" />
            <TabButton tabId="query" icon={<ChartBarIcon className="h-5 w-5" />} label="Assistant Requête SQL" />
          </nav>
        </div>
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};
