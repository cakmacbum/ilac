import { create } from 'zustand';
import localforage from 'localforage';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: number;
  times: string[]; // e.g., ["09:00", "21:00"]
  history: { date: string; time: string; status: 'taken' | 'missed' }[];
}

interface MedicationState {
  medications: Medication[];
  isLoaded: boolean;
  addMedication: (med: Omit<Medication, 'id' | 'history'>) => void;
  removeMedication: (id: string) => void;
  markAsTaken: (id: string, date: string, time: string) => void;
  markAsMissed: (id: string, date: string, time: string) => void;
  loadMedications: () => Promise<void>;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: [],
  isLoaded: false,

  loadMedications: async () => {
    const stored = await localforage.getItem<Medication[]>('medications');
    if (stored) {
      set({ medications: stored, isLoaded: true });
    } else {
      set({ isLoaded: true });
    }
  },

  addMedication: async (med) => {
    const newMed: Medication = {
      ...med,
      id: crypto.randomUUID(),
      history: [],
    };
    const updated = [...get().medications, newMed];
    set({ medications: updated });
    await localforage.setItem('medications', updated);
  },

  removeMedication: async (id) => {
    const updated = get().medications.filter((m) => m.id !== id);
    set({ medications: updated });
    await localforage.setItem('medications', updated);
  },

  markAsTaken: async (id, date, time) => {
    const updated = get().medications.map((m) => {
      if (m.id === id) {
        // Remove existing entry for this date/time if any
        const history = m.history.filter(h => !(h.date === date && h.time === time));
        return {
          ...m,
          history: [...history, { date, time, status: 'taken' as const }],
        };
      }
      return m;
    });
    set({ medications: updated });
    await localforage.setItem('medications', updated);
  },

  markAsMissed: async (id, date, time) => {
    const updated = get().medications.map((m) => {
      if (m.id === id) {
        const history = m.history.filter(h => !(h.date === date && h.time === time));
        return {
          ...m,
          history: [...history, { date, time, status: 'missed' as const }],
        };
      }
      return m;
    });
    set({ medications: updated });
    await localforage.setItem('medications', updated);
  },
}));
