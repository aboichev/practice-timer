<script>
    export let activeTab = 'recent';
</script>

<nav>
    <ul>
        <li class:active="{activeTab === 'recent'}">
            <a href="#/recent">Recent</a>
        </li>
        <li class:active="{activeTab === 'exercises'}">
            <a href="#/exercises">Exercises</a>
        </li>				
        <li class:active="{activeTab === 'sessions'}">
            <a href="#/sessions">Sessions</a>
        </li>
    </ul>
</nav>

<style>
	nav ul { 
		background-color: rgb(140, 167, 209); 
		list-style: none; 
		margin: 0; 
		padding: 0.1em; 
		display: flex; 
	}

	nav li {
		margin-right: 1em;
		flex: 1;	
	}

	nav a {
		color: rgb(196, 224, 253);
		text-decoration: none;
		text-transform: uppercase;
	}

	nav a:hover {
		text-decoration: none;
	}

	nav a:visited {
		color: rgb(196, 224, 253);
    }
    
	.active {
		border-bottom: 3px solid #fff;
	}
</style>