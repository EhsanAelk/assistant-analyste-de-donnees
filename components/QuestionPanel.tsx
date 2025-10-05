
import React from 'react';
import { QuestionMarkCircleIcon, LightBulbIcon } from './icons';

interface QuestionPanelProps {
  questions: string[] | null;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({ questions }) => {
  if (!questions) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <p>Les suggestions de questions sont en cours de chargement...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start gap-4 bg-indigo-50 border border-indigo-200 p-4 rounded-lg mb-8">
        <LightBulbIcon className="w-8 h-8 text-indigo-500 flex-shrink-0 mt-1" />
        <div>
            <h3 className="text-lg font-semibold text-indigo-800">Penser comme un analyste</h3>
            <p className="text-indigo-700 text-sm">Utilisez ces questions comme point de départ pour votre exploration. Elles sont conçues pour vous aider à découvrir des insights cachés dans vos données.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {questions.map((q, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-4 transition-transform hover:scale-[1.02] hover:shadow-sm">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <QuestionMarkCircleIcon className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-slate-700 font-medium pt-1">{q}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
