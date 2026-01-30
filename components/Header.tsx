
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <i className="fa-solid fa-user-astronaut text-white text-xl"></i>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
            ProHeadshot AI
          </span>
        </div>
        <nav className="hidden md:flex space-x-6 text-slate-600 font-medium">
          <a href="#" className="hover:text-blue-600 transition">How it Works</a>
          <a href="#" className="hover:text-blue-600 transition">Showcase</a>
          <a href="#" className="hover:text-blue-600 transition">Enterprise</a>
        </nav>
        <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-full font-medium transition-all">
          Get Started
        </button>
      </div>
    </header>
  );
};

export default Header;
