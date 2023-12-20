'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import { images } from '../constants';

import useTheme from '../hooks/useTheme';
import useGlobals from '../hooks/useGlobals';
import useAddBoardModal from '../hooks/board/useAddBoardModal';

const Sidebar = ({ mode }) => {
  const theme = useTheme();
  const globals = useGlobals();
  const addBoardModal = useAddBoardModal();

  const [showSidebar, setShowSidebar] = useState(true);

  const handleClose = () => {
    setShowSidebar(false);
    globals.closeSidebar();
  };

  //Fetch boards from database
  const fetchedBoards = globals.fetchedBoards;

  return (
    <>
      <div
        className={`lg:flex hidden flex-col justify-between h-screen py-8 translate duration-500 sticky top-0 
        ${showSidebar ? 'border-r-[1px] border-r-neutral-700 translate-x-0 xl:w-[25%] lg:w-[30%] md:w-[40%]' : '-translate-x-full w-0'}
        ${mode === 'light' ? 'bg-white' : 'bg-darkGray'}`}
      >
        <div
          className={`flex-col gap-8 w-full
          ${showSidebar ? 'flex' : 'hidden'}`}
        >
          <div className="px-8">
            <Image
              src={mode === 'light' ? images.logoLight : images.logoDark}
              alt="logo"
            />
          </div>
          <div className="flex flex-col gap-6">
            <h3 className="text-mediumGray px-8 tracking-[.1rem] text-[13px]">ALL BOARDS ({fetchedBoards.boards.length})</h3>
            <div className="flex flex-col gap-2">
              {fetchedBoards.boards.map((board) => (
                <div
                  key={board.name}
                  className="w-[90%]"
                  onClick={() => globals.setCurrentBoard(board.name)}
                >
                  <div
                    className={`translate duration-200 flex justify-start items-center gap-4 px-8 py-3 rounded-se-full rounded-ee-full hover:cursor-pointer 
                  ${globals.currentBoard === board.name ? 'bg-mainPurple text-white' : 'hover:bg-white bg-transparent text-mediumGray hover:text-mainPurple'}`}
                  >
                    <Image
                      src={globals.currentBoard === board.name ? images.iconBoardWhite : images.iconBoard}
                      alt="board"
                    />
                    <p className="font-bold">{board.name}</p>
                  </div>
                </div>
              ))}
              <div className="w-[90%]">
                <div className={`flex justify-start items-center gap-4 px-8 py-3 rounded-se-full rounded-ee-full  hover:cursor-pointer`}>
                  <Image
                    src={images.iconBoardPurple}
                    alt="board"
                  />
                  <p
                    onClick={() => {
                      addBoardModal.onOpen();
                      window.scrollTo(0, 0);
                    }}
                    className={`text-mainPurple hover:text-lightPurple`}
                  >
                    +Create New Board
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex-col gap-4 w-full
        ${showSidebar ? 'flex' : 'hidden'}`}
        >
          <div className="px-8 py-4">
            <div className="rounded-md bg-veryDarkGray flex justify-center items-center gap-4 py-4">
              <Image
                src={images.iconLightTheme}
                alt="icon"
              />
              <label className="switch">
                <input
                  onClick={() => theme.toggleMode(theme.mode)}
                  type="checkbox"
                  defaultChecked
                />
                <span className="slider round"></span>
              </label>
              <Image
                src={images.iconDarkTheme}
                alt="icon"
              />
            </div>
          </div>
          <div className="w-[90%]">
            <div
              className={`flex justify-start items-center gap-4 px-8 py-3 rounded-se-full rounded-ee-full  hover:cursor-pointer hover:bg-white text-mediumGray hover:text-mainPurple `}
              onClick={handleClose}
            >
              <Image
                src={images.iconHideSidebar}
                alt="board"
              />
              <p className={`font-bold`}>Hide Sidebar</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-10 py-4 w-[60px] ${showSidebar ? 'hidden' : 'md:flex hidden'} justify-center items-center bg-mainPurple hover:bg-lightPurple rounded-se-full rounded-ee-full hover:cursor-pointer`}
        onClick={() => {
          setShowSidebar(true);
          globals.openSidebar();
        }}
      >
        <Image
          className=""
          src={images.iconShowSidebar}
          alt="show"
        />
      </div>
    </>
  );
};

export default Sidebar;
