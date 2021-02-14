<script>
    import { title, state } from '../utils/store.js'
    import { fade } from 'svelte/transition';
    import Card from './Card.svelte';
    import Metronome from './Metronome.svelte';
    import { onMount } from 'svelte';

	onMount(async () => {
        title.set('My Exercises');
    });

    function save (item) {
        console.log('new bpm', item.bpm)
        state.exercises.upsert(item);
    }
</script>

<div in:fade="{{ duration: 900 }}">
    <div>
        <a href="#/exercises/new">Add New</a>
    </div>
    {#each $state.exercises as item (item.id)}
        <Card href="#/exercises/edit/{item.id}">
            <span slot="firstColumn">
                <strong>{item.duration.mins}</strong> mins
                {#if item.duration.secs}
                    &nbsp; <strong>{item.duration.secs}</strong> secs
                {/if}
                {#if !item.hideBpm}
                    <Metronome excersise={item} on:bpmChange={() => save(item)} />
                {/if}
            </span>
            <span slot="midColumn">
                <strong>{item.name}</strong>
            </span>
            <span slot="lastColumn">[ <a href="#/exercises/edit/{item.id}">Edit</a> ]</span>
            <span slot="description">
                {item.description || ''}
            </span>
        </Card>
    {/each}
</div>