import '@src/Options.css';
import { useStorageSuspense, withErrorBoundary, withSuspense } from '@chrome-extension-boilerplate/shared';
import { exampleThemeStorage, createStorage } from '@chrome-extension-boilerplate/storage';
import React, { useState, useEffect } from 'react';

const helpfulVideosStorage = createStorage('helpfulVideos', '');
const harmfulVideosStorage = createStorage('harmfulVideos', '');

const Options = () => {
  const theme = useStorageSuspense(exampleThemeStorage);
  const [helpfulVideos, setHelpfulVideos] = useState('');
  const [harmfulVideos, setHarmfulVideos] = useState('');

  useEffect(() => {
    const loadInitialValues = async () => {
      const initialHelpfulVideos = await helpfulVideosStorage.get();
      const initialHarmfulVideos = await harmfulVideosStorage.get();
      setHelpfulVideos(initialHelpfulVideos);
      setHarmfulVideos(initialHarmfulVideos);
    };
    loadInitialValues();
  }, []);

  const handleSave = async () => {
    try {
      await helpfulVideosStorage.set(helpfulVideos);
      await harmfulVideosStorage.set(harmfulVideos);
    } catch (error) {
      console.error('Error saving input values to storage:', error);
    }
  };

  return (
    <div
      className="App-container"
      style={{
        backgroundColor: theme === 'light' ? '#eee' : '#222',
      }}>
      <img src={chrome.runtime.getURL('options/logo.svg')} className="App-logo" alt="logo" />
      <span style={{ color: theme === 'light' ? '#0281dc' : undefined, marginBottom: '10px' }}>Options</span>
      <div>
        <label htmlFor="helpful-videos">Helpful Videos:</label>
        <textarea id="helpful-videos" value={helpfulVideos} onChange={e => setHelpfulVideos(e.target.value)} />
      </div>
      <div>
        <label htmlFor="harmful-videos">Harmful Videos:</label>
        <textarea id="harmful-videos" value={harmfulVideos} onChange={e => setHarmfulVideos(e.target.value)} />
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
