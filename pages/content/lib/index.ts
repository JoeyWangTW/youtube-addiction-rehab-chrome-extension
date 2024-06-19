document.addEventListener('yt-page-data-updated', function () {
    const metaDataElement = document.querySelector('ytd-watch-metadata');

    if (metaDataElement) {
        // Get the video title text
        const videoTitle = metaDataElement.querySelector('yt-formatted-string')?.textContent;

        console.log(videoTitle);
        // Send the video title to the background script
        //chrome.runtime.sendMessage({ type: 'newVideoLoaded', videoTitle });
    }
});
