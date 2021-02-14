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

                if (currentExercise.link1) {
                    chrome.runtime.sendMessage({
                        cmd: 'OPEN_TABS',
                        url: currentExercise.link1, 
                        active: currentExercise.link1ActiveTab
                    });
                }
 
                if (currentExercise.link2) {
                    chrome.runtime.sendMessage({
                        cmd: 'OPEN_TABS',
                        url: currentExercise.link2, 
                        active: currentExercise.link2ActiveTab
                    });
                }

                chrome.runtime.sendMessage({
                    cmd: 'START_TIMER',
                    durationInSecs: seconds
                });
                
                if (currentExercise.startMetronome) {
                    chrome.runtime.sendMessage({
                        cmd: 'SET_METRONOME',
                        bpm: currentExercise.bpm
                    });
                }
            }
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

        if (currentExercise.startMetronome) {
            chrome.runtime.sendMessage({
                cmd: 'SET_METRONOME',
                bpm: currentExercise.bpm
            });
        }
    }

    function next() {

        chrome.runtime.sendMessage({
            cmd: 'CLOSE_TABS'
        });

        chrome.runtime.sendMessage({
            cmd: 'STOP_METRONOME'
        });

        chrome.runtime.sendMessage({
            cmd: 'RESET_TIMER'
        },
        () => {
            state.currentSession.next();
            init();
        });
    }

    function stop() {

        chrome.runtime.sendMessage({
            cmd: 'CLOSE_TABS'
        });

        chrome.runtime.sendMessage({
            cmd: 'STOP_METRONOME'
        });

        chrome.runtime.sendMessage({
            cmd: 'RESET_TIMER'
        },
        () => {
            state.currentSession.stop();
            init();
        });
    }


    function startSession(id) {
        state.currentSession.start(id);
        init();
    }

    function openOptions() {
        chrome.runtime.openOptionsPage();
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.cmd == "REFRESH_UI") {
            timerState = request.timerState;
            if (timerState.isFinished) {
                chrome.runtime.sendMessage({
                    cmd: 'STOP_METRONOME'
                });
            }
        }
        return Promise.resolve("Dummy response to keep the console quiet");
    });

    init();
 
</script>

<div in:fade="{{ duration: 900 }}">
    <button on:click={openOptions}>Options</button>
    {#if currentExercise.inProgress }
        <h3>{currentExercise.sessionName}</h3>
        <article>
            <h3>{currentExercise.name} 
            {#if !currentExercise.hideBpm }
                @ {currentExercise.bpm} BPM
            {/if} | {timerState.text}
            </h3>
            {#if currentExercise.description}
                <p>{currentExercise.description}</p>
            {/if}
            {#if currentExercise.link1}
                <div>
                    <a href={currentExercise.link1}
                      target="_blank"
                      title={currentExercise.name}>{currentExercise.link1}</a>
                </div>
            {/if}
            {#if currentExercise.link2}
                <div>
                    <a href={currentExercise.link2}
                      target="_blank"
                      title={currentExercise.name}>{currentExercise.link2}</a>
                </div>
            {/if}

        {#if timerState.isStarted && !timerState.isFinished && !timerState.isPaused}
            <button on:click={pause}>Pause</button>
        {/if}
        {#if timerState.isPaused }
            <button on:click={resume}>Resume</button>
        {/if}
        <button on:click={next}>Skip</button>
        <button on:click={stop}>I'm done</button>
        </article>
    {:else}
    {#each $state.sessions as item (item.id)}
        <Card>
            <span slot="firstColumn">{item.name}</span>
            <span slot="midColumn">{item.exercises.length} exercise(s)</span>
            <span slot="lastColumn"><button on:click={() => startSession(item.id)}>Start</button></span>
        </Card>
    {/each}
    {/if}
</div>