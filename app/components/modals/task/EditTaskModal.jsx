'use client';

import { useState, useEffect } from 'react';

import useGlobals from '@/app/hooks/useGlobals';
import useEditTaskModal from '@/app/hooks/task/useEditTaskModal';
import CustomInput from '@/app/components/CustomInput';
import { images } from '@/app/constants';

import Image from 'next/image';
import { toast } from 'react-hot-toast';

const TaskInfoModal = () => {
  const globals = useGlobals();
  const editTaskModal = useEditTaskModal();

  const [toggleStatus, setToggleStatus] = useState(false);
  const [showModal, setShowModal] = useState(editTaskModal.isOpen);
  const { title, description, status, subtasks } = globals.chosenTask;
  const [editedStatus, setEditedStatus] = useState('');

  //Update task functionality
  const [updatedTask, setUpdatedTask] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchedBoards = globals.fetchedBoards;
  const board = fetchedBoards.boards.filter((board) => board.name === globals.currentBoard);
  const columns = board.map((item) => item.columns);

  const addSubtask = () => {
    if (updatedTask.subtasks.length !== 3) {
      const newSubtask = {
        title: '',
        isCompleted: false,
      };
      setUpdatedTask({ ...updatedTask, subtasks: [...updatedTask.subtasks, newSubtask] });
    }
  };

  const deleteSubtask = (sub) => {
    const updatedSubtasks = updatedTask.subtasks.filter((subtask) => subtask !== sub);

    setUpdatedTask({ ...updatedTask, subtasks: updatedSubtasks });
  };

  useEffect(() => {
    setUpdatedTask({
      title: title,
      description: description,
      status: status,
      subtasks: subtasks,
    });
    setShowModal(editTaskModal.isOpen);
    setToggleStatus(toggleStatus);
  }, [editTaskModal.isOpen]);

  if (!editTaskModal.isOpen) {
    return null;
  }

  const updateTask = async () => {
    setLoading(true);
    try {
      await fetch('/api/task/update', {
        method: 'PATCH',
        body: JSON.stringify({
          boardName: globals.currentBoard,
          id: globals.chosenTask.id,
          status: globals.chosenTask.status,
          updatedTask,
        }),
      });

      console.log(updatedTask);
      setTimeout(() => {
        editTaskModal.onClose();
        toast.success('Task edited successfully!');
      }, 500);

      globals.setHasChanged(globals.hasChanged);
    } catch (error) {
      console.log(error);
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
      editTaskModal.onClose();
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
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-white text-[18px]">Edit Task</h2>
            <div onClick={handleClose}>
              <Image
                src={images.iconClose}
                alt="delete"
                className="w-[15px] h-[15px] hover:cursor-pointer"
              />
            </div>
          </div>
          <CustomInput
            value={updatedTask.title}
            setValue={(e) => setUpdatedTask({ ...updatedTask, title: e.target.value })}
            label="Title"
            placeholder={title}
          />
          <CustomInput
            value={updatedTask.description}
            setValue={(e) => setUpdatedTask({ ...updatedTask, description: e.target.value })}
            textarea
            label="Description"
            placeholder={description ? description : 'Add description for this task'}
          />
          <h3 className="text-white font-semibold text-[15px] tracking-wider">Subtasks</h3>
          {updatedTask.subtasks.map((subtask, index) => (
            <CustomInput
              value={updatedTask.subtasks[index].title}
              setValue={(e) => {
                const updatedSubtask = [...updatedTask.subtasks];
                updatedSubtask[index].title = e.target.value;
                setUpdatedTask({ ...updatedTask, subtasks: updatedSubtask });
              }}
              key={index}
              handleDelete={() => deleteSubtask(subtask)}
              deleteIcon
              placeholder={subtask.title}
            />
          ))}
          <button
            onClick={addSubtask}
            className="px-5 py-2 bg-white hover:bg-lightGray font-semibold rounded-full text-mainPurple"
          >
            + Add New Subtask
          </button>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 relative">
              <h3 className="font-semibold text-white">Status</h3>
              <div
                className="flex justify-between py-2 px-3 border-[1px] rounded-lg border-neutral-600 bg-darkGray hover:cursor-pointer"
                onClick={() => setToggleStatus((prev) => !prev)}
              >
                {updatedTask.status ? <h2 className="text-neutral-500">{updatedTask.status}</h2> : <h2 className="text-neutral-500">{status ? status : 'Todo'}</h2>}
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
                    {columns.map((column) =>
                      column.map((item, index) => (
                        <p
                          key={item.name}
                          className="text-neutral-500 hover:text-white hover:cursor-pointer"
                          onClick={() => {
                            setEditedStatus(item.name);
                            setUpdatedTask({ ...updatedTask, status: item.name });
                            setToggleStatus(false);
                          }}
                        >
                          {item.name}
                        </p>
                      ))
                    )}
                  </div>
                }
              </div>
            </div>
            <button
              className="px-5 py-2 bg-mainPurple hover:bg-lightPurple font-semibold rounded-full text-white"
              onClick={updateTask}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskInfoModal;
