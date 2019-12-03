import { readable } from 'svelte/store';
import Recent from '../components/Recent.svelte'
import ExerciseList from '../components/ExerciseList.svelte'
import ExerciseForm from '../components/ExerciseForm.svelte'
import SessionList from '../components/SessionList.svelte'
import SessionForm from '../components/SessionForm.svelte'

const defaultRoute = {
    tabName: 'recent',
    component: Recent
}

export const activeRoute = readable(defaultRoute, function start(set) {

    const updateActiveView = () => {
        const hash = window.location.hash;
        if (window.location.hash === '#/recent') {
            set(defaultRoute);
        } else if (window.location.hash === '#/exercises') {
            set({
                tabName: 'exercises',
                component: ExerciseList
            });
        } else if (hash === '#/exercises/new') {
            set({
                tabName: 'exercises',
                component: ExerciseForm,
            });
        } else if (hash.startsWith('#/exercises/edit/')) {
            set({
                tabName: 'exercises',
                component: ExerciseForm,
                props: { id: hash.substring('#/exercises/edit/'.length) }
            });
        } else if (hash === '#/sessions') {
            set({
                tabName: 'sessions',
                component: SessionList
            });
        } else if (hash === '#/sessions/new') {
            set({
                tabName: 'sessions',
                component: SessionForm
            });
        } else if (hash.startsWith('#/sessions/edit/')) {
            set({
                tabName: 'sessions',
                component: SessionForm,
                props: { id: hash.substring('#/sessions/edit/'.length) }
            });
        }
    };
    window.addEventListener('hashchange', updateActiveView);
    updateActiveView();

	return function stop() {
        window.removeEventListener('hashchange', updateActiveView);
	};
});

