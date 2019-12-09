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
    <div class="arrows">
        <div>
            <button on:click={handleUp}>
                <svg width=48 height=12 viewBox="0 0 4 1">
                    <polygon fill="black" points="2,0 4,1 0,1" />
                </svg>
            </button>
        </div>
        <div>
            <button on:click={handleDown}>
                <svg width=48 height=12 viewBox="0 0 4 1">
                    <polygon fill="black" points="2,1 4,0 0,0" />
                </svg>
            </button>
        </div>
    </div>
    <div class="content">
        <slot></slot>
    </div>
</div>

<style>
    .row {
       display: flex;
       flex-direction: row;
    }
    .content {
        margin-right: auto;
    }
    .arrows {
        width: 200px;
    }
</style>