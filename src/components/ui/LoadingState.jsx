import React from 'react';

export const LoadingState = ({ message = 'Loading civic records...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-[#DDE1E7] bg-white">
      <div className="w-8 h-8 border-3 border-[#DDE1E7] border-t-[#14213D] rounded-full animate-spin mb-4" />
      <p className="text-base font-medium font-sans text-[#14213D]">{message}</p>
    </div>
  );
};
