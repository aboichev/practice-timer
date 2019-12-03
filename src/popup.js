'use strict';

let changeColor = document.getElementById('changeColorBtn');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});


changeColor.onclick = function(e) {
  let color = e.target.value;
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    if (tabs[0].url.startsWith("chrome://")) {
      return;
    }

    chrome.tabs.executeScript(
        tabs[0].id,
        {code: 'document.body.style.backgroundColor = "' + color + '";'});
  });
};

function updateUI (data) {
  console.log('Got data', data);

  if (data === undefined || data === null) {
    chrome.storage.sync.get(['timerState'], (storageData) => updateUI(storageData.timerState));
  }
  else {
    timerState = data;
  }

  if (timerState.isPaused) {
    timerBtn.innerHTML = 'Resume';
  }

  console.log('isRunning', timerState.isRunning, timerState.isPaused);

  if (timerState.isRunning && !timerState.isPaused) {
    timerBtn.innerHTML = 'Pause';
  }

  if (!timerState.isRunning) {
    timerBtn.innerHTML = 'Start';
  }
}

let timerState = {};

const timerBtn = document.getElementById('timerBtn');

timerBtn.onclick = function(e) {
  console.log('Start Button clicked');

  if (!timerState.isRunning && !timerState.isPaused) {
    chrome.runtime.sendMessage({
      cmd: 'START_TIMER',
      durationInSecs: 10
    }, (newState) => updateUI(newState));
  }

  if (timerState.isRunning && timerState.isPaused) {
    chrome.runtime.sendMessage({
      cmd: 'RESUME_TIMER',
    }, (newState) => updateUI(newState));
  }
  
  if (timerState.isRunning && !timerState.isPaused) {
    chrome.runtime.sendMessage({
      cmd: 'PAUSE_TIMER'
    }, (newState) => updateUI(newState));
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

  if (request.cmd == "REFRESH_UI") {    
    
  }
});

chrome.runtime.sendMessage({
  cmd: 'OPEN_APP'
}, updateUI());
