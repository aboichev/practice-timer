import { writable } from 'svelte/store';
import { sessions } from './sessionStore.js';

const empty = {
    name: null,
    description: null,
    duration: {
        mins: 5,
        secs: 0
    },
    bpm: 120,
    sessions: []
};

function buildExerciseStore() {

    let items = [];

    try {
		items = JSON.parse(localStorage.getItem('exercises')) || [];
	} catch (err) {
		items = [];
    }

    const { subscribe, set } = writable(items);
    
    const save = () => {
        try {
            sessions.updateExercises(items);
            localStorage.setItem('exercises', JSON.stringify(items));
            set(items);
        } catch (err) {
            console.error(err);
        }
    };

    const getNewId = () => {
        if (items.length === 0) {
          return 1;
        }
        const ids = items.map(x => x.id);
        const max = Math.max(...ids);
     
        return max + 1;
    };

	return {
        subscribe,
        getById: (id) => {
            let item = null;

            if (!id) {
                item = empty;
            }
            else {
                item = items.find(x => x.id.toString() === id) || empty;
            }
            return item;
        },
		upsert: (item) => {
            if (!item.id) {
                item.id = getNewId();
                items = [item, ...items];
            }
            else {
                items = items.map(i => {
                    if (i.id == item.id) {
                        i = item;
                    }
                    return i;
                });
            }
            save();
        },      
        delete: (id) => {
            items = items.filter(i => i.id !== id);
            save();
        }, 
        removeSession: (id) => {
            for(const exercise of items) {
                exercise.sessions = exercise.sessions.filter(x => x !== id);
            }
            save();
        }
	};
}

export const exercises = buildExerciseStore();