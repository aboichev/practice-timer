<script>
    import { title, state } from '../utils/store.js';
    import { fade } from 'svelte/transition';
    import Card from './Card.svelte';
    import { onMount } from 'svelte';

	onMount(async () => {
        title.set('My Sessions');
	});

</script>

<div in:fade="{{ duration: 900 }}">
    <div>
        <a href="#/sessions/new">Add New</a>
    </div>
    {#each $state.sessions as item (item.id)}
        <Card>
            <span slot="firstColumn"><a href="#/sessions/edit/{item.id}">{item.name}</a></span>
            <span slot="midColumn">{item.description}</span>
            <span slot="lastColumn">{item.exercises.length} exercise(s)</span>
        </Card>
    {/each}
</div>