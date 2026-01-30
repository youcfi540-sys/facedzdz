
import React, { useState, useCallback } from 'react';
import { AppState, Gender, OutfitOption } from './types';
import { analyzeFace, generatePortrait } from './services/geminiService';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ProcessingOverlay from './components/ProcessingOverlay';
import OutfitSelector from './components/OutfitSelector';
import ResultDisplay from './components/ResultDisplay';

const FEMALE_OUTFITS: OutfitOption[] = [
  { id: 'opt1', label: 'Classic Blazer', description: 'Dark blazer with a crisp light blouse' },
  { id: 'opt2', label: 'Modern Professional', description: 'Light grey blazer with a neutral top' },
  { id: 'opt3', label: 'Business Dress', description: 'Elegant business dress with modest sleeves' },
];

const MALE_OUTFIT_PROMPT = "Automatically dress him in a formal business suit: classic navy suit jacket, white dress shirt, and a professional tie.";

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>(Gender.UNKNOWN);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [previewOutfits, setPreviewOutfits] = useState<(string | null)[]>([]);

  const handleUpload = async (file: File) => {
    setState(AppState.UPLOADING);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setOriginalImage(base64);
      
      try {
        setState(AppState.ANALYZING);
        const analysis = await analyzeFace(base64);
        
        if (!analysis.isClear) {
          setErrorMessage(analysis.message || "Face not clear enough. Please upload a clearer photo.");
          setState(AppState.ERROR);
          return;
        }

        setGender(analysis.gender);

        if (analysis.gender === Gender.MALE) {
          setState(AppState.GENERATING_FINAL);
          const result = await generatePortrait(base64, Gender.MALE, MALE_OUTFIT_PROMPT);
          setFinalImage(result);
          setState(AppState.COMPLETED);
        } else {
          // For women, generate the first preview or just show labels to select
          // To provide a better experience, we go straight to selection
          setState(AppState.SELECTING_OUTFIT);
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("An error occurred during analysis. Please try again.");
        setState(AppState.ERROR);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOutfitSelect = async (outfit: OutfitOption) => {
    if (!originalImage) return;
    setState(AppState.GENERATING_FINAL);
    try {
      const prompt = `Dress her in a professional business outfit: ${outfit.description}. It should look natural and elegant.`;
      const result = await generatePortrait(originalImage, Gender.FEMALE, prompt);
      setFinalImage(result);
      setState(AppState.COMPLETED);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to generate the portrait with the selected outfit.");
      setState(AppState.ERROR);
    }
  };

  const reset = () => {
    setState(AppState.IDLE);
    setOriginalImage(null);
    setGender(Gender.UNKNOWN);
    setErrorMessage(null);
    setFinalImage(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          {state === AppState.IDLE && (
            <div className="p-8 text-center">
              <div className="mb-6">
                <i className="fa-solid fa-user-tie text-blue-600 text-6xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Create Your Professional Portrait</h2>
              <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                Upload a casual selfie and our AI will transform it into a professional headshot perfect for your CV, LinkedIn, or profile.
              </p>
              <ImageUploader onUpload={handleUpload} />
              
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
                  <i className="fa-solid fa-wand-magic-sparkles text-blue-600 text-2xl mb-2"></i>
                  <h3 className="font-semibold text-slate-800">AI Enhancement</h3>
                  <p className="text-sm text-slate-500 text-center">Auto-adjust lighting, clarity, and resolution.</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                  <i className="fa-solid fa-shirt text-green-600 text-2xl mb-2"></i>
                  <h3 className="font-semibold text-slate-800">Wardrobe Swap</h3>
                  <p className="text-sm text-slate-500 text-center">Professional business attire applied instantly.</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl">
                  <i className="fa-solid fa-image text-purple-600 text-2xl mb-2"></i>
                  <h3 className="font-semibold text-slate-800">Studio Look</h3>
                  <p className="text-sm text-slate-500 text-center">Clean studio background for a premium feel.</p>
                </div>
              </div>
            </div>
          )}

          {(state === AppState.UPLOADING || state === AppState.ANALYZING || state === AppState.GENERATING_FINAL) && (
            <ProcessingOverlay state={state} />
          )}

          {state === AppState.SELECTING_OUTFIT && (
            <OutfitSelector 
              options={FEMALE_OUTFITS} 
              onSelect={handleOutfitSelect} 
              onBack={reset}
            />
          )}

          {state === AppState.COMPLETED && finalImage && (
            <ResultDisplay 
              original={originalImage!} 
              processed={finalImage} 
              onReset={reset} 
            />
          )}

          {state === AppState.ERROR && (
            <div className="p-12 text-center">
              <div className="text-red-500 text-6xl mb-4">
                <i className="fa-solid fa-circle-exclamation"></i>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Processing Error</h3>
              <p className="text-slate-600 mb-8">{errorMessage}</p>
              <button 
                onClick={reset}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>&copy; 2024 ProHeadshot AI. All rights reserved.</p>
        <p className="mt-1">Powered by Gemini 2.5 Flash Image & Gemini 3</p>
      </footer>
    </div>
  );
};

export default App;
