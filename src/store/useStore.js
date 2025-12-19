import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set, get) => ({
            // Published results
            results: [],

            // Admin authentication
            isAuthenticated: false,

            // Add a new result
            addResult: (result) => {
                const newResult = {
                    ...result,
                    id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    timestamp: new Date().toISOString(),
                };
                set((state) => ({
                    results: [newResult, ...state.results],
                }));
            },

            // Edit an existing result
            editResult: (id, updatedData) => {
                set((state) => ({
                    results: state.results.map((result) =>
                        result.id === id
                            ? { ...result, ...updatedData, editedAt: new Date().toISOString() }
                            : result
                    ),
                }));
            },

            // Delete a result
            deleteResult: (id) => {
                set((state) => ({
                    results: state.results.filter((result) => result.id !== id),
                }));
            },

            // Get team scores
            getTeamScores: () => {
                const results = get().results;
                const scores = {
                    team1: 0,
                    team2: 0,
                };

                results.forEach((result) => {
                    if (result.teamId && result.points) {
                        scores[result.teamId] = (scores[result.teamId] || 0) + result.points;
                    }
                });

                return scores;
            },

            // Authentication
            login: (password) => {
                // Hardcoded password - in production, use environment variable
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

            // Export results as JSON
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

            // Import results from JSON
            importResults: (jsonData) => {
                try {
                    const parsedData = JSON.parse(jsonData);
                    if (Array.isArray(parsedData)) {
                        set({ results: parsedData });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Import failed:', error);
                    return false;
                }
            },

            // Clear all results
            clearAllResults: () => {
                set({ results: [] });
            },
        }),
        {
            name: 'fest-results-storage',
            partialize: (state) => ({
                results: state.results,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useStore;
