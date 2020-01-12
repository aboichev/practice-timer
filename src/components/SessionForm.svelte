<script>
    import { state } from '../utils/store.js';
    import { fade } from 'svelte/transition';
    import Sortable from './Sortable.svelte';
    import Card from './Card.svelte';

    export let id = null;

    const isNew = id == null;

    const item = state.sessions.getById(id);

    function save() {
       state.sessions.upsert(item);
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

    function moveExercise(direction, i) {
        if ((direction == 'up' && i === 0)
             || direction == 'down' && i === item.listOfExercises.length - 1) {
            return;
        }

        if (direction === 'up') {
            [item.listOfExercises[i], item.listOfExercises[i-1]] = [item.listOfExercises[i-1], item.listOfExercises[i]]
        }

        if (direction === 'down') {
            [item.listOfExercises[i+1], item.listOfExercises[i]] = [item.listOfExercises[i], item.listOfExercises[i+1]]
        }
    }

    function startSession() {
        state.currentSession.start(item.id);
        window.location.hash = `#/sessions/practice`;
    }
</script>

<div in:fade="{{ duration: 900 }}">
    <button on:click={save}>Save</button>
    {#if !isNew}
        <button on:click={deleteItem}>Delete</button>
    {/if}
    <button on:click={backToList}>Cancel</button>
    {#if !isNew && item.listOfExercises.length > 0}
    <button on:click={startSession}>Start Practice Session Now!</button>
    {/if}
    <label for="name">Name:</label>
    <input id="name" type='text' bind:value={item.name} />
    <div>
    {#each item.listOfExercises as item, i (item.id)}
        <Sortable on:move={(event) => moveExercise(event.detail.direction, i)}>
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