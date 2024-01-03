'use client';

import { useState, useEffect } from 'react';

import useAddTaskModal from '@/app/hooks/task/useAddTaskModal';
import useGlobals from '@/app/hooks/useGlobals';
import CustomInput from '@/app/components/CustomInput';
import { images } from '@/app/constants';

import Image from 'next/image';
import { toast } from 'react-hot-toast';

const AddTaskModal = () => {
  const addTaskModal = useAddTaskModal();
  const globals = useGlobals();

  const [toggleStatus, setToggleStatus] = useState(false);
  const [showModal, setShowModal] = useState(addTaskModal.isOpen);
  const [addedStatus, setAddedStatus] = useState('Todo');
  const boardName = globals.currentBoard;

  //Add task functionality
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: addedStatus,
    subtasks: [],
  });

  const fetchedBoards = globals.fetchedBoards;
  const board = fetchedBoards.boards.filter((board) => board.name === boardName);
  const columns = board.map((item) => item.columns);

  const createTask = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/task/new', {
        method: 'PATCH',
        body: JSON.stringify({
          boardName,
          newTask,
        }),
      });

      setTimeout(() => {
        addTaskModal.onClose();
        toast.success('Task added successfully!');
      }, 500);

      globals.setHasChanged(globals.hasChanged);
      setNewTask({
        title: '',
        description: '',
        status: addedStatus,
        subtasks: [],
      });
    } catch (error) {
      console.log(error);
    } finally {
      setShowModal(false);
      setToggleStatus(false);
      setLoading(false);
    }
  };

  const addSubtask = () => {
    if (newTask.subtasks.length !== 3) {
      const newSubtask = {
        title: '',
        isCompleted: false,
      };
      setNewTask({ ...newTask, subtasks: [...newTask.subtasks, newSubtask] });
    }
  };

  const deleteSubtask = (sub) => {
    const updatedSubtasks = newTask.subtasks.filter((subtask) => subtask !== sub);

    setNewTask({ ...newTask, subtasks: updatedSubtasks });
  };

  useEffect(() => {
    setShowModal(addTaskModal.isOpen);
    setToggleStatus(toggleStatus);
  }, [addTaskModal.isOpen, toggleStatus]);

  if (!addTaskModal.isOpen) {
    return null;
  }

  const handleClose = () => {
    setShowModal(false);
    setToggleStatus(false);
    setNewTask({
      title: '',
      description: '',
      status: addedStatus,
      subtasks: [],
    });

    setTimeout(() => {
      addTaskModal.onClose();
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
            <h2 className="font-bold text-white text-[18px]">Add New Task</h2>
            <div onClick={handleClose}>
              <Image
                src={images.iconClose}
                alt="delete"
                className="w-[15px] h-[15px] hover:cursor-pointer"
              />
            </div>
          </div>
          <CustomInput
            value={newTask.title}
            setValue={(e) => setNewTask({ ...newTask, title: e.target.value })}
            label="Title"
            placeholder="e.g. Take coffee break"
          />
          <CustomInput
            value={newTask.description}
            setValue={(e) => setNewTask({ ...newTask, description: e.target.value })}
            textarea
            label="Description"
            placeholder="e.g. It’s always good to take a break. This 15 minute break will recharge the batteries a little."
          />
          <h3 className="text-white font-semibold text-[15px] tracking-wider">Subtasks</h3>
          {newTask.subtasks.map((subtask, index) => (
            <div key={index}>
              <CustomInput
                value={newTask.subtasks[index].title}
                setValue={(e) => {
                  const updatedSubtasks = [...newTask.subtasks];
                  updatedSubtasks[index].title = e.target.value;
                  setNewTask({ ...newTask, subtasks: updatedSubtasks });
                }}
                handleDelete={() => deleteSubtask(subtask)}
                deleteIcon
                placeholder="e.g. Make coffee"
              />
            </div>
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
                className="flex justify-between py-2 px-3 border-[1px] rounded-lg border-neutral-600 bg-darkGray"
                // onClick={() => setToggleStatus((prev) => !prev)}
              >
                <h2 className="text-neutral-500">{addedStatus}</h2>
                {/* <div className="flex justify-center items-center">
                  <Image
                    src={!toggleStatus ? images.iconChevronUp : images.iconChevronDown}
                    alt="menu"
                    className="w-[12px] h-[10px]"
                  />
                </div> */}
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
                            setAddedStatus(item.name);
                            setNewTask({ ...newTask, status: item.name });
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
              onClick={() => {
                createTask();
              }}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
