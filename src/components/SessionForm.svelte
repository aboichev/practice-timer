<script>
    import { title, state } from '../utils/store.js';
    import { fade } from 'svelte/transition';
    import Card from './Card.svelte';
    import { onMount } from 'svelte';

    export let id = null;

    const isNew = id == null;
    const item = state.sessions.getById(id);

	onMount(async () => {
        title.set(item.name);
	});

    function save () {
        state.sessions.upsert(item);
        title.set(item.name);
    }

    function deleteItem() {
       if (confirm('Are You Sure? This action cannot be undone.')) {
        state.sessions.delete(item.id);
        navigateBack();
       }
    }
 
    function navigateBack() {
        save();
        window.history.back();
    }

    function moveExercise(direction, i) {
        if ((direction == 'up' && i === 0)
             || direction == 'down' && i === item.listOfExercises.length - 1) {
            return;
        }

        if (direction === 'up') {
            [item.listOfExercises[i], item.listOfExercises[i-1]] = [item.listOfExercises[i-1], item.listOfExercises[i]]
            state.sessions.upsert(item);
            return;
        }

        [item.listOfExercises[i+1], item.listOfExercises[i]] = [item.listOfExercises[i], item.listOfExercises[i+1]]
        state.sessions.upsert(item);
    }

    function startSession() {
        state.currentSession.start(item.id);
        window.location.hash = `#/sessions/practice`;
    }

</script>

<div in:fade="{{ duration: 900 }}">
    <input id="name" type='text' bind:value={item.name} on:keyup={save} />
    <button on:click={navigateBack}>Back</button>
    {#if !isNew}
        <button on:click={deleteItem}>Remove This Session</button>
    {/if}
    {#if !isNew && item.listOfExercises.length > 0}
    <button on:click={startSession}>Start Practice Session Now!</button>
    {/if}
    {#if !isNew}
        <h2>Exercises:</h2>
    {/if}
    <div>
    {#each item.listOfExercises as item, i (item.id)}
        <Card>
            <span slot="firstColumn">
                    <strong>{item.duration.mins}</strong> mins
                {#if item.duration.secs}
                    &nbsp;<strong>{item.duration.secs}</strong> secs
                {/if}
                {#if !item.hideBpm}
                    @ <strong>{item.bpm}</strong> BPM
                {/if}
            </span>
            <span slot="midColumn"><strong>{item.name}</strong></span>
            <span slot="lastColumn" class="buttons">
                [ <a href="#/exercises/edit/{item.id}">Edit</a> ]
                [ <button on:click={() => moveExercise('up', i)}>Move Up</button> ]
                [ <button on:click={() => moveExercise('down', i)}>Move Down</button> ]
            </span>
            <span slot="description">{item.description || ''}</span>
        </Card>
    {/each}
    </div>
</div>

<style>
    #name {
        width: 20em;
    }
    .buttons button {
        background: #e4e2e2;
        border: none;
        padding: 0;
        color: rgb(13, 80, 160);
    }
    
    .buttons button:hover {
        text-decoration: underline;
        cursor: pointer;
    }
</style>