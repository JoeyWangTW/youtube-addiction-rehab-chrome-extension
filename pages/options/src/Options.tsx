import '@src/Options.css';
import { withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import InfoTab from './InfoTab';
import GoalsTab from './GoalsTab';
import SettingsTab from './SettingsTab';
import React, { useState } from 'react';

const Options = () => {
  const [activeTab, setActiveTab] = useState<string>('settings');

  const renderTab = () => {
    switch (activeTab) {
      case 'info':
        return <InfoTab />;
      case 'goals':
        return <GoalsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <InfoTab />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className='pl-4 flex flex-row items-center'>
        <img src={chrome.runtime.getURL('options/logo.png')} className='w-10 h-10'></img>
        <div className="text-xl font-bold p-4 shadow text-white">YouTube Addiction Rehab</div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-800 shadow-md">
          <div className="flex flex-col">
            <button
              className={`p-4 text-left ${activeTab === 'info' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700 text-white'} transition duration-150 ease-in-out`}
              onClick={() => setActiveTab('info')}>
              Info
            </button>
            <button
              className={`p-4 text-left ${activeTab === 'goals' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700 text-white'} transition duration-150 ease-in-out`}
              onClick={() => setActiveTab('goals')}>
              Goals
            </button>
            <button
              className={`p-4 text-left ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'hover:bg-gray-700 text-white'} transition duration-150 ease-in-out`}
              onClick={() => setActiveTab('settings')}>
              Settings
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gray-800 p-4 overflow-auto text-white">{renderTab()}</div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
