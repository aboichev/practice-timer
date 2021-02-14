<script>
    import { fade } from 'svelte/transition';
</script>

<article transition:fade|local>
    <div class="row">
        <div class="firstCol">
            <slot name="firstColumn"></slot>
        </div>
        <div class="middleCol">
            <slot name="midColumn"></slot>
            <div class="bottom">
                <slot name="description"></slot>
            </div>
        </div>
        <div class="lastCol">
            <slot name="lastColumn"></slot>
        </div>
    </div>
</article>

<style>
    article {
        border-bottom: solid 1px white;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: 100%;
    }

    .firstCol {
        width: 200px;
    }
    .middleCol {
        display: flex;
        flex-direction: column;
        flex-basis: 70%;
        flex: 1;
    }
    .lastCol {
        width: 100px;
    }
    .bottom {
        padding-top: 10px;
        color: #b9b9b9;
        font-size: 1.0em;
    }
</style>