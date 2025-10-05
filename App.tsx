
import React, { useState, useCallback } from 'react';
import { FileUploadScreen } from './components/FileUploadScreen';
import { MainView } from './components/MainView';
import { MOCK_SCHEMA, MOCK_DB_NAME } from './constants';
import type { AnalysisResult, DbSchema } from './types';
import { analyzeSchema, suggestQuestions } from './services/geminiService';
import { LoadingSpinner } from './components/icons';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dbSchema, setDbSchema] = useState<DbSchema | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (selectedFile: File) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setQuestions(null);
    
    // Simulate parsing file and getting schema
    // In a real app, you would parse the CSV/Excel/SQL file here.
    // For this demo, we use a predefined mock schema.
    setDbSchema(MOCK_SCHEMA);

    try {
      const schemaString = JSON.stringify(MOCK_SCHEMA, null, 2);
      
      const [analysisResult, questionsResult] = await Promise.all([
        analyzeSchema(schemaString),
        suggestQuestions(schemaString)
      ]);

      setAnalysis(analysisResult);
      setQuestions(questionsResult);

    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue lors de l'analyse avec l'IA. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleReset = () => {
    setFile(null);
    setDbSchema(null);
    setAnalysis(null);
    setQuestions(null);
    setError(null);
    setIsLoading(false);
  };

  if (!file) {
    return <FileUploadScreen onFileSelect={handleFileSelect} />;
  }
  
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex flex-col items-center justify-center z-50">
          <LoadingSpinner />
          <p className="text-white mt-4 text-lg">Analyse de votre base de données en cours...</p>
        </div>
      )}
       {error && (
        <div className="fixed top-5 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <strong className="font-bold">Erreur: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <MainView 
        dbName={file.name || MOCK_DB_NAME}
        schema={dbSchema}
        analysis={analysis}
        questions={questions}
        onReset={handleReset}
      />
    </div>
  );
};

export default App;
