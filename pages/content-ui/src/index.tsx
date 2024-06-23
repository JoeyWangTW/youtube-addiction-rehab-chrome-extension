import { createRoot } from 'react-dom/client';
import { TitleEvalResult, Analyzing } from '@src/app';
import { savedSettingsStorage } from '@chrome-extension-boilerplate/storage';
// eslint-disable-next-line
// @ts-ignore
import tailwindcssOutput from '@src/tailwind-output.css?inline';
import { ReactElement } from 'react';

function addCoveredComponent(node: HTMLElement, id: string, component: ReactElement): void {
  // Create new component if it does not exist
  const root = document.createElement('div');
  root.id = id;

  node.append(root);

  const rootIntoShadow = document.createElement('div');
  rootIntoShadow.id = 'shadow-root';

  root.style.position = 'absolute';
  root.style.width = '100%';
  root.style.height = '100%';
  root.style.left = '0';
  root.style.top = '0';

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

function addAnalyzingSpinner(node: HTMLElement, id: string) {
  addCoveredComponent(node, id, <Analyzing />);
}

function removeAnalyzingSpinner(id: string) {
  const root = document.getElementById(id);

  if (root) {
    root.parentNode?.removeChild(root);
  }
}

interface EvaluationResult {
  evaluation_rating: string;
  evaluation_context: string;
}

function addWarningForVideo(node: HTMLElement, id: string, result: EvaluationResult) {
  addCoveredComponent(
    node,
    id,
    <div className="w-full h-[500px] flex justify-center items-center px-16">
      <TitleEvalResult result={result} />{' '}
    </div>,
  );
}

function addTitleEval(result: EvaluationResult, node: HTMLElement) {
  const existingRoot = document.getElementById('title-eval');

  if (existingRoot) {
    // Update the existing component if it already exists
    const shadowRoot = existingRoot.shadowRoot;
    const contentComponent = shadowRoot?.getElementById('shadow-root');
    if (contentComponent) {
      createRoot(contentComponent).render(<TitleEvalResult result={result} />);
    }
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
        const videoNode = node as HTMLVideoElement;
        videoNode.addEventListener('play', () => {
          if (shouldPauseVideo) {
            console.log('Video started playing, pausing video...');
            videoNode.pause(); // This pauses the video when it starts playing
            observer.disconnect();
          }
        });

        if (!videoNode.paused && shouldPauseVideo) {
          console.log('Video is already playing, pausing immediately...');
          videoNode.pause();
          observer.disconnect();
        }
      }
    });
  });
});

observer.observe(document, { childList: true, subtree: true });

function hidePrimaryArea() {
  const primaryInnerElement = document.querySelector('#primary-inner') as HTMLElement;
  if (primaryInnerElement) {
    primaryInnerElement.style.opacity = '0';
  }
}

function showPrimaryArea() {
  const primaryInnerElement = document.querySelector('#primary-inner') as HTMLElement;
  if (primaryInnerElement) {
    primaryInnerElement.style.opacity = '1';
  }
}

function removeElementsByIds(ids: string[]) {
  ids.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.parentNode?.removeChild(element);
    }
  });
}

document.addEventListener('yt-navigate-start', () => {
  shouldPauseVideo = true;
});

async function analyzeCurrentVideo(blockerEnabled: boolean, videoEvalEnabled: boolean) {
  const metaDataElement = document.querySelector('ytd-watch-metadata');
  const primaryElement = document.querySelector('#primary') as HTMLElement;
  if (primaryElement) {
    primaryElement.style.position = 'relative';
  }

  if (blockerEnabled) {
    hidePrimaryArea();
    addAnalyzingSpinner(primaryElement, 'analyzing-video');
    shouldPauseVideo = true;
  } else {
    const videoPlayer = document.querySelector('video.html5-main-video') as HTMLVideoElement;

    shouldPauseVideo = false;
    if (videoPlayer) {
      videoPlayer.play();
    }
  }

  if (metaDataElement && videoEvalEnabled) {
    // Get the video title text
    const videoTitle = metaDataElement.querySelector('yt-formatted-string')?.textContent;

    console.log(videoTitle);
    // Send the video title to the background script
    const response = await chrome.runtime.sendMessage({ type: 'newVideoLoaded', videoTitle });

    if (blockerEnabled && response.evaluation_rating !== 'relevant') {
      removeAnalyzingSpinner('analyzing-video');
      const primaryElement = document.querySelector('#primary') as HTMLElement;
      if (primaryElement) {
        addWarningForVideo(primaryElement, 'video-warning', response);
      }
    } else {
      if (blockerEnabled) {
        removeAnalyzingSpinner('analyzing-video');
        showPrimaryArea();
        const videoPlayer = document.querySelector('video.html5-main-video') as HTMLVideoElement;
        shouldPauseVideo = false;
        if (videoPlayer) {
          videoPlayer.play();
        }
      }
      const titleElement = document.querySelector('ytd-watch-metadata #title') as HTMLElement;
      if (titleElement) {
        addTitleEval(response, titleElement);
      }
    }
  }
}

async function evaluateAndFilterVideos(videoRenderers: NodeListOf<HTMLElement>, videoTitles: string[]) {
  console.log('send recommendationLoaded');
  const evaluationResults = await chrome.runtime.sendMessage({ type: 'recommendationsLoaded', videoTitles });

  console.log(evaluationResults);
  videoRenderers.forEach((renderer, index) => {
    if (!evaluationResults.result[index]) {
      // Assuming true means show the video
      renderer.style.display = 'none';
    }
  });
}

async function analyzedRecommendation() {
  const secondaryInnerElement = document.querySelector('#secondary-inner') as HTMLElement;
  if (secondaryInnerElement) {
    secondaryInnerElement.style.opacity = '0';
  }
  const observer = new MutationObserver((mutations, obs) => {
    const videoRecommendations = document.querySelectorAll('ytd-compact-video-renderer') as NodeListOf<HTMLElement>;
    if (videoRecommendations.length >= 20) {
      const videoTitles: string[] = [];
      videoRecommendations.forEach(renderer => {
        const titleElement = renderer.querySelector('#video-title');
        if (titleElement) {
          const videoTitle = titleElement.textContent ? titleElement.textContent.trim() : '';
          videoTitles.push(videoTitle);
        }
      });
      obs.disconnect();
      evaluateAndFilterVideos(videoRecommendations, videoTitles);
      if (secondaryInnerElement) {
        secondaryInnerElement.style.opacity = '1';
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

document.addEventListener('yt-page-data-updated', async () => {
  if (!window.location.pathname.includes('/watch')) {
    const videoPlayer = document.querySelector('video.html5-main-video') as HTMLVideoElement;
    shouldPauseVideo = false;
    if (videoPlayer) {
      videoPlayer.play();
    }
    return; // Exit if not on a watch page
  }

  removeElementsByIds(['analyzing-video', 'video-warning', 'title-eval']);
  const { blockerEnabled, videoEvalEnabled, filterEnabled } = await savedSettingsStorage.get();
  if (blockerEnabled || videoEvalEnabled) {
    analyzeCurrentVideo(blockerEnabled, videoEvalEnabled);
  }
  if (filterEnabled) {
    analyzedRecommendation();
  }
});
