'use client';

import { useState, useEffect } from 'react';

import useEditBoardModal from '@/app/hooks/board/useEditBoardModal';
import useGlobals from '@/app/hooks/useGlobals';

import CustomInput from '../../CustomInput';
import { images } from '@/app/constants';

import Image from 'next/image';
import { toast } from 'react-hot-toast';

const EditBoardModal = () => {
  const globals = useGlobals();
  const editBoardModal = useEditBoardModal();

  const currentBoard = globals.currentBoard;

  const [toggleStatus, setToggleStatus] = useState(false);
  const [showModal, setShowModal] = useState(editBoardModal.isOpen);
  const [loading, setLoading] = useState(false);
  const [validate, setValidate] = useState(false);

  const fetchedBoards = globals.fetchedBoards;
  const board = fetchedBoards.boards.filter((board) => board.name === globals.currentBoard);
  const columns = board.map((item) => item.columns);

  const [updatedBoard, setUpdatedBoard] = useState({
    name: currentBoard,
    columns: columns,
  });

  //Edit Board functionality

  const addColumn = () => {
    if (updatedBoard.columns.length !== 3) {
      let colName;
      switch (updatedBoard.columns.length) {
        case 0:
          colName = { name: 'Todo' };
          break;
        case 1:
          colName = { name: 'Doing' };
          break;
        case 2:
          colName = { name: 'Done' };
          break;
        default:
          colName = { name: 'Todo' };
          break;
      }
      setUpdatedBoard((prevState) => ({
        ...prevState,
        columns: [...prevState.columns, colName],
      }));
    }
  };

  const deleteColumn = (col) => {
    const updatedColumns = updatedBoard.columns.filter((column) => column !== col);
    setUpdatedBoard({ ...updatedBoard, columns: updatedColumns });
  };

  useEffect(() => {
    setUpdatedBoard({
      name: currentBoard,
      columns: columns[0],
    });

    setShowModal(editBoardModal.isOpen);
    setToggleStatus(toggleStatus);
  }, [editBoardModal.isOpen, toggleStatus]);

  if (!editBoardModal.isOpen) {
    return null;
  }

  const handleUpdate = async () => {
    if (updatedBoard.name === '') {
      setValidate(true);
    } else {
      setLoading(true);
      try {
        await fetch('/api/board/update', {
          method: 'PATCH',
          body: JSON.stringify({
            currentBoard,
            updatedBoard,
          }),
        });

        setTimeout(() => {
          editBoardModal.onClose();
          toast.success('Board edited successfully!');
        }, 500);

        globals.setCurrentBoard(updatedBoard.name);
        globals.setHasChanged(globals.hasChanged);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (error) {
      } finally {
        setLoading(false);
        setShowModal(false);
        setToggleStatus(false);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setToggleStatus(false);

    setTimeout(() => {
      editBoardModal.onClose();
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
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-white text-[18px]">Edit Board</h2>
            <div onClick={handleClose}>
              <Image
                src={images.iconClose}
                alt="delete"
                className="w-[15px] h-[15px] hover:cursor-pointer"
              />
            </div>
          </div>
          <div>
            <CustomInput
              value={updatedBoard.name}
              setValue={(e) => {
                setValidate(false);
                const inputValue = e.target.value;
                const capitalizedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                setUpdatedBoard({ ...updatedBoard, name: capitalizedValue });
              }}
              label="Board Name"
              placeholder={currentBoard}
            />
            {validate && <p className="mt-1 text-[14px] text-red">Board name can't be empty!</p>}
          </div>
          {updatedBoard.columns && updatedBoard.columns.length > 0 && (
            <div>
              <h3 className="font-semibold text-[15px] mb-2 text-white">Board Columns</h3>
              <div className="flex flex-col gap-2">
                {updatedBoard.columns &&
                  updatedBoard.columns.length > 0 &&
                  updatedBoard.columns.map((column, index) => (
                    <div key={index}>
                      <CustomInput
                        disabled={true}
                        value={updatedBoard.columns[index].name}
                        setValue={() => {}}
                        deleteIcon
                        handleDelete={() => deleteColumn(column)}
                        placeholder={column.name}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
          <button
            onClick={addColumn}
            className="px-5 py-2 bg-white hover:bg-lightGray font-semibold rounded-full text-mainPurple"
          >
            + Add New Column
          </button>
          <div className="flex flex-col gap-8">
            <button
              className="px-5 py-2 bg-mainPurple hover:bg-lightPurple font-semibold rounded-full text-white"
              onClick={handleUpdate}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBoardModal;
