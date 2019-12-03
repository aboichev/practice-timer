<script>
    import { sessions } from '../utils/sessionStore.js'
    import { fade } from 'svelte/transition';

    export let id = null;

    const isNew = id == null;
    let item = null;

    const empty = {
        name: null
    };

    if (isNew) {
        item = empty;
    }
    else {
        item = $sessions.find(x => x.id.toString() === id) || empty;
    }   

    function save () {
       sessions.upsert(item);
       backToList();
    }

    function backToList() {
        window.location.hash = '#/sessions';
    }

</script>

<div in:fade="{{ duration: 900 }}">
    <label for="name">Name:</label>
    <input id="name" type='text' bind:value={item.name} />

    <button on:click="{save}">Save</button>
    <button on:click="{backToList}">Cancel</button>
</div>