
import React from 'react';
import type { DbSchema } from '../types';
import { TableIcon, DatabaseIcon, UploadIcon, RefreshIcon } from './icons';

interface SidebarProps {
  dbName: string;
  schema: DbSchema | null;
  onReset: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ dbName, schema, onReset }) => {
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <DatabaseIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-800 truncate" title={dbName}>{dbName}</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Tables</h3>
        {schema?.tables.map((table) => (
          <div key={table.name}>
            <div className="flex items-center gap-2 text-slate-700 mb-2">
              <TableIcon className="h-4 w-4" />
              <span className="font-medium">{table.name}</span>
            </div>
            <ul className="pl-6 text-sm space-y-1 text-slate-500">
              {table.columns.map((column) => (
                <li key={column.name} className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{column.type}</span>
                  <span>{column.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-md transition-colors"
        >
          <UploadIcon className="h-5 w-5" />
          <span>Changer de fichier</span>
        </button>
      </div>
    </aside>
  );
};
