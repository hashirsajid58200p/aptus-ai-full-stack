import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { generateNewToken, loadUser, clearState } from '@/slices/userSlice';
import toast from 'react-hot-toast';

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

  return (
    <div className="bg-white border-3 border-[#1a1a1a] shadow-neo-lg p-6 sm:p-8">
      <div className="flex items-center gap-3 border-b-2 border-[#1a1a1a] pb-4 mb-4">
        <span className="bg-[#BFF000] border-2 border-[#1a1a1a] px-3 py-1 font-extrabold text-xs uppercase tracking-wider">
          API Key
        </span>
        <h3 className="font-syne text-2xl font-extrabold text-[#1a1a1a] uppercase">
          Aptus AI Chatbot Token
        </h3>
      </div>
      <p className="mb-4 text-[#1a1a1a] font-semibold text-sm">
        Use this unique token to integrate the Aptus AI chatbot widget into your website:
      </p>
      <input
        value={user?.chatbot_token || ''}
        readOnly
        className="w-full bg-[#FDF9F0] border-2 border-[#1a1a1a] font-mono text-sm py-3 px-4 text-[#1a1a1a] mb-4 font-bold shadow-neo-sm focus:outline-none"
      />
      <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-6">
        ⚠️ Keep this token secret. Do not share it publicly.
      </p>
      <button
        className="btn-neo-primary px-6 py-3 text-sm font-extrabold"
        onClick={handleGenerateNewToken}
      >
        RESET TOKEN
      </button>
    </div>
  );
};

export default Token;
