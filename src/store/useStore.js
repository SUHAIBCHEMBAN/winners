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
            isAuthenticated: false,
            isFirebaseActive: !!db,

            // --- Actions ---

            // Listen for Real-time Updates (Firebase Only)
            subscribeToResults: () => {
                if (!db) return () => { };

                console.log('Subscribing to real-time updates...');
                const q = query(collection(db, 'results'), orderBy('timestamp', 'desc'));

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const fetchedResults = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    set({ results: fetchedResults });
                }, (error) => {
                    console.error("Error fetching updates:", error);
                });

                return unsubscribe;
            },

            // Add Result
            addResult: async (result) => {
                const newResult = {
                    ...result,
                    timestamp: new Date().toISOString(),
                };

                if (db) {
                    try {
                        // Firestore generates unique ID automatically
                        await addDoc(collection(db, 'results'), newResult);
                    } catch (e) {
                        console.error("Error adding document: ", e);
                        alert("Failed to save to cloud. Check console.");
                    }
                } else {
                    // Local Storage Fallback
                    const localResult = {
                        ...newResult,
                        id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    };
                    set((state) => ({
                        results: [localResult, ...state.results],
                    }));
                }
            },

            // Edit Result
            editResult: async (id, updatedData) => {
                const dataPayload = {
                    ...updatedData,
                    editedAt: new Date().toISOString()
                };

                if (db) {
                    try {
                        const resultRef = doc(db, 'results', id);
                        await updateDoc(resultRef, dataPayload);
                    } catch (e) {
                        console.error("Error updating document: ", e);
                    }
                } else {
                    set((state) => ({
                        results: state.results.map((result) =>
                            result.id === id ? { ...result, ...dataPayload } : result
                        ),
                    }));
                }
            },

            // Delete Result
            deleteResult: async (id) => {
                if (db) {
                    try {
                        await deleteDoc(doc(db, 'results', id));
                    } catch (e) {
                        console.error("Error deleting document: ", e);
                    }
                } else {
                    set((state) => ({
                        results: state.results.filter((result) => result.id !== id),
                    }));
                }
            },

            // Clear All
            clearAllResults: async () => {
                if (db) {
                    // Deleting collection is complex in client SDK, usually requires cloud function
                    // or iterating. We'll iterate for simplicity of this fest app.
                    const results = get().results;
                    results.forEach(async (r) => {
                        await deleteDoc(doc(db, 'results', r.id));
                    });
                } else {
                    set({ results: [] });
                }
            },

            // --- Utilities (Same as before) ---

            getTeamScores: () => {
                const results = get().results;
                const scores = { team1: 0, team2: 0 };
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
                const results = get().results;
                const dataStr = JSON.stringify(results, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `results_${new Date().toISOString().split('T')[0]}.json`;
                link.click();
                URL.revokeObjectURL(url);
            },

            importResults: (jsonData) => {
                try {
                    const parsedData = JSON.parse(jsonData);
                    if (Array.isArray(parsedData)) {
                        // For import, we might want to batch write to Firebase if connected
                        // But for safety/simplicity, let's keep import local-only behavior OR
                        // iterate write (slow but works).
                        if (db) {
                            if (!window.confirm("You are importing to the LIVE CLOUD DATABASE. This will add all entries. Continue?")) return false;
                            parsedData.forEach(async (item) => {
                                // Remove ID collision risk
                                const { id, ...cleanItem } = item;
                                await addDoc(collection(db, 'results'), cleanItem);
                            });
                        } else {
                            set({ results: parsedData });
                        }
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Import failed:', error);
                    return false;
                }
            },
        }),
        {
            name: 'fest-results-storage',
            partialize: (state) => ({
                // Even if using Firebase, we cache results locally for speed/offline
                results: state.results,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useStore;
