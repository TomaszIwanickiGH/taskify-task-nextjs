'use client';

import { useState, useEffect } from 'react';

import useGlobals from '../../hooks/useGlobals';
import useTaskInfoModal from '../../hooks/useTaskInfoModal';
import useEditTaskModal from '../../hooks/task/useEditTaskModal';
import useDeleteTaskModal from '../../hooks/task/useDeleteTaskModal';

import MenuActions from '../MenuActions';
import Subtask from '../Subtask';

import { toast } from 'react-hot-toast';

const TaskInfoModal = () => {
  const globals = useGlobals();
  const taskInfoModal = useTaskInfoModal();
  const editTaskModal = useEditTaskModal();
  const deleteTaskModal = useDeleteTaskModal();

  const [toggleMenu, setToggleMenu] = useState(false);
  const [showModal, setShowModal] = useState(taskInfoModal.isOpen);
  const { id, title, description, status, subtasks, completedSubtasks } = globals.chosenTask;

  const [updatedSubtasks, setUpdatedSubtasks] = useState({});
  const [hasChanged, setHasChanged] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUpdatedSubtasks(subtasks);

    setShowModal(taskInfoModal.isOpen);
  }, [taskInfoModal.isOpen, updatedSubtasks]);

  if (!taskInfoModal.isOpen) {
    return null;
  }

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await fetch('/api/subtask', {
        method: 'PATCH',
        body: JSON.stringify({
          boardName: globals.currentBoard,
          id,
          status,
          updatedSubtasks,
          completed,
        }),
      });

      setTimeout(() => {
        taskInfoModal.onClose();
        toast.success('Task edited successfully!');
      }, 500);

      globals.setHasChanged(globals.hasChanged);
    } catch (error) {
      console.log(error);
    } finally {
      setShowModal(false);
      setLoading(false);
      setHasChanged(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);

    setTimeout(() => {
      taskInfoModal.onClose();
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
        ${showModal ? 'top-[50%] translate-y-[-50%] opacity-100 duration-500' : 'translate-y-full opacity-0 duration-700'}
      `}
      >
        <div className="bg-darkGray rounded-md flex flex-col gap-6 px-6 py-8">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-white font-bold max-w-[90%]">{title}</h2>
            <div className="flex items-center justify-end">
              <MenuActions
                position="10px"
                editMesage="Edit Task"
                deleteMessage="Delete Task"
                toggle={toggleMenu}
                handleToggle={() => setToggleMenu((prev) => !prev)}
                handleEdit={() => editTaskModal.onOpen()}
                handleDelete={() => deleteTaskModal.onOpen()}
                handleClose={() => {
                  setToggleMenu(false);
                  taskInfoModal.onClose();
                }}
              />
            </div>
          </div>
          <p className="text-mediumGray text-[15px]">{description ? description : 'No description for this task.'}</p>
          {subtasks && subtasks.length > 0 && (
            <h3 className="text-white font-semibold text-[15px] tracking-wider">
              Subtasks ({!hasChanged ? completedSubtasks : completed} of {subtasks.length})
            </h3>
          )}
          {subtasks.map((task, index) => (
            <Subtask
              key={index}
              isCompleted={task.isCompleted}
              title={task.title}
              handleChange={() => {
                setHasChanged(true);
                let existingSubtask = subtasks[index];
                existingSubtask.isCompleted = !existingSubtask.isCompleted;

                setUpdatedSubtasks((prevState) => {
                  const newState = [...prevState];
                  newState[index] = existingSubtask;
                  return newState;
                });
                setCompleted(updatedSubtasks.filter((sub) => sub.isCompleted).length);
              }}
            />
          ))}
          <div className="flex flex-col gap-6">
            <p className="text-mediumGray">
              Current status: <span className="text-white font-bold tracking-wider">{status ? status : 'Todo'}</span>
            </p>
            {hasChanged && (
              <button
                className="px-5 py-3 bg-mainPurple hover:bg-lightPurple font-semibold rounded-full text-white"
                onClick={handleUpdate}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            )}
            <button
              className="px-5 py-3 bg-mainPurple hover:bg-lightPurple font-semibold rounded-full text-white"
              onClick={handleClose}
            >
              Close Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskInfoModal;
