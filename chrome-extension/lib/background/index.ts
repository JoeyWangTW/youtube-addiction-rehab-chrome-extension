import 'webextension-polyfill';
import { savedGoalsStorage } from '@chrome-extension-boilerplate/storage';
import { savedSettingsStorage } from '@chrome-extension-boilerplate/storage';
import { fetchChatCompletion } from './AIHelpers';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    (async () => {
        if (message.type === 'newVideoLoaded') {
            const videoTitle = message.videoTitle;
            if (videoTitle) {
                console.log('Received video title in background:', videoTitle);
                // You can perform further actions here, such as:
                const analysisResult = await analyzeVideoTitle(videoTitle);
                // Send decision back to content script
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
                console.log('Received recommended video data in background:', videoData);
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
    const { openAIApiKey } = await savedSettingsStorage.get();

    const systemPrompt = `You are a YouTube addiction rehab expert. The user will provide their goals, videos to avoid, and a JSON object of video IDs and titles.
        Evaluate each video and determine if it should be shown to the user or not.
        Make sure you evaluate the video based on all of the user's goals. Any unrelated video shown can be a negative distraction.
        Return a JSON object where each key is the video ID and the value is a short sentence explaining why the video should be shown.
        Only include videos that should be shown in the response.
        response must be pure json without any other text`;

    const prompt = `Given the user's goal: "${helpful}", and videos to avoid: "${harmful}", evaluate the following video data: ${JSON.stringify(videoData)}.
        Return the result as a JSON object where the keys are the video IDs and the values are the reasons for showing the video.`;

    console.log(prompt);
    const result = await fetchChatCompletion(systemPrompt, prompt);
    const analysisResult = JSON.parse(result);

    return analysisResult;
}

async function analyzeVideoTitle(title: string) {
    const { helpful, harmful } = await savedGoalsStorage.get();
    const { openAIApiKey, blockerEnabled } = await savedSettingsStorage.get();
    // Placeholder for title analysis logic
    console.log('Analyzing title:', title);
    console.log(helpful, harmful, openAIApiKey, blockerEnabled);
    // Example of a possible API call to analyze the title
    // This can be an internal logic or an external API call
    // Here we just log to the console for demonstration

    const systemPrompt = `You are a youtube addiction rehab expert, user will provide their goal and a video title they are watching.
        return a json response including two items.
        1. evaluation_rating ( three possible options: "relevant", "not_sure", "irrelevant", "avoid")
        2. evaluation_context ( one sentence about what's the video about and the relavency for user’s goal and the video)
        Make sure you go thorugh all the user's goal, and rate relevancy based on all of them.
        In the evaluation_context, it should only show one sentence, the sentence should be user facing. And follow the instruction for the tone.
        If rating is "relavent", make the tone positive.
        If rating is "not_sure", make the tone neutral.
        If rating is "irrelavent", try use an encouraging tone to let them go back on track.
        If the user is "avoid", try to use a teasing but asserting tone to let them know they are watching something they should avoid.
        Assume user understand the language of the video. Also also return the evaluation_context in English`;
    const prompt = `Given the user's goal: "${helpful}", and video to avoid: "${harmful}", evaluate if the following video title is relevant, should be avoided, or not sure: "${title}".`;
    const result = await fetchChatCompletion(systemPrompt, prompt);
    const analysisResult = JSON.parse(result);
    return analysisResult;
}