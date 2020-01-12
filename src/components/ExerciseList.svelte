<script>
    import { state } from '../utils/store.js'
    import { fade } from 'svelte/transition';
    import Card from './Card.svelte';
</script>

<div in:fade="{{ duration: 900 }}">
    <div>
        <a href="#/exercises/new">Add New</a>
    </div>
    {#each $state.exercises as item (item.id)}
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
    {/each}
</div>