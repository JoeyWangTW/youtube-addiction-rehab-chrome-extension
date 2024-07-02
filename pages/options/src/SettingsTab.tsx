import React, { useState, useEffect, useRef } from 'react';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { savedSettingsStorage } from '@chrome-extension-boilerplate/storage';

const SettingsTab = () => {
  const { openAIApiKey, blockerEnabled, videoEvalEnabled, filterEnabled, llmModel } =
    useStorageSuspense(savedSettingsStorage);
  const [apiKey, setApiKey] = useState<string>(openAIApiKey);
  const [blocker, setBlocker] = useState<boolean>(blockerEnabled);
  const [videoEval, setVideoEval] = useState<boolean>(videoEvalEnabled);
  const [filter, setFilter] = useState<boolean>(filterEnabled);
  const [model, setModel] = useState<string>(llmModel);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Ref to store the initial values for comparison
  const initialSettings = useRef({ openAIApiKey, blockerEnabled, videoEvalEnabled, filterEnabled, llmModel });

  useEffect(() => {
    // Update the ref when the component mounts
    initialSettings.current = { openAIApiKey, blockerEnabled, videoEvalEnabled, filterEnabled, llmModel };
  }, [openAIApiKey, blockerEnabled, videoEvalEnabled, filterEnabled, llmModel]);

  const saveSettings = async () => {
    await savedSettingsStorage.set({
      openAIApiKey: apiKey,
      blockerEnabled: blocker,
      videoEvalEnabled: videoEval,
      filterEnabled: filter,
      llmModel: model,
    });
    // Update initial settings after save
    initialSettings.current = {
      openAIApiKey: apiKey,
      blockerEnabled: blocker,
      videoEvalEnabled: videoEval,
      filterEnabled: filter,
      llmModel: model,
    };
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  // Function to determine if the current state differs from the initial state
  const hasChanges = () => {
    return (
      apiKey !== initialSettings.current.openAIApiKey ||
      blocker !== initialSettings.current.blockerEnabled ||
      videoEval !== initialSettings.current.videoEvalEnabled ||
      filter !== initialSettings.current.filterEnabled ||
      model !== initialSettings.current.llmModel
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="mb-4">
        <label htmlFor="api-key" className="block text-sm font-medium text-white">
          API Key
        </label>
        <input
          id="api-key"
          type="password"
          className="mt-1 p-2 block w-96 border-2 rounded-md border-gray-300 shadow-sm focus:border-gray-700 focus:outline-none"
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="model-select" className="block text-sm font-medium text-white">
          Choose a model:
        </label>
        <select
          id="model-select"
          name="model"
          className="mt-1 p-2 block w-96 border-2 rounded-md border-gray-300 shadow-sm focus:border-gray-700 focus:outline-none"
          onChange={e => {
            setModel(e.currentTarget.value);
          }}>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4o">GPT-4o</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="ai-filter" className="flex items-center space-x-2">
          <input
            id="ai-filter"
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
            checked={filter}
            onChange={() => {
              setFilter(!filter);
            }}
          />
          <span>Enable AI Filter</span>
        </label>
      </div>
      <div className="mb-4">
        <label htmlFor="ai-blocker" className="flex items-center space-x-2">
          <input
            id="ai-blocker"
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
            checked={blocker}
            onChange={() => {
              setBlocker(!blocker);
              if (!blocker) {
                setVideoEval(true);
              }
            }}
          />
          <span>Enable AI Blocker</span>
        </label>
      </div>

      <div className="mb-4">
        <label htmlFor="videoEval" className="flex items-center space-x-2">
          <input
            id="videoEval"
            type="checkbox"
            disabled={blocker}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
            checked={videoEval}
            onChange={() => setVideoEval(!videoEval)}
          />
          <span>Enable Video VideoEvaluation</span>
        </label>
      </div>
      {hasChanges() && (
        <button
          className="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={saveSettings}>
          Save Settings
        </button>
      )}
      {showSavedMessage && <div className="py-2 px-4 text-sm text-green-500">Saved!</div>}
    </div>
  );
};

export default withErrorBoundary(withSuspense(SettingsTab, <div>Loading...</div>), <div>Error Occurred</div>);
