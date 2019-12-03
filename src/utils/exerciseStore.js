import { writable } from 'svelte/store';

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
            localStorage.setItem('exercises', JSON.stringify(items));
            set(items);
        } catch (err) {
            // noop
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
        }
	};
}

export const exercises = buildExerciseStore();