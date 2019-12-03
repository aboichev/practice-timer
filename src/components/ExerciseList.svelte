<script>
    import { exercises } from '../utils/exerciseStore.js'
    import { fade } from 'svelte/transition';
</script>
<div in:fade="{{ duration: 900 }}">
    <div>
        <a href="#/exercises/new">Add New</a>
    </div>
    <ul>
    {#each $exercises as item (item.id)}
        <li transition:fade|local>
            <a href="#/exercises/edit/{item.id}">
                <div class="row">
                    <div class="firstCol">{item.name}</div>
                    <div class="middleCol">
                        {item.duration.mins} mins
                        {#if item.duration.secs}
                            {item.duration.secs} secs
                        {/if}
                    </div>
                    <div class="lastCol">
                        {item.bpm} bpm
                    </div>                    
                </div>
                {#if item.description}
                <div>
                    {item.description}
                </div>        
                {/if}
            </a>
        </li>
    {/each}
    </ul>
</div>

<style>
    a {
        text-decoration: none;
        color: #63abfd;
    }
	a:hover {
		text-decoration: none;
	}

	a:visited {
		color: #63abfd;
    }    
    ul {
        margin: 0;
        padding: 0;
    }
    li {
        list-style: none;
        margin-top: 0.6em;
        border-bottom: 1px solid rgb(185, 185, 185);
    }
    
    .row {
       display: flex;
       flex-direction: row;
    }
    .firstCol {
        margin-right: auto;
    }
    .middleCol {
        width: 200px;
    }
    .lastCol {
        width: 100px;
    }
</style>