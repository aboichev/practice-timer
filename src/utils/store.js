import { writable } from 'svelte/store';

const defaultSession = {
    name: 'Untitled Session',
    description: '',
    exercises: []
};

const defaultState = {
	sessions: [defaultSession],
    exercises: [],
    currentSession: {
        inProgress: false,
        sessionId: null,
        exerciseIndex: 0
    }
};

const defaultExcercise = {
    name: '', 
    description: '',
    duration: {
        mins: 5,
        secs: 0,
    },
    bpm: 60,
    startMetronome: false,
    hideBpm: false,
    link1: null,
    link1ActiveTab: false,
    link2: null,
    link2ActiveTab: false,
    sessions: []
};

function readFromStorage() {
	let state = Object.assign({}, defaultState);
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

function syncSessions(state) {
    for (const session of state.sessions) {
        // remove exercises which are no longer associated
        session.exercises = session.exercises.filter(
                                s => state.exercises.find(
                                        y => 
                                          y.id === s 
                                          && y.sessions.find(z => session.id === z) !== undefined
                                    ) !== undefined);
        // add exercises not found in session
        const exercisesBySessionId = state.exercises.filter(x => x.sessions.find(y => y === session.id));
        for (const exercise of exercisesBySessionId) {
            const notInSession = session.exercises.find(x => x === exercise.id) === undefined;
            if (notInSession) {
                session.exercises = [...session.exercises, exercise.id];
            }
        }
    }
}

function getDefaultItem(defaultItem, existingItems, propName = 'name') {
    const newItem = Object.assign({}, defaultItem);
    
    const numOfDefaultNames = existingItems.filter(x => x[propName].startsWith(defaultItem[propName])).length;
    if (numOfDefaultNames > 0) {
        newItem[propName] = `${newItem[propName]} ${numOfDefaultNames + 1}`;
    }

    return newItem;
}

function getSessionById(state, id) {
    const item = state.sessions.find(x => x.id == id) || getDefaultItem(defaultSession, state.sessions);

    item.listOfExercises = item.exercises.map(exerciseId => state.exercises.find(x => x.id === exerciseId));
    return item;
}

function getCurrentSession(state) {
    const session = getSessionById(state, state.currentSession.sessionId);
    return { 
        ...session,
        inProgress: state.currentSession.inProgress
    };
}

function getCurrentExercise(state) {
    if (!state.currentSession.inProgress) {
        return { 
            inProgress: false
        };
    }

    const session = getCurrentSession(state);

    return { 
        ...session.listOfExercises[state.currentSession.exerciseIndex],
        sessionName: session.name,
        inProgress: session.inProgress
    };
}

function buildStore() {
	const state = readFromStorage();

	const { subscribe, set } = writable(state);

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
            getById: (id) => {
                return state.exercises.find(x => x.id == id) || Object.assign({}, defaultExcercise);
            },
            upsert: (item) => {
                if (!item.id) {
                    item.id = getNewId(state.exercises);
                    state.exercises = [item, ...state.exercises];
                }
                else {
                    state.exercises = state.exercises.map(i => {
                        if (i.id == item.id) {
                            i = item;
                        }
                        return i;
                    });
                }
                syncSessions(state);
                saveToStorage(state);
                set(readFromStorage());
            },      
            delete: (id) => {
                state.exercises = state.exercises.filter(i => i.id !== id);
                saveToStorage(state);
                set(readFromStorage());
            }, 
        },
        sessions: {
            getById: (id) => {
                return getSessionById(state, id);
            },
            upsert: (item) => {

                if (!item.id) {
                    item.id = getNewId(state.sessions);
                    state.sessions = [item, ...state.sessions];
                }
                else {
                    item.exercises = item.listOfExercises.map(x => x.id);
                    item.listOfExercises = [];
                    state.sessions = state.sessions.map(i => {
                        if (i.id == item.id) {
                            i = item;
                        }
                        return i;
                    });
                }
                saveToStorage(state);
                set(readFromStorage());
                item = getSessionById(state, item.id);
            },
            delete: (id) => {
                state.sessions = state.sessions.filter(i => i.id !== id);
                for(const exercise of state.exercises) {
                    exercise.sessions = exercise.sessions.filter(x => x !== id);
                }
                saveToStorage(state);
                set(readFromStorage());
            },
        },
        currentSession: {
            get: () => getCurrentExercise(state),
            start: (id) => {
                state.currentSession = {
                    inProgress: true,
                    sessionId: id,
                    exerciseIndex: 0
                };
                saveToStorage(state);
                set(readFromStorage());
            },
            next: () => {
                const session = getCurrentSession(state);
                if (state.currentSession.exerciseIndex < session.listOfExercises.length - 1) {
                    state.currentSession.exerciseIndex += 1;
                }
                else {
                    state.currentSession = {
                        inProgress: false
                    };
                }

                saveToStorage(state);
                set(readFromStorage());

                return getCurrentExercise(state);
            },
            stop: () => {
                state.currentSession = {
                    inProgress: false,
                    exerciseIndex: 0,
                }
                saveToStorage(state);
                set(readFromStorage());
            }
        }
	};
}

export const state = buildStore();

export const title = writable('');