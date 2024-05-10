'use client';

import { useEffect } from 'react';
import TasksContainer from './TasksContainer';

import useGlobals from '../hooks/useGlobals';
import useEditBoardModal from '../hooks/board/useEditBoardModal';

import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();
  const globals = useGlobals();

  const sidebar = globals.isSidebarOpen;
  const currentBoard = globals.currentBoard;
  const editBoardModal = useEditBoardModal();

  //Fetch boards from database
  useEffect(() => {
    const fetchBoards = async () => {
      const response = await fetch('/api/board');
      const data = await response.json();

      globals.setFetchedBoards(data);
    };

    fetchBoards();
    router.push('/');
  }, [globals.hasChanged]);

  const fetchedBoards = globals.fetchedBoards;

  const board = fetchedBoards.boards.filter((board) => board.name === currentBoard);
  const cols = board.map((item) => item.columns);
  const columns = cols[0];

  return (
    <div className={`bg-veryDarkGray p-8 flex sm:flex-row flex-col sm:items-start items-center sm:gap-6 gap-16 h-full overflow-x-auto translate duration-300 ${sidebar ? 'lg:max-w-[80vw] max-w-full' : 'max-w-full'}`}>
      {columns && columns.length !== 0 ? (
        columns.map((column, index) => (
          <TasksContainer
            key={index}
            stage={column.name}
            tasks={column.tasks}
          />
        ))
      ) : (
        <div
          onClick={() => editBoardModal.onOpen()}
          className="lg:h-[80vh] h-screen w-full bg-[#2B2C37] rounded-lg flex justify-center items-center px-8 translate duration-300 hover:cursor-pointer hover:bg-[#2B2C37]/50"
        >
          <p className="text-[24px] text-mediumGray font-semibold">+ New Column</p>
        </div>
      )}
    </div>
  );
};

export default Home;
