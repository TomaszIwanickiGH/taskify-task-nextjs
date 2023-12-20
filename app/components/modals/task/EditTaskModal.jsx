'use client';

import { useState, useEffect } from 'react';

import useGlobals from '../../../hooks/useGlobals';
import useEditTaskModal from '../../../hooks/task/useEditTaskModal';

import CustomInput from '../../CustomInput';

import Image from 'next/image';
import { images } from '../../../constants';

import { toast } from 'react-hot-toast';

const TaskInfoModal = () => {
  const globals = useGlobals();
  const editTaskModal = useEditTaskModal();

  const [toggleStatus, setToggleStatus] = useState(false);
  const [showModal, setShowModal] = useState(editTaskModal.isOpen);
  const { title, description, status, subtasks } = globals.chosenTask;
  const [editedStatus, setEditedStatus] = useState('');

  useEffect(() => {
    setShowModal(editTaskModal.isOpen);
    setToggleStatus(toggleStatus);
  }, [editTaskModal.isOpen, toggleStatus]);

  if (!editTaskModal.isOpen) {
    return null;
  }

  const handleClose = () => {
    setShowModal(false);
    setToggleStatus(false);

    setTimeout(() => {
      editTaskModal.onClose();
      toast.success('Task edited successfully!');
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
          <h2 className="font-bold text-white text-[18px]">Edit Task</h2>
          <CustomInput
            label="Title"
            placeholder={title}
          />
          <CustomInput
            textarea
            label="Description"
            placeholder={description ? description : 'Add description for this task'}
          />
          <h3 className="text-white font-semibold text-[15px] tracking-wider">Subtasks</h3>
          {subtasks.map((task, index) => (
            <CustomInput
              key={index}
              deleteIcon
              placeholder={task.title}
            />
          ))}
          <button className="px-5 py-2 bg-white hover:bg-lightGray font-semibold rounded-full text-mainPurple">+ Add New Subtask</button>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 relative">
              <h3 className="font-semibold text-white">Status</h3>
              <div
                className="flex justify-between py-2 px-3 border-[1px] rounded-lg border-neutral-600 bg-darkGray hover:cursor-pointer"
                onClick={() => setToggleStatus((prev) => !prev)}
              >
                {editedStatus ? <h2 className="text-neutral-500">{editedStatus}</h2> : <h2 className="text-neutral-500">{status ? status : 'Todo'}</h2>}
                <div className="flex justify-center items-center">
                  <Image
                    src={!toggleStatus ? images.iconChevronUp : images.iconChevronDown}
                    alt="menu"
                    className="w-[12px] h-[10px]"
                  />
                </div>
              </div>
              <div
                className={`absolute translate duration-500 w-full
               ${toggleStatus ? 'translate-y-[-100px] opacity-100 z-[50]' : 'translate-y-[100px] opacity-0 z-[-50]'}`}
              >
                {
                  <div
                    className={`flex flex-col gap-2 w-full bg-veryDarkGray p-4 rounded-xl translate
                  `}
                  >
                    <p
                      onClick={() => {
                        setEditedStatus('Todo');
                        setToggleStatus(false);
                      }}
                      className="text-neutral-500 hover:text-white hover:cursor-pointer"
                    >
                      Todo
                    </p>
                    <p
                      onClick={() => {
                        setEditedStatus('Doing');
                        setToggleStatus(false);
                      }}
                      className="text-neutral-500 hover:text-white hover:cursor-pointer"
                    >
                      Doing
                    </p>
                    <p
                      onClick={() => {
                        setEditedStatus('Done');
                        setToggleStatus(false);
                      }}
                      className="text-neutral-500 hover:text-white hover:cursor-pointer"
                    >
                      Done
                    </p>
                  </div>
                }
              </div>
            </div>
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

export default TaskInfoModal;
