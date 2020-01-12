<script>
    import { state } from '../utils/store.js';
    import { fade } from 'svelte/transition';
    import Card from './Card.svelte';
</script>

<div in:fade="{{ duration: 900 }}">
    <div>
        <a href="#/sessions/new">Add New</a>
    </div>
    {#each $state.sessions as item (item.id)}
        <Card href="#/sessions/edit/{item.id}">
            <span slot="title">{item.name}</span>
            <span slot="lastColumn">{item.exercises.length} exercise(s)</span>
        </Card>
    {/each}
</div>