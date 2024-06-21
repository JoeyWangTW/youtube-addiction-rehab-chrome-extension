document.addEventListener('yt-page-data-updated', async () => {
    const metaDataElement = document.querySelector('ytd-watch-metadata');
    console.log(document.querySelector('#related #items #video-title')?.textContent);

    if (metaDataElement) {
        // Get the video title text
        const videoTitle = metaDataElement.querySelector('yt-formatted-string')?.textContent;

        console.log(videoTitle);
        // Send the video title to the background script
        const response = await chrome.runtime.sendMessage({ type: 'newVideoLoaded', videoTitle });
        console.log(response);
    }
});
