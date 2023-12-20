'use client';

import { useState, useEffect } from 'react';

import useDeleteTaskModal from '@/app/hooks/task/useDeleteTaskModal';
import useGlobals from '@/app/hooks/useGlobals';

import { toast } from 'react-hot-toast';

const DeleteTaskModal = () => {
  const deleteTaskModal = useDeleteTaskModal();
  const globals = useGlobals();

  const { title } = globals.chosenTask;

  const [toggleStatus, setToggleStatus] = useState(false);
  const [showModal, setShowModal] = useState(deleteTaskModal.isOpen);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setShowModal(deleteTaskModal.isOpen);
    setToggleStatus(toggleStatus);
  }, [deleteTaskModal.isOpen, toggleStatus]);

  if (!deleteTaskModal.isOpen) {
    return null;
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch('/api/task/delete', {
        method: 'DELETE',
        body: JSON.stringify({
          boardName: globals.currentBoard,
          id: globals.chosenTask.id,
          status: globals.chosenTask.status,
        }),
      });
      setTimeout(() => {
        deleteTaskModal.onClose();
        toast.success('Task deleted successfully!');
      }, 500);

      globals.setHasChanged(globals.hasChanged);
    } catch (error) {
    } finally {
      setShowModal(false);
      setToggleStatus(false);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setToggleStatus(false);

    setTimeout(() => {
      deleteTaskModal.onClose();
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
        <div className="bg-darkGray rounded-md flex flex-col gap-4 px-6 py-6">
          <h2 className="font-bold text-red text-[18px]">Delete this task?</h2>
          <p className="text-[15px] text-neutral-400">Are you sure you want to delete the '{title}' task? This action will remove all columns and tasks and cannot be reversed.</p>
          <div className="flex justify-center items-center gap-4 w-full mt-1">
            <button
              className="px-5 py-2 bg-red hover:bg-lightRed font-semibold rounded-full text-white w-full"
              onClick={() => {
                handleDelete();
                console.log(globals.chosenTask);
              }}
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
            <button
              className="px-5 py-2 bg-white hover:bg-lightGray font-semibold rounded-full text-mainPurple w-full"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
