'use client';

import { useEffect } from 'react';
import TasksContainer from './TasksContainer';

import useGlobals from '../hooks/useGlobals';

const Home = () => {
  const globals = useGlobals();

  const sidebar = globals.isSidebarOpen;
  const currentBoard = globals.currentBoard;

  //Fetch boards from database
  useEffect(() => {
    const fetchBoards = async () => {
      const response = await fetch('/api/board');
      const data = await response.json();

      globals.setFetchedBoards(data);
    };

    fetchBoards();
  }, [globals.hasChanged]);

  const fetchedBoards = globals.fetchedBoards;

  const board = fetchedBoards.boards.filter((board) => board.name === currentBoard);
  const columns = board.map((item) => item.columns);

  return (
    <div className={`bg-veryDarkGray p-8 flex sm:flex-row flex-col sm:items-start items-center sm:gap-6 gap-16 h-full overflow-x-auto translate duration-300 ${sidebar ? 'lg:max-w-[80vw] max-w-full' : 'max-w-full'}`}>
      {columns.map((column) =>
        column.map((item, index) => {
          return (
            <TasksContainer
              key={index}
              stage={item.name}
              tasks={item.tasks}
            />
          );
        })
      )}
    </div>
  );
};

export default Home;
