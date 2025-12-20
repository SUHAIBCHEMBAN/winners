import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    orderBy
} from 'firebase/firestore';

const useStore = create(
    persist(
        (set, get) => ({
            // State
            results: [],
            programs: [],
            teams: [],
            participants: [],
            isAuthenticated: false,
            isFirebaseActive: !!db,

            // --- Actions ---

            // Listen for Real-time Updates (Firebase Only)
            subscribeToData: () => {
                if (!db) return () => { };

                console.log('Subscribing to real-time updates for all collections...');
                
                // Results
                const qResults = query(collection(db, 'results'), orderBy('timestamp', 'desc'));
                const unsubResults = onSnapshot(qResults, (snapshot) => {
                    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    set({ results: fetched });
                });

                // Programs
                const qPrograms = query(collection(db, 'programs')); // Add orderBy if needed
                const unsubPrograms = onSnapshot(qPrograms, (snapshot) => {
                    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Sort locally or in query if needed
                    set({ programs: fetched });
                });

                // Teams
                const qTeams = query(collection(db, 'teams'));
                const unsubTeams = onSnapshot(qTeams, (snapshot) => {
                    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    set({ teams: fetched });
                });

                // Participants
                const qParticipants = query(collection(db, 'participants'));
                const unsubParticipants = onSnapshot(qParticipants, (snapshot) => {
                    const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    set({ participants: fetched });
                });

                return () => {
                    unsubResults();
                    unsubPrograms();
                    unsubTeams();
                    unsubParticipants();
                };
            },

            // --- Generic CRUD Helper ---
            _addItem: async (collectionName, item, stateKey) => {
                const newItem = {
                    ...item,
                    createdAt: new Date().toISOString(),
                };
                if (db) {
                    try {
                        await addDoc(collection(db, collectionName), newItem);
                    } catch (e) {
                        console.error(`Error adding to ${collectionName}: `, e);
                    }
                } else {
                    const localItem = {
                        ...newItem,
                        id: `${collectionName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    };
                    set((state) => ({ [stateKey]: [...state[stateKey], localItem] }));
                }
            },

            _updateItem: async (collectionName, id, updatedData, stateKey) => {
                if (db) {
                    try {
                        const ref = doc(db, collectionName, id);
                        await updateDoc(ref, updatedData);
                    } catch (e) {
                        console.error(`Error updating ${collectionName}: `, e);
                    }
                } else {
                   set((state) => ({
                        [stateKey]: state[stateKey].map((item) =>
                            item.id === id ? { ...item, ...updatedData } : item
                        ),
                    }));
                }
            },

            _deleteItem: async (collectionName, id, stateKey) => {
                if (db) {
                    try {
                        await deleteDoc(doc(db, collectionName, id));
                    } catch (e) {
                        console.error(`Error deleting from ${collectionName}: `, e);
                    }
                } else {
                    set((state) => ({
                        [stateKey]: state[stateKey].filter((item) => item.id !== id),
                    }));
                }
            },

            // --- Specific Actions ---

            // Results
            addResult: (result) => get()._addItem('results', { ...result, timestamp: new Date().toISOString() }, 'results'),
            editResult: (id, data) => get()._updateItem('results', id, { ...data, editedAt: new Date().toISOString() }, 'results'),
            deleteResult: (id) => get()._deleteItem('results', id, 'results'),

            // Programs
            addProgram: (program) => get()._addItem('programs', program, 'programs'),
            updateProgram: (id, data) => get()._updateItem('programs', id, data, 'programs'),
            deleteProgram: (id) => get()._deleteItem('programs', id, 'programs'),

            // Teams
            addTeam: (team) => get()._addItem('teams', team, 'teams'),
            updateTeam: (id, data) => get()._updateItem('teams', id, data, 'teams'),
            deleteTeam: (id) => get()._deleteItem('teams', id, 'teams'),

            // Participants
            addParticipant: (participant) => get()._addItem('participants', participant, 'participants'),
            updateParticipant: (id, data) => get()._updateItem('participants', id, data, 'participants'),
            deleteParticipant: (id) => get()._deleteItem('participants', id, 'participants'),

            // Clear All (Dev/debug)
            clearAllResults: async () => {
                 if (db) {
                    const results = get().results;
                    results.forEach(async (r) => {
                        await deleteDoc(doc(db, 'results', r.id));
                    });
                } else {
                    set({ results: [] });
                }
            },

            // Data Seeding (Migration)
            seedDatabase: async (programsData, teamsData, participantsData) => {
                if (!db) return;
                console.log("Seeding database...");
                
                // Helper to check if exists to avoid duplicates could be added, but for simple seed we just add.
                // BETTER: Check if collections are empty? Or just rely on user clicking "Seed" once.
                
                for (const p of programsData) {
                    await addDoc(collection(db, 'programs'), p);
                }
                for (const t of teamsData) {
                     await addDoc(collection(db, 'teams'), t);
                }
                for (const p of participantsData) {
                     await addDoc(collection(db, 'participants'), p);
                }
                alert("Database seeded successfully!");
            },

            // --- Utilities ---

            getTeamScores: () => {
                const results = get().results;
                const scores = {};
                // Initialize scores for known teams (if available) or wait for results
                const teams = get().teams;
                teams.forEach(t => scores[t.id] = 0);

                results.forEach((result) => {
                    if (result.teamId && result.points) {
                        scores[result.teamId] = (scores[result.teamId] || 0) + result.points;
                    }
                });
                return scores;
            },

            login: (password) => {
                const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'Madin_Shuhada@admin';
                if (password === ADMIN_PASSWORD) {
                    set({ isAuthenticated: true });
                    return true;
                }
                return false;
            },

            logout: () => {
                set({ isAuthenticated: false });
            },

            exportResults: () => {
                const { results, programs, teams, participants } = get();
                const data = { results, programs, teams, participants };
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `cms_backup_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
            },

            importResults: (jsonData) => { /* ... existing import logic usually just for results, can update for full backup restore later if needed */ },
        }),
        {
            name: 'fest-results-storage',
            partialize: (state) => ({
                results: state.results,
                programs: state.programs,
                teams: state.teams,
                participants: state.participants,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useStore;
