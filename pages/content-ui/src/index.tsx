import { createRoot } from 'react-dom/client';
import { TitleEvalResult, Analyzing } from '@src/app';
import { savedSettingsStorage } from '@chrome-extension-boilerplate/storage';
// eslint-disable-next-line
// @ts-ignore
import tailwindcssOutput from '@src/tailwind-output.css?inline';

function addCoveredComponent(node, id, component) {
  // Create new component if it does not exist
  const root = document.createElement('div');
  root.id = id;

  node.append(root);

  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';

  root.style.position = 'absolute';
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.left = 0;
  root.style.top = 0;

  rootIntoShadow.style.width = '100%';
  rootIntoShadow.style.height = '100%';

  const shadowRoot = root.attachShadow({ mode: 'open' });
  shadowRoot.appendChild(rootIntoShadow);

  /** Inject styles into shadow dom */
  const styleElement = document.createElement('style');
  styleElement.innerHTML = tailwindcssOutput;
  shadowRoot.appendChild(styleElement);

  createRoot(rootIntoShadow).render(component);
}

function addAnalyzingSpinner(node, id) {
  addCoveredComponent(node, id, <Analyzing />);
}

function removeAnalyzingSpinner(id) {
  const root = document.getElementById(id);

  if (root) {
    root.parentNode.removeChild(root);
  }
}

function addWarningForVideo(node, id, result) {
  addCoveredComponent(
    node,
    id,
    <div className="w-full h-[500px] flex justify-center items-center px-16">
      <TitleEvalResult result={result} />{' '}
    </div>,
  );
}

function addTitleEval(result, node) {
  const existingRoot = document.getElementById('title-eval');

  if (existingRoot) {
    // Update the existing component if it already exists
    const shadowRoot = existingRoot.shadowRoot;
    const contentComponent = shadowRoot.getElementById('shadow-root');
    createRoot(contentComponent).render(<TitleEvalResult result={result} />);
  } else {
    // Create new component if it does not exist
    const root = document.createElement('div');
    root.id = 'title-eval';

    node.append(root);

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

let shouldPauseVideo = true; // Global flag to control video pausing

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeName.toLowerCase() === 'video') {
        // Detected a video element being added to the DOM

        node.addEventListener('play', () => {
          if (shouldPauseVideo) {
            console.log('Video started playing, pausing video...');
            node.pause(); // This pauses the video when it starts playing
            observer.disconnect();
          }
        });

        if (!node.paused && shouldPauseVideo) {
          console.log('Video is already playing, pausing immediately...');
          node.pause();
          observer.disconnect();
        }
      }
    });
  });
});

observer.observe(document, { childList: true, subtree: true });

function hidePrimaryArea() {
  const primaryInnerElement = document.querySelector('#primary-inner');
  primaryInnerElement.style.opacity = 0;
}

function showPrimaryArea() {
  const primaryInnerElement = document.querySelector('#primary-inner');
  primaryInnerElement.style.opacity = 1;
}

function removeElementsByIds(ids) {
  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.parentNode.removeChild(element);
    }
  });
}

document.addEventListener('yt-navigate-start', () => {
  shouldPauseVideo = true;
});

document.addEventListener('yt-page-data-updated', async () => {
  if (!window.location.pathname.includes('/watch')) {
    return; // Exit if not on a watch page
  }

  removeElementsByIds(['analyzing-video', 'video-warning', 'title-eval']);
  const { blockerEnabled, videoEvalEnabled } = await savedSettingsStorage.get();
  const metaDataElement = document.querySelector('ytd-watch-metadata');
  const primaryElement = document.querySelector('#primary');
  primaryElement.style.position = 'relative';

  if (blockerEnabled) {
    hidePrimaryArea();
    addAnalyzingSpinner(primaryElement, 'analyzing-video');
    shouldPauseVideo = true;
  } else {
    const videoPlayer = document.querySelector('video.html5-main-video');
    shouldPauseVideo = false;
    videoPlayer.play();
  }

  if (metaDataElement && videoEvalEnabled) {
    // Get the video title text
    const videoTitle = metaDataElement.querySelector('yt-formatted-string')?.textContent;

    console.log(videoTitle);
    // Send the video title to the background script
    const response = await chrome.runtime.sendMessage({ type: 'newVideoLoaded', videoTitle });

    if (blockerEnabled && response.evaluation_rating !== 'relevant') {
      removeAnalyzingSpinner('analyzing-video');
      addWarningForVideo(document.querySelector('#primary'), 'video-warning', response);
    } else {
      if (blockerEnabled) {
        removeAnalyzingSpinner('analyzing-video');
        showPrimaryArea();
        const videoPlayer = document.querySelector('video.html5-main-video');
        shouldPauseVideo = false;
        videoPlayer.play();
      }
      addTitleEval(response, document.querySelector('ytd-watch-metadata #title'));
    }
  }
});
