
import React from 'react';
import { AppState } from '../types';

interface Props {
  state: AppState;
}

const ProcessingOverlay: React.FC<Props> = ({ state }) => {
  const getMessage = () => {
    switch (state) {
      case AppState.UPLOADING: return "Uploading your photo...";
      case AppState.ANALYZING: return "Analyzing face features and detection...";
      case AppState.GENERATING_FINAL: return "Crafting your professional portrait. This might take a moment...";
      default: return "Processing...";
    }
  };

  const getSubMessage = () => {
    switch (state) {
      case AppState.GENERATING_FINAL: 
        return "Replacing background, adjusting lighting, and applying professional attire...";
      default: 
        return "Please don't close this window.";
    }
  };

  return (
    <div className="p-20 text-center">
      <div className="mb-8 relative inline-block">
        <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fa-solid fa-bolt-lightning text-blue-600 animate-pulse text-2xl"></i>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">{getMessage()}</h3>
      <p className="text-slate-500 animate-pulse">{getSubMessage()}</p>
      
      <div className="mt-12 max-w-sm mx-auto space-y-4">
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-progress-bar"></div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full ${state === AppState.GENERATING_FINAL ? 'bg-blue-600' : 'bg-blue-200'}`}></div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes progress-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress-bar {
          animation: progress-bar 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ProcessingOverlay;
