
import React, { useRef, useState } from 'react';

interface Props {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<Props> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-2xl p-10 transition-all cursor-pointer ${
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        accept="image/*" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-700">Click or drag image to upload</p>
          <p className="text-sm text-slate-500 mt-1">PNG, JPG or JPEG (Max 10MB)</p>
        </div>
        <div className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition">
          Choose File
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-center space-x-4 text-xs text-slate-400">
        <span className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-1"></i> Front facing</span>
        <span className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-1"></i> Good lighting</span>
        <span className="flex items-center"><i className="fa-solid fa-check text-green-500 mr-1"></i> Neutral expression</span>
      </div>
    </div>
  );
};

export default ImageUploader;
