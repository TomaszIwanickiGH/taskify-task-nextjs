'use client';

import { useState, useEffect } from 'react';

import useEditBoardModal from '../../../hooks/board/useEditBoardModal';

import CustomInput from '../../CustomInput';
import useGlobals from '../../../hooks/useGlobals';
import { data } from '../../../constants';

import { toast } from 'react-hot-toast';

const EditBoardModal = () => {
  const globals = useGlobals();
  const editBoardModal = useEditBoardModal();

  const currentBoard = globals.currentBoard;
  const board = data.boards.filter((board) => board.name === currentBoard);
  const columns = board.map((item) => item.columns);

  const [toggleStatus, setToggleStatus] = useState(false);
  const [showModal, setShowModal] = useState(editBoardModal.isOpen);

  useEffect(() => {
    setShowModal(editBoardModal.isOpen);
    setToggleStatus(toggleStatus);
  }, [editBoardModal.isOpen, toggleStatus]);

  if (!editBoardModal.isOpen) {
    return null;
  }

  const handleClose = () => {
    setShowModal(false);
    setToggleStatus(false);

    setTimeout(() => {
      editBoardModal.onClose();
      toast.success('Board edited successfully!');
    }, 500);
  };

  if (showModal) {
    document.body.classList.add('toggle-overflow');
  } else {
    document.body.classList.remove('toggle-overflow');
  }

  return (
    <div className="relative bg-neutral-800/70 h-screen">
      <div
        className={`absolute right-0 left-0 m-auto max-w-[500px] px-8 translate
        ${showModal ? 'top-[50%] translate-y-[-50%] opacity-100 duration-300' : 'translate-y-full opacity-0 duration-700'}
      `}
      >
        <div className="bg-darkGray rounded-md flex flex-col gap-6 px-6 py-6">
          <h2 className="font-bold text-white text-[18px]">Edit Board</h2>
          <CustomInput
            label="Board Name"
            placeholder={currentBoard}
          />
          <div>
            <h3 className="font-semibold text-[15px] mb-2 text-white">Board Columns</h3>
            <div className="flex flex-col gap-2">
              {columns.map((column) =>
                column.map((item, index) => {
                  if (item.tasks.length !== 0)
                    return (
                      <CustomInput
                        key={index}
                        deleteIcon
                        placeholder={item.name}
                      />
                    );
                })
              )}
            </div>
          </div>
          <button className="px-5 py-2 bg-white hover:bg-lightGray font-semibold rounded-full text-mainPurple">+ Add New Column</button>
          <div className="flex flex-col gap-8">
            <button
              className="px-5 py-2 bg-mainPurple hover:bg-lightPurple font-semibold rounded-full text-white"
              onClick={handleClose}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBoardModal;
