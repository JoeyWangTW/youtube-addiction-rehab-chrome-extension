import '@src/Popup.css';
import React, { useState, useEffect, useRef } from 'react';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { savedGoalsStorage, savedSettingsStorage } from '@chrome-extension-boilerplate/storage';

const GoalsEditor = ({ disabled }: { disabled: boolean }) => {
  const { helpful, harmful } = useStorageSuspense(savedGoalsStorage);
  const [helpfulVideos, setHelpfulVideos] = useState(helpful);
  const [harmfulVideos, setHarmfulVideos] = useState(harmful);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const initialGoals = useRef({ helpful, harmful });

  useEffect(() => {
    initialGoals.current = { helpful, harmful };
  }, [helpful, harmful]);

  const saveGoals = async () => {
    await savedGoalsStorage.set({ helpful: helpfulVideos, harmful: harmfulVideos });
    initialGoals.current = { helpful: helpfulVideos, harmful: harmfulVideos };
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const hasChanges = () => {
    return helpfulVideos !== initialGoals.current.helpful || harmfulVideos !== initialGoals.current.harmful;
  };

  return (
    <div className="p-4 bg-gray-900 text-white">
      <div className="mb-4">
        <label htmlFor="helpful-videos" className="block text-sm font-medium text-gray-300">
          Helpful Videos to Watch:
        </label>
        <textarea
          id="helpful-videos"
          className={`mt-1 p-2 block w-full border-2 rounded-md border-gray-700 bg-gray-800 shadow-sm resize-none focus:border-gray-500 focus:outline-none ${disabled ? 'text-gray-500' : 'text-white'}`}
          value={helpfulVideos}
          onChange={e => setHelpfulVideos(e.target.value)}
          rows={5}
          disabled={disabled}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="harmful-videos" className="block text-sm font-medium text-gray-300">
          Harmful Videos to Avoid:
        </label>
        <textarea
          id="harmful-videos"
          className={`mt-1 p-2 block w-full border-2 rounded-md border-gray-700 bg-gray-800 shadow-sm resize-none focus:border-gray-500 focus:outline-none ${disabled ? 'text-gray-500' : 'text-white'}`}
          value={harmfulVideos}
          onChange={e => setHarmfulVideos(e.target.value)}
          rows={5}
          disabled={disabled}
        />
      </div>
      {hasChanges() && (
        <button
          className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={saveGoals}
          disabled={disabled}>
          Save Changes
        </button>
      )}
      {showSavedMessage && <div className="mt-4 py-2 px-4 text-sm text-green-500">Changes Saved!</div>}
    </div>
  );
};

const Popup = () => {
  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  const { openAIApiKey, apiErrorStatus } = useStorageSuspense(savedSettingsStorage);

  return (
    <div>
      <GoalsEditor disabled={!openAIApiKey} />
      <div className="flex flex-row items-center bg-gray-900 border-t border-gray-500">
        <button
          onClick={openOptionsPage}
          className="block text-gray-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Settings
        </button>
        {!openAIApiKey && (
          <div >⬅️</div>
        )}
        {!openAIApiKey && (
          <span className="text-red-500 text-sm ml-2 my-2">Please set up your API key in the settings.</span>
        )}
      </div>
      {apiErrorStatus.type && (
        <div className="bg-red-500 text-white p-2 text-sm">
          {apiErrorStatus.type === 'AUTH' ? 'Authentication error. Please check your API key.' : 'Rate limit exceeded. Please try again later or upgrade your plan.'}
        </div>
      )}
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
