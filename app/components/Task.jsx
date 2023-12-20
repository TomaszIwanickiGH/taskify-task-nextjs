'use client';

const Task = ({ title, subtasks, completedSubtasks, handleClick }) => {
  return (
    <div
      onClick={handleClick}
      className="flex flex-col gap-1 py-6 px-4 rounded-xl bg-darkGray min-h-[]80px hover:cursor-pointer translate duration-300 hover:shadow-2xl"
    >
      <h3 className="translate duration-200 text-white hover:text-mainPurple font-semibold">{title}</h3>
      <p className="text-mediumGray text-[14px]">
        {completedSubtasks} of {subtasks} subtasks
      </p>
    </div>
  );
};

export default Task;
