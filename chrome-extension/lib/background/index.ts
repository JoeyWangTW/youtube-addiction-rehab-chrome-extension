import 'webextension-polyfill';
import { savedGoalsStorage, savedSettingsStorage } from '@chrome-extension-boilerplate/storage';
import { fetchChatCompletion } from './AIHelpers';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    (async () => {
        if (message.type === 'newVideoLoaded') {
            const videoTitle = message.videoTitle;
            if (videoTitle) {
                console.log('Received video title in background:', videoTitle);
                const analysisResult = await analyzeVideoTitle(videoTitle);
                console.log('Result', analysisResult);
                sendResponse(analysisResult);
            } else {
                console.log('No title received or title is empty.');
            }
        }

        if (message.type === 'recommendationsLoaded') {
            const videoData = message.videoData;
            console.log('Received recommended video data in background:', videoData);
            if (videoData && Object.keys(videoData).length > 0) {
                const filterResult = await analyzeRecommendations(videoData);
                console.log('Filter', filterResult);
                sendResponse(filterResult);
            } else {
                console.log('No video data received or data is empty.');
            }
        }
    })();

    // Important! Return true to indicate you want to send a response asynchronously
    return true;
});

async function analyzeRecommendations(videoData: Record<string, string>) {
    const { helpful, harmful } = await savedGoalsStorage.get();

    const systemPrompt = `ou are a YouTube addiction rehab expert. Evaluate each video and determine if it should be shown to the user or not.
                    Make sure you evaluate the video based on all of the user's goals. Any unrelated video shown can be a negative distraction.
                    The response must only contain the videos that should be shown to the user with the reason for showing each video.
                    Your response must be pure JSON without any other text, and it needs to be valid JSON.
                    The format of the response should be like this:
                    {
                        "videos": [{id: "video-id", reason: "reason for showing the video"}, ...] 
                    }
                    object have a "videos" item that is an array of objects, each with "id" and "reason" properties.
                    `

    const prompt = `Given the user's goal: "${helpful}", and videos to avoid: "${harmful}", evaluate the following video data: ${JSON.stringify(videoData)}.
                    Make sure the response should only contain the videos that should be shown to the user with the reason for showing each video.`

    const result = await fetchChatCompletion(systemPrompt, prompt);
    let analysisResult;
    try {
        analysisResult = JSON.parse(result);
    } catch (error) {
        console.error('Failed to parse JSON:', result);
        throw error;
    }

    return analysisResult;
}

async function analyzeVideoTitle(title: string) {
    const { helpful, harmful } = await savedGoalsStorage.get();

    const systemPrompt = `You are a youtube addiction rehab expert. Evaluate if the video is relevant, should be avoided, or not sure.
                        Your resonse must be pure JSON without any other text, and it needs to be valid JSON
                        response must have two items "evaluation_rating" and "evaluation_context".
                        In evaluation_rating, there are four possible options: "relevant", "not_sure", "irrelevant", "avoid"
                        In the evaluation_context, provide one user-facing sentence. 
                        Adjust the tone based on the rating:
                        - "relevant": positive tone
                        - "not_sure": neutral tone
                        - "irrelevant": encouraging tone to get back on track
                        - "avoid": teasing but assertive tone
                        Assume the user understands the language of the video. Provide the evaluation_context in English.`;
    const prompt = `Given the user's goal: "${helpful}", and video to avoid: "${harmful}", evaluate the following video title: "${title}".`
    const result = await fetchChatCompletion(systemPrompt, prompt);
    const analysisResult = JSON.parse(result);
    return analysisResult;
}

async function updateBadge() {
    const { apiErrorStatus } = await savedSettingsStorage.get();
    if (apiErrorStatus && apiErrorStatus.type) {
        const badgeText = (apiErrorStatus.type === 'AUTH' || apiErrorStatus.type === 'RATE_LIMIT') ? '!' : '';
        await chrome.action.setBadgeText({ text: badgeText });
        await chrome.action.setBadgeBackgroundColor({ color: '#FF0000' });
    } else {
        await chrome.action.setBadgeText({ text: '' });
    }
}

savedSettingsStorage.subscribe(() => {
    updateBadge();
});

chrome.runtime.onStartup.addListener(updateBadge);
chrome.runtime.onInstalled.addListener(updateBadge);