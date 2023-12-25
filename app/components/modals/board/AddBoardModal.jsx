'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

import useAddBoardModal from '@/app/hooks/board/useAddBoardModal';
import CustomInput from '@/app/components/CustomInput';
import { images } from '@/app/constants';
import useGlobals from '@/app/hooks/useGlobals';

const AddBoardModal = () => {
  const addBoardModal = useAddBoardModal();
  const globals = useGlobals();

  const [toggleStatus, setToggleStatus] = useState(false);
  const [showModal, setShowModal] = useState(addBoardModal.isOpen);
  const [loading, setLoading] = useState(false);

  const [boardDetails, setBoardDetails] = useState({
    name: '',
    columns: [{ name: 'Todo' }],
  });

  const addColumn = () => {
    if (boardDetails.columns.length !== 3) {
      const colName = boardDetails.columns.length === 1 ? { name: 'Doing' } : { name: 'Done' };
      setBoardDetails({ ...boardDetails, columns: [...boardDetails.columns, colName] });
    }
  };

  const deleteColumn = (col) => {
    const updatedColumns = boardDetails.columns.filter((colName) => colName !== col);

    if (col.name !== 'Todo') {
      setBoardDetails({ ...boardDetails, columns: updatedColumns });
    }
  };

  useEffect(() => {
    setShowModal(addBoardModal.isOpen);
    setToggleStatus(toggleStatus);
  }, [addBoardModal.isOpen, toggleStatus]);

  if (!addBoardModal.isOpen) {
    return null;
  }

  const handleClose = () => {
    setShowModal(false);
    setToggleStatus(false);

    setTimeout(() => {
      addBoardModal.onClose();
    }, 500);
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/board/new', {
        method: 'POST',
        body: JSON.stringify({
          name: boardDetails.name,
          columns: boardDetails.columns,
        }),
      });

      setTimeout(() => {
        addBoardModal.onClose();
        if (response.ok) {
          toast.success('Board created successfully!');
        } else {
          toast.error('Failed to create a board');
        }
      }, 500);

      globals.setHasChanged(globals.hasChanged);
      globals.setCurrentBoard(boardDetails.name);
    } catch (error) {
      console.log(error);
    } finally {
      setShowModal(false);
      setToggleStatus(false);
      setLoading(false);

      setBoardDetails({
        name: '',
        columns: [{ name: 'Todo' }],
      });
    }
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
            <h2 className="font-bold text-white text-[18px]">Add New Board</h2>
            <div onClick={handleClose}>
              <Image
                src={images.iconClose}
                alt="delete"
                className="w-[15px] h-[15px] hover:cursor-pointer"
              />
            </div>
          </div>
          <CustomInput
            value={boardDetails.name}
            setValue={(e) => setBoardDetails({ ...boardDetails, name: e.target.value })}
            label="Board Name"
            placeholder="e.g. Web Design"
          />
          <div>
            <h3 className="font-semibold text-[15px] mb-2 text-white">Board Columns</h3>
            {boardDetails.columns.map((column, index) => (
              <div
                key={index}
                className="mb-2"
              >
                <CustomInput
                  value={boardDetails.columns[index].name}
                  setValue={(e) => {
                    const updatedColumns = [...boardDetails.columns];
                    updatedColumns[index].name = e.target.value;
                    setBoardDetails({ ...boardDetails, columns: updatedColumns });
                  }}
                  deleteIcon
                  handleDelete={() => deleteColumn(column)}
                  placeholder="Todo"
                />
              </div>
            ))}
          </div>
          <button
            onClick={addColumn}
            className="px-5 py-2 bg-white hover:bg-lightGray font-semibold rounded-full text-mainPurple"
          >
            + Add New Column
          </button>
          <div className="flex flex-col gap-8">
            <button
              className="px-5 py-2 bg-mainPurple hover:bg-lightPurple font-semibold rounded-full text-white"
              onClick={() => {
                handleCreate();
              }}
            >
              {loading ? 'Creating...' : 'Create New Board'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBoardModal;
