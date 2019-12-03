<script>
    import { exercises } from '../utils/exerciseStore.js'
    import { fade } from 'svelte/transition';

    export let id = null;

    const isNew = id == null;
    let item = null;

    const empty = {
        name: null,
        description: null,
        duration: {
            mins: 5,
            secs: 0
        },
        bpm: 120
    };

    if (isNew) {
        item = empty;
    }
    else {
        item = $exercises.find(x => x.id.toString() === id) || empty;
    }   

    function save () {
        exercises.upsert(item);
        backToList();
    }

    function deleteItem () {
        exercises.delete(item.id);
        backToList();
    }

    function backToList() {
        window.location.hash = '#/exercises';
    }

</script>

<form>
    <fieldset in:fade="{{ duration: 900 }}">
    <legend>{`${isNew ? 'Add New' : 'Edit'} Exercise`}</legend>
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
        <label for="link2">Hyperlink 2:</label>
        <input id="link2" type='text' placeholder="https://www.youtube.com/" bind:value={item.link2} />
        
        <div class="panel">
            <button on:click="{save}">Save</button>
            {#if !isNew}
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

