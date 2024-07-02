import React, { useState, useEffect, useRef } from 'react';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { savedGoalsStorage } from '@chrome-extension-boilerplate/storage';

const GoalsTab = () => {
  const { helpful, harmful } = useStorageSuspense(savedGoalsStorage);
  const [helpfulVideos, setHelpfulVideos] = useState(helpful);
  const [harmfulVideos, setHarmfulVideos] = useState(harmful);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const initialGoals = useRef({ helpful, harmful });

  useEffect(() => {
    // Update the ref when the component mounts
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
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Goals</h1>
      <div className="mb-4">
        <label htmlFor="helpful-videos" className="block text-sm font-medium text-white">
          Watch Helpful Videos:
        </label>
        <textarea
          id="helpful-videos"
          className="mt-1 p-2 block w-96 border-2 rounded-md border-gray-300 shadow-sm resize-none
              focus:border-gray-700 focus:outline-none"
          value={helpfulVideos}
          onChange={e => setHelpfulVideos(e.target.value)}
          rows={5}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="harmful-videos" className="block text-sm font-medium text-white">
          Avoid Harmful Videos:
        </label>
        <textarea
          id="harmful-videos"
          className="mt-1 p-2 block w-96 border-2 rounded-md border-gray-300 shadow-sm resize-none
              focus:border-gray-700 focus:outline-none"
          value={harmfulVideos}
          onChange={e => setHarmfulVideos(e.target.value)}
          rows={5}
        />
      </div>
      {hasChanges() && (
        <button
          className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={saveGoals}>
          Save Goals
        </button>
      )}
      {showSavedMessage && <div className="mt-4 py-2 px-4 text-sm text-green-500">Saved!</div>}
    </div>
  );
};

export default withErrorBoundary(withSuspense(GoalsTab, <div>Loading...</div>), <div>Error Occurred</div>);
