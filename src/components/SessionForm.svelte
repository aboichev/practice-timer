<script>
    import { sessions } from '../utils/sessionStore.js'
    import { exercises } from '../utils/exerciseStore.js'
    import { fade } from 'svelte/transition';
    import Sortable from './Sortable.svelte';
    import Card from './Card.svelte';

    export let id = null;

    const isNew = id == null;
    let item = null;

    const empty = {
        name: null,
        exercises: []
    };

    if (isNew) {
        item = empty;
    }
    else {
        item = $sessions.find(x => x.id.toString() === id) || empty;
    }

    $: sessionExercises = item.exercises.map(exerciseId => $exercises.find(x => x.id === exerciseId));

    function save() {
       item.exercises = sessionExercises.map(x => x.id);
       sessions.upsert(item);
       backToList();
    }

    function deleteItem() {
       exercises.removeSession(item.id);
       sessions.delete(item.id);
       backToList();
    }
 
    function backToList() {
        window.location.hash = '#/sessions';
    }

    function moveExercise(event, i) {
        if ((event.detail.direction == 'up' && i === 0)
             || event.detail.direction == 'down' && i === sessionExercises.length - 1) {
            return;
        }

        if (event.detail.direction === 'up') {
            [sessionExercises[i], sessionExercises[i-1]] = [sessionExercises[i-1], sessionExercises[i]]
        }

        if (event.detail.direction === 'down') {
            [sessionExercises[i+1], sessionExercises[i]] = [sessionExercises[i], sessionExercises[i+1]]
        }
    }
</script>

<div in:fade="{{ duration: 900 }}">
    <button on:click={save}>Save</button>
    <button on:click={deleteItem}>Delete</button>
    <button on:click={backToList}>Cancel</button>
    <label for="name">Name:</label>
    <input id="name" type='text' bind:value={item.name} />
    <div>
    {#each sessionExercises as item, i (item.id)}
        <Sortable on:move={(event) => moveExercise(event, i)}>
            <Card href="#/exercises/edit/{item.id}">
                <span slot="title">{item.name}</span>
                <span slot="midColumn">
                    {item.duration.mins} mins
                    {#if item.duration.secs}
                        {item.duration.secs} secs
                    {/if}
                </span>
                <span slot="lastColumn">{item.bpm} bpm</span>
                <span slot="description">{item.description || ''}</span>
            </Card>
        </Sortable>
    {/each}
    </div>
</div>