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

function addWarningForVideo(node: HTMLElement, id: string, result: EvaluationResult, onUnblock: () => void) {
  addCoveredComponent(
    node,
    id,
    <div className="w-full h-[500px] flex justify-center items-center px-16">
      <TitleEvalResult result={result} onUnblock={() => {
        const warningElement = document.getElementById(id);
        if (warningElement) {
          warningElement.style.display = 'none';
        }
        onUnblock();
      }} />{' '}
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
            videoNode.pause();
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

function hideArea(selector: string) {
  const targetElement = document.querySelector(selector) as HTMLElement;
  if (targetElement) {
    targetElement.style.opacity = '0';
  }
}

function showArea(selector: string) {
  const targetElement = document.querySelector(selector) as HTMLElement;
  if (targetElement) {
    targetElement.style.opacity = '1';
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
  const primaryElement = document.querySelector('ytd-watch-flexy #primary') as HTMLElement;

  if (primaryElement) {
    primaryElement.style.position = 'relative';
  }
  if (blockerEnabled) {
    hideArea('#primary-inner');
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

    console.log("Evaluate video: ", videoTitle);
    // Send the video title to the background script
    const response = await chrome.runtime.sendMessage({ type: 'newVideoLoaded', videoTitle });

    if (blockerEnabled && response.evaluation_rating !== 'relevant') {
      removeAnalyzingSpinner('analyzing-video');
      if (primaryElement) {
        addWarningForVideo(primaryElement, 'video-warning', response, () => {
          showArea('#primary-inner');
          const videoPlayer = document.querySelector('video.html5-main-video') as HTMLVideoElement;
          shouldPauseVideo = false;
          if (videoPlayer) {
            videoPlayer.play();
          }
          const titleElement = document.querySelector('ytd-watch-metadata #title') as HTMLElement;
          if (titleElement) {
            addTitleEval(response, titleElement);
          }
        });
      }
    } else {
      if (blockerEnabled) {
        removeAnalyzingSpinner('analyzing-video');
        showArea('#primary-inner');
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

async function evaluateAndFilterVideos(videoRenderers: HTMLElement[]) {
  const videoData = videoRenderers.map((renderer, index) => {
    const titleElement = renderer.querySelector('#video-title');
    const title = titleElement ? titleElement.textContent?.trim() || '' : '';
    const id = `video-${index}-${Date.now()}`; // Create a unique ID
    renderer.setAttribute('data-video-id', id); // Set the ID as a data attribute
    return { id, title };
  });

  const evaluationResults = await chrome.runtime.sendMessage({
    type: 'recommendationsLoaded',
    videoData: Object.fromEntries(videoData.map(({ id, title }) => [id, title]))
  });
  console.log("Evaluation results: ", evaluationResults);
  videoRenderers.forEach((renderer) => {
    const id = renderer.getAttribute('data-video-id');
    if (id && id in evaluationResults) {
      renderer.style.pointerEvents = 'auto';
      renderer.style.opacity = '1';
      renderer.style.display = ''; // Reset display to default
    } else {
      renderer.style.pointerEvents = 'none';
      renderer.style.display = 'none';
    }
  });
  return true;
}

async function analyzeRecommendation() {
  const secondaryElement = document.querySelector('ytd-watch-flexy #secondary') as HTMLElement;
  hideArea('#secondary-inner');
  addAnalyzingSpinner(secondaryElement, 'analyzing-related-videos');

  let lastAnalyzedCount = 0;

  const observer = new MutationObserver(async (mutations, obs) => {
    let videoRecommendations = secondaryElement.querySelectorAll('ytd-compact-video-renderer') as NodeListOf<HTMLElement>;

    // youtube loads 19, 20, or 21 videos at a time
    if (((videoRecommendations.length - lastAnalyzedCount) % 20 === 0 ||
      (videoRecommendations.length - lastAnalyzedCount) % 19 === 0 ||
      (videoRecommendations.length - lastAnalyzedCount) % 21 === 0)
      && videoRecommendations.length > lastAnalyzedCount) {
      obs.disconnect();

      const newVideos = Array.from(videoRecommendations).slice(lastAnalyzedCount);


      if (lastAnalyzedCount > 0 && newVideos.length > 0) {
        newVideos.forEach((renderer, index) => {
          renderer.style.pointerEvents = 'none';
          renderer.style.opacity = '0';
        });
        if (newVideos[0]) {
          const spinnerElement = document.createElement('div');
          spinnerElement.style.position = 'relative';
          newVideos[0].parentNode?.insertBefore(spinnerElement, newVideos[0]);
          addAnalyzingSpinner(spinnerElement, 'analyzing-new-related-video');
        }
      }

      if (newVideos.length > 0) {
        await evaluateAndFilterVideos(newVideos);
      }

      if (lastAnalyzedCount > 0 && newVideos.length > 0) {
        removeAnalyzingSpinner('analyzing-new-related-video');
      } else {

        showArea('#secondary-inner');
        removeAnalyzingSpinner('analyzing-related-videos');
      }



      lastAnalyzedCount = videoRecommendations.length;

      if (secondaryElement) {
        observer.observe(secondaryElement, {
          childList: true,
          subtree: true,
        });
      }
    }
  });

  if (secondaryElement) {
    observer.observe(secondaryElement, {
      childList: true,
      subtree: true,
    });
  }
}

async function analyzeHome(filterEnabled: boolean) {
  if (filterEnabled) {
    const primaryElement = document.querySelector('ytd-browse #primary') as HTMLElement;

    let videoCount = 0;
    let lastAnalyzedCount = 0;

    hideArea('ytd-rich-grid-renderer');
    addAnalyzingSpinner(primaryElement, 'analyzing-home-video');

    const observer = new MutationObserver(async (mutations, obs) => {
      const videoRecommendations = document.querySelectorAll('ytd-rich-item-renderer') as NodeListOf<HTMLElement>;

      if (videoCount === videoRecommendations.length) {
        obs.disconnect();

        const newVideos = Array.from(videoRecommendations).slice(lastAnalyzedCount);


        if (lastAnalyzedCount > 0 && newVideos.length > 0) {
          newVideos.forEach((renderer, index) => {
            renderer.style.pointerEvents = 'none';
            renderer.style.opacity = '0';
          });
          if (newVideos[0].parentElement?.parentElement) {
            newVideos[0].parentElement.parentElement.style.position = 'relative';
            addAnalyzingSpinner(newVideos[0].parentElement.parentElement, 'analyzing-new-home-video');
          }
        }

        if (newVideos.length > 0) {
          await evaluateAndFilterVideos(newVideos);
        }

        if (lastAnalyzedCount > 0 && newVideos.length > 0) {
          removeAnalyzingSpinner('analyzing-new-home-video');
        } else {
          showArea('ytd-rich-grid-renderer');
          removeAnalyzingSpinner('analyzing-home-video');
        }

        lastAnalyzedCount = videoRecommendations.length;

        if (primaryElement) {
          observer.observe(primaryElement, {
            childList: true,
            subtree: true,
          });
        }

      } else {
        videoCount = videoRecommendations.length;
      }

    });


    if (primaryElement) {
      observer.observe(primaryElement, {
        childList: true,
        subtree: true,
      });
    }
  }
}


function hideShorts() {
  const shortsObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if ((node.tagName === 'YTD-RICH-SHELF-RENDERER' || node.tagName === 'YTD-REEL-SHELF-RENDERER')) {
              node.style.display = 'none';
            }
          }
        });
      }
    });
  });

  shortsObserver.observe(document.body, { childList: true, subtree: true });
}


document.addEventListener('yt-page-data-updated', async () => {
  removeElementsByIds([
    'analyzing-video',
    'analyzing-home-video',
    'analyzing-related-videos',
    'video-warning',
    'title-eval',
  ]);
  const { blockerEnabled, videoEvalEnabled, filterEnabled, hideShortsEnabled } = await savedSettingsStorage.get();

  if (hideShortsEnabled) {
    hideShorts();
  }
  if (window.location.pathname.includes('/watch')) {
    if (blockerEnabled || videoEvalEnabled) {
      analyzeCurrentVideo(blockerEnabled, videoEvalEnabled);
    }
    if (filterEnabled) {
      analyzeRecommendation();
    }
  } else if (window.location.href === 'https://www.youtube.com/' || window.location.href.includes('youtube.com/feed/subscriptions')) {
    if (filterEnabled) {
      analyzeHome(filterEnabled);
    }
  } else {
    const videoPlayer = document.querySelector('video.html5-main-video') as HTMLVideoElement;
    shouldPauseVideo = false;
    if (videoPlayer) {
      videoPlayer.play();
      return; // Exit if not on a watch page
    }
  }
});
