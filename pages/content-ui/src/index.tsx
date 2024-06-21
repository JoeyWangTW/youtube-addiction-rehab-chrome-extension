import { createRoot } from 'react-dom/client';
import { TitleEvalResult } from '@src/app';
// eslint-disable-next-line
// @ts-ignore
import tailwindcssOutput from '@src/tailwind-output.css?inline';

function addTitleEval(result) {
  const existingRoot = document.getElementById('chrome-extension-boilerplate-react-vite-content-view-root');

  if (existingRoot) {
    // Update the existing component if it already exists
    const shadowRoot = existingRoot.shadowRoot;
    const contentComponent = shadowRoot.getElementById('shadow-root');
    createRoot(contentComponent).render(<TitleEvalResult result={result} />);
  } else {
    // Create new component if it does not exist
    const root = document.createElement('div');
    root.id = 'chrome-extension-boilerplate-react-vite-content-view-root';

    document.querySelector('ytd-watch-metadata #title').append(root);

    const rootIntoShadow = document.createElement('div');
    rootIntoShadow.id = 'shadow-root';

    const shadowRoot = root.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(rootIntoShadow);

    /** Inject styles into shadow dom */
    const styleElement = document.createElement('style');
    styleElement.innerHTML = tailwindcssOutput;
    shadowRoot.appendChild(styleElement);

    createRoot(rootIntoShadow).render(<TitleEvalResult result={result} />);
  }
}

document.addEventListener('yt-page-data-updated', async () => {
  const metaDataElement = document.querySelector('ytd-watch-metadata');
  if (metaDataElement) {
    // Get the video title text
    const videoTitle = metaDataElement.querySelector('yt-formatted-string')?.textContent;

    console.log(videoTitle);
    // Send the video title to the background script
    const response = await chrome.runtime.sendMessage({ type: 'newVideoLoaded', videoTitle });
    console.log(response);
    addTitleEval(response);
  }
});
