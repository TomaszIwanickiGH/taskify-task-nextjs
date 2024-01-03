'use client';

import { useState } from 'react';

const Subtask = ({ isCompleted, title, handleChange }) => {
  const [completed, setCompleted] = useState(isCompleted);

  return (
    <div
      className="p-3 flex items-center gap-4 bg-veryDarkGray hover:cursor-pointer"
      onClick={() => {
        setCompleted((prev) => !prev);
        handleChange();
      }}
    >
      <input
        onChange={() => {}}
        type="checkbox"
        checked={completed}
        // defaultChecked={completed ? true : false}
      />
      <h4 className={`${completed ? 'text-mediumGray line-through' : 'text-white hover:text-neutral-400 font-bold'}`}>{title}</h4>
    </div>
  );
};

export default Subtask;
