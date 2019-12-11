<script>
    import { sessions } from '../utils/sessionStore.js'
    import { exercises } from '../utils/exerciseStore.js'
    import { fade } from 'svelte/transition';

    export let id = null;

    let item = $sessions.find(x => x.id.toString() === id);

    if (!item) {
        throw Error('Session not found');
    }

    $: sessionExercises = item.exercises.map(exerciseId => $exercises.find(x => x.id === exerciseId));

    let currentIndex = 0;
    $: current = sessionExercises[currentIndex];

    function skipToNext() {
        if (hasMore()) {
            currentIndex += 1;
            current = sessionExercises[currentIndex];
        }
    }

    function hasMore() {
        return currentIndex + 1 < sessionExercises.length;
    }

    function stop() {
       
       sessions.upsert(item);
       navigateAway();
    }
 
    function navigateAway() {
        window.location.hash = '#/recent';
    }

</script>

<div in:fade="{{ duration: 900 }}">
    {#if hasMore()}
        <button on:click={skipToNext}>Next Exercise</button>
    {/if}
    <button on:click={stop}>End Session</button>
    <h3>{item.name}</h3>
    <article>
        <h3>{current.name}</h3>
        {#if current.description}
            <p>{current.description}</p>
        {/if}
        {#if current.link1}
            <div>
                <a href={current.link1} target="_blank" title={current.name}>{current.link1}</a>
            </div>
        {/if}
        
        {#if current.embed1}
            <div>
                {@html current.embed1}
            </div>
        {/if}
    </article>
</div>