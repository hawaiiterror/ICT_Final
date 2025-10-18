
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 text-center p-4">
      <div className="w-16 h-16 border-4 border-t-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
      <h2 className="text-xl font-semibold text-slate-700">{message}</h2>
      <p className="text-slate-500 mt-2">잠시만 기다려주세요...</p>
    </div>
  );
};

export default Loader;
