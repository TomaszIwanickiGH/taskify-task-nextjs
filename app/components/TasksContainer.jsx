'use client';

import useEditBoardModal from '../hooks/board/useEditBoardModal';
import useGlobals from '../hooks/useGlobals';
import useTaskInfoModal from '../hooks/useTaskInfoModal';
import Task from './Task';

const TasksContainer = ({ stage, tasks }) => {
  const globals = useGlobals();
  const taskInfoModal = useTaskInfoModal();
  const editBoardModal = useEditBoardModal();

  return (
    <div className="flex flex-col gap-6 w-full">
      {tasks.length !== 0 ? (
        <div className="flex items-center w-full gap-4">
          <div className="w-[15px] h-[15px] rounded-full bg-mainPurple" />
          <h3 className="text-mediumGray">
            {stage} ({tasks.length})
          </h3>
        </div>
      ) : (
        <div
          onClick={() => editBoardModal.onOpen()}
          className="h-[80vh] bg-[#2B2C37] rounded-lg flex justify-center items-center px-8 translate duration-300 hover:cursor-pointer hover:bg-[#2B2C37]/50"
        >
          <p className="text-[24px] text-mediumGray font-semibold">+ New Column</p>
        </div>
      )}
      <div className="flex flex-col flex-wrap gap-6">
        {tasks.map((task, index) => (
          <Task
            key={index}
            title={task.title}
            subtasks={task.subtasks.length}
            completedSubtasks={task.subtasks.filter((sub) => sub.isCompleted).length}
            handleClick={() => {
              globals.setChosenTask(task._id, task.title, task.description, task.status, task.subtasks, task.subtasks.filter((sub) => sub.isCompleted).length);
              window.scrollTo(0, 0);
              taskInfoModal.onOpen();
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TasksContainer;
