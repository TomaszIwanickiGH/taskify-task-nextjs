'use client';

import { useState, useEffect } from 'react';

import Image from 'next/image';
import { images } from '../constants';

const MenuActions = ({ editMesage, deleteMessage, toggle, handleToggle, handleClose, handleEdit, handleDelete, position = 'md:top-[55px] top-[45px]' }) => {
  const [showMenu, setShowMenu] = useState(toggle);

  useEffect(() => {
    setShowMenu(toggle);
  }, [toggle]);

  const onToggle = () => {
    setTimeout(() => {
      handleToggle();
    }, 200);
    setShowMenu((prev) => !prev);
  };

  return (
    <div className="relative">
      <div>
        <Image
          onClick={onToggle}
          src={images.iconVerticalEllipsis}
          alt="menu"
          className="hover:cursor-pointer p-2 hover:scale-95"
          width={21}
          height={21}
        />
      </div>
      <div
        className={`translate absolute
      ${showMenu ? `opacity-100 ${position} translate-x-[-200px] z-[40] duration-500` : 'opacity-0 translate-y-0 z-[-40] duration-200 sm:translate-x-[0px] translate-x-[-400px]'}`}
      >
        {
          <div className={`absolute bg-veryDarkGray p-4 rounded-lg flex flex-col gap-3 w-[200px] border-[1px] border-gray`}>
            <p
              onClick={() => {
                handleClose();
                handleEdit();
                window.scrollTo(0, 0);
              }}
              className="text-mediumGray hover:text-lightGray hover:cursor-pointer"
            >
              {editMesage}
            </p>
            <p
              onClick={() => {
                handleClose();
                handleDelete();
                window.scrollTo(0, 0);
              }}
              className="text-red hover:text-lightRed hover:cursor-pointer"
            >
              {deleteMessage}
            </p>
          </div>
        }
      </div>
    </div>
  );
};

export default MenuActions;
