<script>
	import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    function handleUp() {
        dispatch('move', {
            direction: 'up'
        });
    }

    function handleDown() {
        dispatch('move', {
            direction: 'down'
        });
    }

</script>

<div class="row">
    <div class="left">
        <slot></slot>
    </div>
    <div class="right">
        [ <button on:click={handleUp}>Move Up</button> ]
        [ <button on:click={handleDown}>Move Down</button> ]
    </div>
</div>

<style>
    .row button {
        background: #e4e2e2;
        border: none;
        padding: 0;
        color: rgb(0,80,160);
    }
    .row button:hover {
        text-decoration: underline;
        cursor: pointer;
    }

    .left {
        float: left;
        width: 80%;
    }

    /* Clear floats after the columns */
    .row:after {
        content: "";
        display: table;
        clear: both;
    }

</style>