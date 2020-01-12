<script>
    import { state } from '../utils/store.js';
    import { fade } from 'svelte/transition';
    import Card from './Card.svelte';

    let currentExercise = null;

    let timerState = {
        text: ''
    };

    function init() {

        currentExercise = state.currentSession.get();
        
        if (!currentExercise.inProgress) {
            return;
        }

        // start a timer using 
        const seconds = currentExercise.duration.mins * 60 + currentExercise.duration.secs;

        chrome.runtime.sendMessage({
            cmd: 'GET_TIMER'
        },
        (newState) => {
            timerState = newState;

            if (!timerState.isStarted) {
                chrome.runtime.sendMessage({
                    cmd: 'START_TIMER',
                    durationInSecs: seconds
                });
            }
        });
    }

    function pause() {
        chrome.runtime.sendMessage({
            cmd: 'PAUSE_TIMER'
        });
    }

     function resume() {
        chrome.runtime.sendMessage({
            cmd: 'RESUME_TIMER'
        });
    }

    function next() {
        chrome.runtime.sendMessage({
            cmd: 'RESET_TIMER'
        },
        () => {
            state.currentSession.next();
            init();
        });
    }

    function startSession(id) {
        state.currentSession.start(id);
        init();
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.cmd == "REFRESH_UI") {
            console.log(request.cmd, request.timerState);
            timerState = request.timerState;
        }
        return Promise.resolve("Dummy response to keep the console quiet");
    });

    init();
 
</script>

<div in:fade="{{ duration: 900 }}">
    {#if currentExercise.inProgress }

        {#if timerState.isStarted && !timerState.isFinished && !timerState.isPaused}
            <button on:click={pause}>Pause</button>
        {/if}
        {#if timerState.isPaused }
            <button on:click={resume}>Resume</button>
        {/if}

        <button on:click={next}>Continue</button>

        <span>{timerState.text}</span>
        <h3>{currentExercise.sessionName}</h3>
        <article>
            <h3>{currentExercise.name}</h3>
            {#if currentExercise.description}
                <p>{currentExercise.description}</p>
            {/if}
            {#if currentExercise.link1}
                <div>
                    <a href={currentExercise.link1} target="_blank" title={currentExercise.name}>{currentExercise.link1}</a>
                </div>
            {/if}
            
            {#if currentExercise.embed1}
                <div>
                    {@html currentExercise.embed1}
                </div>
            {/if}
        </article>
    {:else}
    {#each $state.sessions as item (item.id)}
        <Card>
            <span slot="title">{item.name}</span>
            <span slot="midColumn">{item.exercises.length} exercise(s)</span>
            <span slot="lastColumn"><button on:click={() => startSession(item.id)}>Start</button></span>
        </Card>
    {/each}
    {/if}
</div>