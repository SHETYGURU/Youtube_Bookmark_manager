document.getElementById('saveBookmark').addEventListener('click', saveBookmark);

function saveBookmark() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const url = new URL(tab.url);

    if (url.hostname === 'www.youtube.com' && url.searchParams.get('v')) {
      const videoId = url.searchParams.get('v');

      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ['contentScript.js']
        },
        () => {
          chrome.tabs.sendMessage(tab.id, { action: 'getCurrentTime' }, (response) => {
            if (response && response.currentTime) {
              const currentTime = response.currentTime;

              const bookmark = {
                title: tab.title,
                url: `${tab.url}&t=${currentTime}`,
                timestamp: currentTime
              };

              let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
              bookmarks.push(bookmark);

              localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

              renderBookmarks();
            }
          });
        }
      );
    }
  });
}

function renderBookmarks() {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  const bookmarkList = document.getElementById('bookmarkList');
  bookmarkList.innerHTML = '';

  bookmarks.forEach((bookmark, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <a href="${bookmark.url}" target="_blank">
        ${bookmark.title} (${bookmark.timestamp})
      </a>
      <button id="deleteBookmark-${index}"><img src="delete.png" alt="Delete"></button>
    `;
    bookmarkList.appendChild(listItem);

    document.getElementById(`deleteBookmark-${index}`).addEventListener('click', () => deleteBookmark(index));
  });

  if (bookmarks.length === 0) {
    bookmarkList.innerHTML = '<p>No bookmarks saved</p>';
  }
}

function deleteBookmark(index) {
  let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  bookmarks.splice(index, 1);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

  renderBookmarks();
}

document.addEventListener('DOMContentLoaded', renderBookmarks);
