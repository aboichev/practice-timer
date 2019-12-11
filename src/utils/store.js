import { writable } from 'svelte/store';

const empty = {
	title: 'Test',
	sessions: [],
	exercises: [{ id: 0, name: "E1"}],
	sessionExercises: {}
};

function readFromStorage() {
	let state = empty;
	try {
        const stored = localStorage.getItem('state');
        state = stored ? JSON.parse(localStorage.getItem('state')) : empty;		
	} catch (err) {
		console.error(err);
    }
	return state;
}

function saveToStorage(state) {
	try {
		localStorage.setItem('state', JSON.stringify(state));		
	} catch (err) {
		console.error(err);
	}	
}

function getNewId(items) {
    if (items.length === 0) {
      return 1;
    }
    const ids = items.map(x => x.id);
    const max = Math.max(...ids);
 
    return max + 1;
};

function buildStore() {

	const state = readFromStorage();

	const { subscribe, set, update } = writable(state);

	return {
        subscribe,
        set: () => {
            saveToStorage(state);
            set(state);
        },
		reset: () => {
            saveToStorage(empty);
            set(readFromStorage());
        },
        exercises: {
            new: (data) => {
                data.id = getNewId(state.exercises);
                state.exercises.push(data);
                saveToStorage(state);
                set(readFromStorage());
            }
        }
	};
}

export const state = buildStore();