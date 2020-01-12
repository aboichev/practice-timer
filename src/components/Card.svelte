<script>
    import { fade } from 'svelte/transition';
    export let href = null;
</script>

<article transition:fade|local>
    {#if href}
        <a href="{href}">
            <div class="row">
                <div class="firstCol">
                    <slot name="title"></slot>
                </div>
                <div class="middleCol">
                    <slot name="midColumn"></slot>
                </div>
                <div class="lastCol">
                    <slot name="lastColumn"></slot>
                </div>                    
            </div>
            <div>
                <slot name="description"></slot>
            </div>
        </a>
    {:else}
        <div class="row">
            <div class="firstCol">
                <slot name="title"></slot>
            </div>
            <div class="middleCol">
                <slot name="midColumn"></slot>
            </div>
            <div class="lastCol">
                <slot name="lastColumn"></slot>
            </div>                    
        </div>
        <div>
            <slot name="description"></slot>
        </div>
    {/if}
</article>

<style>
    article a {
        text-decoration: none;
        color: #63abfd;
    }
	article a:hover {
		text-decoration: none;
	}

	article a:visited {
		color: #63abfd;
    }    
    
    article {
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