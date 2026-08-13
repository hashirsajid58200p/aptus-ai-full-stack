import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generateNewToken, loadUser, clearState } from '@/slices/userSlice';
import toast from 'react-hot-toast';
import { Copy, ShieldAlert } from 'lucide-react';

const Token = () => {
  const dispatch = useDispatch();
  const { isTokenGenerated, user, error } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    if (isTokenGenerated) {
      dispatch(clearState());
      dispatch(loadUser());
      toast.success('New Token Generated Successfully');
    }
    if (error) {
      toast.error(error);
      dispatch(clearState());
    }
  }, [error, dispatch, isTokenGenerated]);

  const handleGenerateNewToken = () => {
    if (window.confirm("Are you sure you want to Generate new token?")) {
      dispatch(generateNewToken(user));
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(user?.chatbot_token || '');
    toast.success("Token copied to clipboard");
  };

  return (
    <div className="bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 border-b-2 border-[#1a1a1a] pb-4 mb-4">
        <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-2.5 sm:px-3 py-0.5 sm:py-1 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider">
          API Key
        </span>
        <h3 className="font-syne text-lg sm:text-2xl font-extrabold text-[#1a1a1a] uppercase leading-tight">
          Aptus AI Chatbot Token
        </h3>
      </div>
      <p className="mb-4 text-[#1a1a1a] font-semibold text-xs sm:text-sm">
        Use this unique token to integrate the Aptus AI chatbot widget into your website:
      </p>
      <div className="relative mb-4">
        <input
          value={user?.chatbot_token || ''}
          readOnly
          className="w-full bg-[#FDF9F0] border-2 border-[#1a1a1a] font-mono text-xs sm:text-sm py-2.5 sm:py-3 pl-3 sm:pl-4 pr-14 sm:pr-16 text-[#1a1a1a] font-bold shadow-neo-sm focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCopyToken}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-[#BFF000] border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#a6d000] transition-colors shadow-neo-sm flex items-center justify-center"
          title="Copy to clipboard"
        >
          <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
      <p className="text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wide mb-4 sm:mb-6 flex items-start sm:items-center gap-1.5">
        <ShieldAlert className="w-4 h-4 text-[#FF4D00] shrink-0" />
        <span>Keep this token secret. Do not share it publicly.</span>
      </p>
      <button
        className="btn-neo-primary px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-extrabold"
        onClick={handleGenerateNewToken}
      >
        RESET TOKEN
      </button>
    </div>
  );
};

export default Token;
