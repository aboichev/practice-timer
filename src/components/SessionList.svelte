<script>
    import { sessions } from '../utils/sessionStore.js'
    import { fade } from 'svelte/transition';

    function remove(id) {
        sessions.delete(id);
    }

</script>
<div in:fade="{{ duration: 900 }}">
    <div>
        <a href="#/sessions/new">Add New</a>
    </div>

    <table>
    {#each $sessions as item (item.id)}
        <tr transition:fade|local>
            <td>{item.name}</td>
            <td align="right">[<a href="#/sessions/edit/{item.id}">Edit</a>]</td>
            <td align="right"><button on:click={() => remove(item.id)}>Remove</button></td>         
        </tr>		
    {/each}
    </table>
</div>

<style>
    table {
       width: 100%
    }
</style>