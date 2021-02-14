export class Metronome {

    constructor() {
        this.tempo = 60;

        this.audioCtx = null;
        this.click = null;
        this.clickVolume = null;
        this.timerId = null;

        this.timerInterval = 250;
        this.scheduleInPeriodInSec = 0.5;
        this.nextNoteTime = 0.0;
        this.active = false;
    }
    initAudio() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.click = this.audioCtx.createOscillator();
        this.clickVolume = this.audioCtx.createGain();

        this.click.type = 'sine'; 
        this.click.frequency.value = 1000;
        this.clickVolume.gain.value = 0;

        this.click.connect(this.clickVolume);
        this.clickVolume.connect(this.audioCtx.destination);
        this.click.start(0);
        this.nextNoteTime = this.audioCtx.currentTime;
    }

    playClick(time) {
        this.clickVolume.gain.cancelScheduledValues(time);
        this.clickVolume.gain.setValueAtTime(0, time);
        this.clickVolume.gain.linearRampToValueAtTime(1, time + .001);
        this.clickVolume.gain.linearRampToValueAtTime(0, time + .001 + .01);
    }

    schedule() {
        while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleInPeriodInSec ) {
            this.playClick(this.nextNoteTime);
            this.nextNoteTime += 60.0 / this.tempo;
        }
    }

    get isPlaying() {
        return this.active;
    }

    play(bpm) {
        this.tempo = bpm;
        
        if (!this.active) {
            this.initAudio();
            this.timerId = setInterval(() => this.schedule(), this.timerInterval);
        }
        this.active = true;	
    }

    stop() {
        this.active = false;
        clearInterval(this.timerId);
    }
}