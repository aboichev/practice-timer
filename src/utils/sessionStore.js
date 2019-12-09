import { writable } from 'svelte/store';

function buildSessionStore() {

    const defaultSession = [{
        id: 1,
        name: 'My Daily Practice',
        exercises: []
    }];

    let items = [];

    try {
		items = JSON.parse(localStorage.getItem('sessions')) || defaultSession;
	} catch (err) {
		items = [];
    }

    const { subscribe, set } = writable(items);
    
    const save = () => {
        try {
            localStorage.setItem('sessions', JSON.stringify(items));
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
        },
        updateExercises: (exercises) => {
            for (const session of items) {
                // remove exercises which are no longer associated
                session.exercises = session.exercises.filter(
                                        x => exercises.find(
                                                y => 
                                                y.id === x 
                                                && y.sessions.find(z => session.id === z) !== undefined
                                            ) !== undefined);
                // add exercises not found in session
                const exercisesBySessionId = exercises.filter(x => x.sessions.find(y => y === session.id));
                for (const exercise of exercisesBySessionId) {
                    const notInSession = session.exercises.find(x => x === exercise.id) === undefined;
                    if (notInSession) {
                        session.exercises = [...session.exercises, exercise.id];
                    }
                }
            }
            save();
        }
	};
}

export const sessions = buildSessionStore();

