
chrome.runtime.onInstalled.addListener(function() {
  console.log("Prictice Timer is installed");
});

let timerState = {
   isStarted: false,
   isPaused: false,
   isFinished: false,
   text: ''
};

let timer;

function startTimer(duration) {

  if (timerState.isStarted) {
    return;
  }
  
  chrome.browserAction.setBadgeBackgroundColor({color: '#3aa757'});

  clearInterval(timer);
  timerState.isStarted = true;

  timer = setInterval(() => {

      if (!timerState.isPaused) {
        duration -= 1;

        let minutes = parseInt(duration / 60, 10)
        let seconds = parseInt(duration % 60, 10);
  
        seconds = seconds < 10 ? "0" + seconds : seconds;
        
        var badgeText = minutes + ":" + seconds;
  
        chrome.browserAction.setBadgeText({text: badgeText});
        timerState.text = badgeText;

        if (duration <= 0) {
          clearInterval(timer);
          timerState.isFinished = true;
          chrome.browserAction.setBadgeBackgroundColor({color: '#e8453c'});
        }
      }
      chrome.runtime.sendMessage({ cmd: 'REFRESH_UI', timerState});
  }, 1000);
};

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {

      if (request.cmd == "RESET_TIMER") {
        clearInterval(timer);
        timerState = {
          isStarted: false,
          isPaused: false,
          isFinished: false,
          text: ''
        };
        chrome.browserAction.setBadgeText({text: ''});
      }

      if (request.cmd == "START_TIMER") {
        startTimer(request.durationInSecs);
      }

      if (request.cmd == "PAUSE_TIMER") {
        timerState.isPaused = true;
      }

      if (request.cmd == "RESUME_TIMER") {
        timerState.isPaused = false;
      }

      if (request.cmd == "OPEN_APP") {
        chrome.tabs.create({url: chrome.extension.getURL("options.html"), active: false});
      }

      sendResponse(timerState);

      return true;
  }
);