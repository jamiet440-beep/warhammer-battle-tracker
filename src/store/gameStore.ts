import { create } from 'zustand';
import type { ParsedArmy } from '../utils/battlescribeParser';

interface GameState {
  army: ParsedArmy | null;
  commandPoints: number;
  victoryPoints: number;
  setArmy: (army: ParsedArmy) => void;
  incrementCP: () => void;
  decrementCP: () => void;
  incrementVP: () => void;
  decrementVP: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  army: null,
  commandPoints: 0,
  victoryPoints: 0,
  setArmy: (army) => set({ army }),
  incrementCP: () => set((state) => ({ commandPoints: state.commandPoints + 1 })),
  decrementCP: () => set((state) => ({ commandPoints: Math.max(0, state.commandPoints - 1) })),
  incrementVP: () => set((state) => ({ victoryPoints: state.victoryPoints + 1 })),
  decrementVP: () => set((state) => ({ victoryPoints: Math.max(0, state.victoryPoints - 1) })),
}));
