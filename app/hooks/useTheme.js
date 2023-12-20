import { create } from 'zustand';

const useTheme = create((set) => ({
  mode: 'dark',
  toggleMode: (currentMode) => set({ mode: currentMode === 'light' ? 'dark' : 'light' }),
}));

export default useTheme;
