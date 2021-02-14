import { Metronome } from './utils/metronome.js';

chrome.runtime.onInstalled.addListener(function() {
  console.log("Prictice Timer is installed.");
});

let timerState = {
   isStarted: false,
   isPaused: false,
   isFinished: false,
   text: ''
};

const metronome = new Metronome();

let openTabs = [];

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
  chrome.runtime.sendMessage({ cmd: 'REFRESH_UI', timerState});
};

function resetTimer() {
  clearInterval(timer);
  timerState = {
    isStarted: false,
    isPaused: false,
    isFinished: false,
    text: '0:00'
  };
  chrome.runtime.sendMessage({ cmd: 'REFRESH_UI', timerState});
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
      console.log('request', request);
      if (request.cmd == "RESET_TIMER") {
        resetTimer();
      }

      if (request.cmd == "START_TIMER") {
        resetTimer();
        timerState.id = request.id;
        startTimer(request.durationInSecs);
      }

      if (request.cmd == "PAUSE_TIMER") {
        timerState.isPaused = true;
      }

      if (request.cmd == "RESUME_TIMER") {
        timerState.isPaused = false;
      }

      if (request.cmd == "SET_METRONOME") {
        metronome.play(request.bpm);
      }

      if (request.cmd == "STOP_METRONOME") {
        metronome.stop();
      }

      if (request.cmd == "OPEN_SETTINGS") {
        chrome.tabs.create({url: chrome.extension.getURL("options.html"), active: false});
      }

      if (request.cmd == "OPEN_TABS") {
          chrome.tabs.create({ url: request.url, active: request.active}, (tab) => openTabs.push(tab));
      }

      if (request.cmd == "CLOSE_TABS") {
        for (let i = 0; i < openTabs.length; i += 1) {
          chrome.tabs.get(openTabs[i].id, (result) => {
            if (result) {
              chrome.tabs.remove(result.id);
            }
          });
        }
        openTabs = [];
      }

      sendResponse(timerState);

      return true;
  }
);
