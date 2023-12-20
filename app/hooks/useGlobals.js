import { create } from 'zustand';

const useGlobals = create((set) => ({
  isSidebarOpen: true,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  currentBoard: 'Platform Launch',
  setCurrentBoard: (boardName) => set({ currentBoard: boardName }),

  chosenTask: {
    id: '',
    title: '',
    description: '',
    status: '',
    subtasks: [],
    completedSubtasks: 0,
  },
  setChosenTask: (id, title, description, status, subtasks, completedSubtasks) =>
    set({
      chosenTask: {
        id: id,
        title: title,
        description: description,
        status: status,
        subtasks: subtasks,
        completedSubtasks: completedSubtasks,
      },
    }),

  isAnyModalOpen: false,
  openAnyModalOpen: () => set({ isAnyModalOpen: true }),
  closeAnyModalOpen: () => set({ isAnyModalOpen: false }),

  fetchedBoards: { boards: [] },
  hasChanged: false,
  setHasChanged: (change) => set({ hasChanged: change ? false : true }),
  setFetchedBoards: (data) => set({ fetchedBoards: { boards: data } }),
}));

export default useGlobals;
