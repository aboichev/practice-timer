<script>
    import { state } from '../utils/store.js'
    import { fade } from 'svelte/transition';
    import Metronome from './Metronome.svelte';

    export let id = null;
    
    const item = state.exercises.getById(id);

    function save () {
        state.exercises.upsert(item);
        navigateBack();
    }

    function deleteItem () {
        state.exercises.delete(item.id);
        navigateBack();
    }

    function navigateBack() {
        window.history.back();
    }

</script>
<div class="panel">
    <button on:click="{navigateBack}">Back</button>  
    <button on:click="{save}">Save</button>
    {#if !(id === null)}
    <button on:click="{deleteItem}">Delete</button>
    {/if}
</div>
<form>
    <fieldset in:fade="{{ duration: 900 }}">
    <legend>{`${id == null ? 'Add New' : 'Edit'} Exercise`}</legend>
        <label for="name">Name:</label>
        <input id="name" type='text' placeholder="Exercise Name" bind:value={item.name} />
        <span>This is a required field.</span>
        <label for="description">Exercise Description / Goal:</label>
        <textarea id="description" placeholder="some useful info..." bind:value={item.description} ></textarea>
        <label for="durationMins">Duration:</label>
        <div>
           <input id="durationMins" type="number" min=0 step=1 max=720 bind:value={item.duration.mins} /> <span>Min</span>
           <input id="durationSecs" type="number" min=0 step=1 max=59 bind:value={item.duration.secs} /> <span>Sec</span>
        </div>        
        <label>Metronome:</label>
        
        <Metronome excersise={item} disabled={item.hideBpm} />

        <input id="startMetronome" type="checkbox" bind:checked={item.startMetronome } /> <span>start automatically?</span>
        {#if !item.startMetronome}
            <input id="hideBpm" type="checkbox" bind:checked={item.hideBpm} /> <span>hide?</span>
        {/if}
        <label for="link1">Hyperlink 1:</label>
        <input id="link1" type='text' placeholder="https://www.youtube.com/" bind:value={item.link1} />
        <input id="link1ActiveTab" type="checkbox" bind:checked={item.link1ActiveTab} /> <span>Activate?</span>
        <label for="link2">Hyperlink 2:</label>
        <input id="link2" type='text' placeholder="https://www.youtube.com/" bind:value={item.link2} />
        <input id="link2ActiveTab" type="checkbox" bind:checked={item.link2ActiveTab} /> <span>Activate?</span>
        <label for="addToSession">Session(s):</label>
        <select id="addToSession" multiple bind:value={item.sessions}>
            {#each $state.sessions as item (item.id)}
            <option value="{item.id}">{item.name}</option>
            {:else}
            <option value="1">Default</option>
            {/each} 
        </select>
    </fieldset>
</form>

<style>
    input, textarea {
        width: 100%;
        margin: 0; 
    }
    textarea {
        height: 4em;
    }
    input[type=number] {
        width: 4em;

    }
    fieldset span {
        font-size: small;
        color: grey;
    }
    label {
        margin-top: 1em;
    }
</style>