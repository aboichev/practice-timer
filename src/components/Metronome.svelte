<script>
    import { fade } from 'svelte/transition';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let excersise;
    export let disabled = false;

    let timerState = {
        text: ''
    };

    function start() {
        // start a timer using 
        const seconds = excersise.duration.mins * 60 + excersise.duration.secs;

        chrome.runtime.sendMessage({
            cmd: 'START_TIMER',
            durationInSecs: seconds,
            id: excersise.id
        });
        
        chrome.runtime.sendMessage({
            cmd: 'SET_METRONOME',
            bpm: excersise.bpm
        });
    }

    function pause() {
        chrome.runtime.sendMessage({
            cmd: 'PAUSE_TIMER'
        });
        chrome.runtime.sendMessage({
            cmd: 'STOP_METRONOME'
        });
    }

     function resume() {
        chrome.runtime.sendMessage({
            cmd: 'RESUME_TIMER'
        });

        chrome.runtime.sendMessage({
            cmd: 'SET_METRONOME',
            bpm: excersise.bpm
        });
    }

    function finished() {
        chrome.runtime.sendMessage({
            cmd: 'RESET_TIMER'
        });
        chrome.runtime.sendMessage({
            cmd: 'STOP_METRONOME',
            bpm: excersise.bpm
        });
    }

    function raiseChange() {
        dispatch('bpmChange', {
            bpm: excersise.bpm
        });
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.cmd == "REFRESH_UI") {
            timerState = request.timerState;
            if (timerState.isFinished) {
                finished();
            }
        }
        return Promise.resolve("Dummy response to keep the console quiet");
    });

</script>
<div>
    {#if timerState.id !== excersise.id && !disabled}
        <button on:click={start}><i class="fa fa-play-circle"></button>
    {/if}
    {#if timerState.id === excersise.id && timerState.isStarted && !timerState.isFinished && !timerState.isPaused && !disabled}
        <button on:click={pause}><i class="fa fa-pause-circle"></button>
    {/if}
    {#if timerState.id === excersise.id && timerState.isPaused && !disabled}
        <button on:click={resume}><i class="fa fa-play-circle"></button>
    {/if}
    <span>
        {#if disabled}
            N/A
        {:else}
            {excersise.bpm} BPM
        {/if}
    </span>
    <div>
        <input id="bpm" type="range" min=30 step=5 max=230 disabled={disabled}
            bind:value={excersise.bpm} on:change={()=>raiseChange()} />
    </div>
</div>