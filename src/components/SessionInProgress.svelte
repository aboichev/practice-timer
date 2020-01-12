<script>
    import { state } from '../utils/store.js';
    import { fade } from 'svelte/transition';
    import Card from './Card.svelte';

    let currentIndex = 0;
    let currentExercise = null;
    let currentSession = null;

    function init() {
        currentSession = state.currentSession.get();
        if (currentSession.inProgress) {
            currentIndex = 0;
            currentExercise = currentSession.listOfExercises[currentIndex];
        }
    }

    function skipToNext() {
        if (hasMore()) {
            currentIndex += 1;
            currentExercise = currentSession.listOfExercises[currentIndex];
        }
    }

    function hasMore() {
        return currentIndex + 1 < currentSession.listOfExercises.length;
    }

    function stop() {
        state.currentSession.end();
        init();
    }

    function startSession(id) {
        state.currentSession.start(id);
        init();
    }

    init();
 
</script>

<div in:fade="{{ duration: 900 }}">
    {#if currentSession.inProgress}
        {#if hasMore()}
            <button on:click={skipToNext}>Next Exercise</button>
        {/if}
        <button on:click={stop}>End Session</button>
        <h3>{currentSession.name}</h3>
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