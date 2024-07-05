import React, { useState, useEffect, useRef } from 'react';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { savedSettingsStorage } from '@chrome-extension-boilerplate/storage';

// TODO: import type from stroage file
type UserSettings = {
  openAIApiKey: string;
  anthropicApiKey: string;
  blockerEnabled: boolean;
  videoEvalEnabled: boolean;
  filterEnabled: boolean;
  hideShortsEnabled: boolean;
  llmModel: string;
  aiProvider: 'openai' | 'anthropic';
};

const SettingsTab = () => {
  const initialSettings = useStorageSuspense(savedSettingsStorage);
  const [settings, setSettings] = useState(initialSettings);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  useEffect(() => {
    // Update the state when the component mounts
    setSettings(initialSettings);
  }, [initialSettings]);

  const saveSettings = async () => {
    await savedSettingsStorage.set(settings);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const hasChanges = () => {
    return Object.keys(settings).some(key => settings[key as keyof UserSettings] !== initialSettings[key as keyof UserSettings]);
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <h2 className="text-2xl font-bold mb-4">AI Settings</h2>
      <div className="mb-4">
        <label htmlFor="api-key" className="block text-sm font-medium text-white">
          OpenAI API Key
        </label>
        <input
          id="oepn-api-key"
          type="password"
          className="mt-1 p-2 block w-96 text-black border-2 rounded-md border-gray-300 shadow-sm focus:border-gray-700 focus:outline-none"
          value={settings.openAIApiKey}
          onChange={e => handleChange('openAIApiKey', e.target.value)}
        />
        <div className='text-gray-500'>API keys will only be stored on your device.</div>
      </div>

      <div className='mb-4'>
        <label htmlFor="anthropic-api-key" className="block text-sm font-medium text-white">
          Anthropic API Key
        </label>
        <input
          id="anthropic-api-key"
          type="password"
          className="mt-1 p-2 block w-96 text-black border-2 rounded-md border-gray-300 shadow-sm focus:border-gray-700 focus:outline-none"
          value={settings.anthropicApiKey}
          onChange={e => handleChange('anthropicApiKey', e.target.value)}
        />
        <div className='text-gray-500'>API keys will only be stored on your device.</div>
      </div>

      <div className='mb-4'>
        <label htmlFor="model-select" className="block text-sm font-medium text-white">
          Choose a model:
        </label>
        <select
          id="model-select"
          name="model"
          value={settings.llmModel}
          className="mt-1 p-2 block w-96 text-black border-2 rounded-md border-gray-300 shadow-sm focus:border-gray-700 focus:outline-none"
          onChange={e => {
            const selectedModel = e.currentTarget.value;
            handleChange('llmModel', selectedModel);
            if (selectedModel.startsWith('gpt')) {
              handleChange('aiProvider', 'openai');
            } else if (selectedModel.startsWith('claude')) {
              handleChange('aiProvider', 'anthropic');
            }
          }}>
          {settings.openAIApiKey && (
            <>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4o">GPT-4o</option>
            </>
          )}
          {settings.anthropicApiKey && (
            <>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
              <option value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</option>
            </>
          )}
        </select>
      </div>

      <div className='flex flex-row items-center mb-4 p-2 w-96 border border-gray-600 rounded-md'>
        <div className='mr-2'>⚡</div>
        <p className='text-sm text-gray-300'>
          Recommend using <strong>Anthropic - Claude 3 Haiku </strong>
          for good results, cost-efficiency, and quick response times.
        </p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Smart Features</h2>

      <div className="mb-4">
        <label htmlFor="ai-filter" className="flex items-center space-x-2">
          <input
            id="ai-filter"
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
            checked={settings.filterEnabled}
            onChange={() => handleChange('filterEnabled', !settings.filterEnabled)}
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
            checked={settings.blockerEnabled}
            onChange={() => {
              handleChange('blockerEnabled', !settings.blockerEnabled);
              if (!settings.blockerEnabled) {
                handleChange('videoEvalEnabled', true);
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
            disabled={settings.blockerEnabled}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
            checked={settings.videoEvalEnabled}
            onChange={() => handleChange('videoEvalEnabled', !settings.videoEvalEnabled)}
          />
          <span>Enable Video Evaluation</span>
        </label>
      </div>
      <div className="mb-4">
        <label htmlFor="hideShorts" className="flex items-center space-x-2">
          <input
            id="hideShorts"
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-offset-0 focus:ring-blue-200 focus:ring-opacity-50"
            checked={settings.hideShortsEnabled}
            onChange={() => handleChange('hideShortsEnabled', !settings.hideShortsEnabled)}
          />
          <span>Hide Shorts (Just hide them, shorts are bad)</span>
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
