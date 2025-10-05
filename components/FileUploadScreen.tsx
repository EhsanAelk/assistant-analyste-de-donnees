
import React, { useCallback, useState } from 'react';
import { UploadIcon, BrainIcon } from './icons';

interface FileUploadScreenProps {
  onFileSelect: (file: File) => void;
}

export const FileUploadScreen: React.FC<FileUploadScreenProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
            <BrainIcon className="h-12 w-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-slate-800">Assistant Analyste IA</h1>
        </div>
        <p className="text-slate-600 text-lg mb-8">
          Importez votre base de données (Excel, CSV, SQL...) pour commencer à penser comme un analyste de données.
        </p>
        
        <div 
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-12 transition-colors duration-200 ease-in-out ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-slate-400'}`}
        >
          <input 
            type="file" 
            id="file-upload" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept=".csv, .xlsx, .sql, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
            <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full">
              <UploadIcon className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-slate-700 font-semibold">
              <span className="text-indigo-600">Cliquez pour importer</span> ou glissez-déposez
            </p>
            <p className="text-xs text-slate-500">CSV, XLSX, ou SQL (200MB max)</p>
          </label>
        </div>
      </div>
    </div>
  );
};
