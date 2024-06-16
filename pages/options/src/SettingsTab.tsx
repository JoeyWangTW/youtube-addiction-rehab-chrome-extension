import React, { useState, useEffect, useRef } from 'react';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { savedSettingsStorage } from '@chrome-extension-boilerplate/storage';

const SettingsTab = () => {
  const { openAIApiKey, blockerEnabled } = useStorageSuspense(savedSettingsStorage);
  const [apiKey, setApiKey] = useState<string>(openAIApiKey);
  const [aiBlockerEnabled, setAiBlockerEnabled] = useState<boolean>(blockerEnabled);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Ref to store the initial values for comparison
  const initialSettings = useRef({ openAIApiKey, blockerEnabled });

  useEffect(() => {
    // Update the ref when the component mounts
    initialSettings.current = { openAIApiKey, blockerEnabled };
  }, [openAIApiKey, blockerEnabled]);

  const saveSettings = async () => {
    await savedSettingsStorage.set({ openAIApiKey: apiKey, blockerEnabled: aiBlockerEnabled });
    // Update initial settings after save
    initialSettings.current = { openAIApiKey: apiKey, blockerEnabled: aiBlockerEnabled };
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  // Function to determine if the current state differs from the initial state
  const hasChanges = () => {
    return (
      apiKey !== initialSettings.current.openAIApiKey || aiBlockerEnabled !== initialSettings.current.blockerEnabled
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="mb-4">
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
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
        <label htmlFor="ai-blocker" className="flex items-center space-x-2">
          <input
            id="ai-blocker"
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
            checked={aiBlockerEnabled}
            onChange={() => setAiBlockerEnabled(!aiBlockerEnabled)}
          />
          <span>Enable AI Blocker</span>
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
