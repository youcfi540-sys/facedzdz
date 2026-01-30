
import React from 'react';
import { OutfitOption } from '../types';

interface Props {
  options: OutfitOption[];
  onSelect: (option: OutfitOption) => void;
  onBack: () => void;
}

const OutfitSelector: React.FC<Props> = ({ options, onSelect, onBack }) => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 flex items-center group transition">
          <i className="fa-solid fa-arrow-left mr-2 transform group-hover:-translate-x-1 transition"></i>
          Back
        </button>
        <h2 className="text-2xl font-bold text-slate-800 text-center">Choose Your Outfit</h2>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      <p className="text-center text-slate-600 mb-10 max-w-lg mx-auto">
        Select the professional style you'd like for your final portrait. 
        Each option is designed to look photorealistic and corporate.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((option) => (
          <div 
            key={option.id}
            onClick={() => onSelect(option)}
            className="group cursor-pointer border-2 border-slate-100 hover:border-blue-500 rounded-2xl p-6 transition-all hover:shadow-xl bg-slate-50 hover:bg-white text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-blue-100 group-hover:bg-blue-600 rounded-full flex items-center justify-center text-blue-600 group-hover:text-white transition-colors mb-4">
              <i className="fa-solid fa-user-tie text-3xl"></i>
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
              {option.label}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {option.description}
            </p>
            <div className="mt-6 py-2 px-6 bg-slate-200 group-hover:bg-blue-600 text-slate-600 group-hover:text-white rounded-full text-sm font-semibold transition-all">
              Apply Style
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-amber-50 rounded-xl border border-amber-100 flex items-start space-x-4">
        <i className="fa-solid fa-lightbulb text-amber-500 text-xl mt-1"></i>
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Pro Tip:</p>
          <p>The "Classic Blazer" is generally preferred for strict corporate environments, while the "Modern Professional" look works great for creative agencies and tech startups.</p>
        </div>
      </div>
    </div>
  );
};

export default OutfitSelector;
