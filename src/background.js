'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
});

let timerState = { isRunning: false, isPaused: false };

function startTimer(duration) {
  chrome.browserAction.setBadgeBackgroundColor({color: '#3aa757'});
  timerState.isRunning = true;
  const timer = setInterval(() => {
      let minutes = parseInt(duration / 60, 10)
      let seconds = parseInt(duration % 60, 10);

      seconds = seconds < 10 ? "0" + seconds : seconds;

      var badgeText = minutes + ":" + seconds;

      chrome.browserAction.setBadgeText({text: badgeText});

      if (!timerState.isPaused && --duration < 0) {         
          clearInterval(timer);
          timerState = { isRunning: false, isPaused: false };
          chrome.storage.sync.set({'timerState': timerState});
          chrome.browserAction.setBadgeBackgroundColor({color: '#e8453c'});
          chrome.runtime.sendMessage({ cmd: 'REFRESH_UI' });
      }
  }, 1000);  
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

      if (request.cmd == "START_TIMER") {
        startTimer(request.durationInSecs);
        chrome.storage.sync.set({'timerState': timerState}, sendResponse(timerState));
      }

      if (request.cmd == "PAUSE_TIMER") {
        timerState.isPaused = true;
        chrome.storage.sync.set({'timerState': timerState}, sendResponse(timerState));
      }

      if (request.cmd == "RESUME_TIMER") {
        timerState.isPaused = false;
        chrome.storage.sync.set({'timerState': timerState}, sendResponse(timerState));
      }

      if (request.cmd == "OPEN_APP") {
        chrome.tabs.create({url: chrome.extension.getURL("index.html"), active: false});
      }
  }
);