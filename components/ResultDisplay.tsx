
import React, { useState } from 'react';

interface Props {
  original: string;
  processed: string;
  onReset: () => void;
}

const ResultDisplay: React.FC<Props> = ({ original, processed, onReset }) => {
  const [showOriginal, setShowOriginal] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processed;
    link.download = 'professional_headshot_proheadshot_ai.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Your Portrait is Ready!</h2>
        <p className="text-slate-500">Enhanced, straightened, and professionally dressed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-200 aspect-[4/5] flex items-center justify-center border-4 border-white">
            <img 
              src={showOriginal ? original : processed} 
              alt="Result" 
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
              {showOriginal ? 'Before' : 'After'}
            </div>
            
            <button 
              onMouseDown={() => setShowOriginal(true)}
              onMouseUp={() => setShowOriginal(false)}
              onMouseLeave={() => setShowOriginal(false)}
              onTouchStart={() => setShowOriginal(true)}
              onTouchEnd={() => setShowOriginal(false)}
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur text-slate-800 px-6 py-2.5 rounded-full shadow-lg font-semibold flex items-center space-x-2 active:scale-95 transition"
            >
              <i className="fa-solid fa-eye"></i>
              <span>Hold to compare</span>
            </button>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <i className="fa-solid fa-wand-sparkles text-blue-600 mr-2"></i>
              What we did:
            </h3>
            <ul className="space-y-3">
              {[
                "Corrected head posture & alignment",
                "Replaced background with studio lighting",
                "Applied professional corporate attire",
                "Enhanced facial clarity & resolution",
                "Optimized lighting for business profile"
              ].map((text, i) => (
                <li key={i} className="flex items-center text-sm text-slate-600">
                  <i className="fa-solid fa-circle-check text-green-500 mr-2"></i>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col space-y-4">
            <button 
              onClick={handleDownload}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center space-x-3 text-lg"
            >
              <i className="fa-solid fa-download"></i>
              <span>Download Portrait</span>
            </button>
            <button 
              onClick={onReset}
              className="w-full bg-white hover:bg-slate-50 text-slate-600 font-semibold py-4 px-8 rounded-2xl border border-slate-200 transition-all flex items-center justify-center space-x-3"
            >
              <i className="fa-solid fa-rotate-right"></i>
              <span>Start Over</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium pt-4">
            <span className="flex items-center"><i className="fa-solid fa-shield-halved mr-1"></i> Private & Secure</span>
            <span className="flex items-center"><i className="fa-solid fa-image mr-1"></i> High Definition (2K)</span>
            <span className="flex items-center"><i className="fa-solid fa-bolt mr-1"></i> Fast Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
