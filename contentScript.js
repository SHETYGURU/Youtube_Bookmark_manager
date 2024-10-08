chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getCurrentTime") {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        const currentTimeInSeconds = videoElement.currentTime;
        const formattedTime = formatTime(currentTimeInSeconds);
        sendResponse({ currentTime: formattedTime });
      } else {
        sendResponse({ currentTime: null });
      }
    }
  });
  
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m${remainingSeconds}s`;
  }
  