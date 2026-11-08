import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#FDF9F0] p-8 gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1a1a1a] border-t-[#FF4D00] shadow-neo-sm" />
      <span className="font-syne font-black text-xs uppercase tracking-widest text-[#1a1a1a]">
        Loading Aptus AI...
      </span>
    </div>
  );
};

export default Loader;
