
<script>
	import TabNav from './components/TabNav.svelte'
	import { activeRoute } from './utils/route.js'
	import { title } from './utils/store.js';
</script>

<header>
	<h1>Practice Timer: {$title}</h1>
	<TabNav activeTab={$activeRoute.tabName} />
</header>
<main>
	<svelte:component this={$activeRoute.component} {...$activeRoute.props}  />
</main>

<style>
	main {
		padding: 1em;
		margin: 0 auto;
		background-color: rgb(228, 226, 226);
	}
</style>