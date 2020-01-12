<script>
    import { state } from '../utils/store.js'
    import { fade } from 'svelte/transition';

    export let id = null;
    
    const item = state.exercises.getById(id);

    function save () {
        state.exercises.upsert(item);
        backToList();
    }

    function deleteItem () {
        state.exercises.delete(item.id);
        backToList();
    }

    function backToList() {
        window.location.hash = '#/exercises';
    }

</script>

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
        <label for="bpm">Metronome:</label>
        <input id="bpm" type="range" min=30 step=5 max=300 bind:value={item.bpm} /> <span>{item.bpm} BPM</span>
        <label for="link1">Hyperlink 1:</label>
        <input id="link1" type='text' placeholder="https://www.youtube.com/" bind:value={item.link1} />
        <textarea id="embed1" placeholder="embed code" bind:value={item.embed1}></textarea>
        <label for="link2">Hyperlink 2:</label>
        <input id="link2" type='text' placeholder="https://www.youtube.com/" bind:value={item.link2} />

        <label for="addToSession">Session(s):</label>
        <select id="addToSession" multiple bind:value={item.sessions}>
            {#each $state.sessions as item (item.id)}
            <option value="{item.id}">{item.name}</option>
            {:else}
            <option value="1">Default</option>
            {/each} 
        </select>
        <div class="panel">
            <button on:click="{save}">Save</button>
            {#if !(id === null)}
            <button on:click="{deleteItem}">Delete</button>
            {/if}
            <button on:click="{backToList}">Cancel</button>  
        </div>
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
    .panel {
        margin-top: 2em;
    }
</style>