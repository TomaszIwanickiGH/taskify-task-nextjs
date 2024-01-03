'use client';

import Image from 'next/image';
import { images } from '../constants';

const CustomInput = ({ label, placeholder, textarea, deleteIcon, value, setValue, handleDelete, disabled }) => {
  return (
    <div className="flex justify-center items-center gap-4 w-full text-white">
      <label className="flex flex-1 flex-col gap-2">
        {label && <h3 className="font-semibold text-[15px]">{label}</h3>}
        {textarea ? (
          <textarea
            value={value}
            onChange={setValue}
            rows={3}
            className="py-2 px-3 border-[1px] rounded-lg border-neutral-600 bg-darkGray outline-none focus:outline-none hover:cursor-pointer resize-none placeholder:text-[15px]"
            placeholder={placeholder}
          />
        ) : (
          <input
            disabled={disabled}
            type="text"
            value={value}
            onChange={setValue}
            className={`py-2 px-3 border-[1px] rounded-lg border-neutral-600 bg-darkGray outline-none focus:outline-none placeholder:text-mediumGray placeholder:text-[15px] ${disabled ? '' : 'hover:cursor-pointer'}`}
            placeholder={placeholder}
          />
        )}
      </label>
      {deleteIcon && (
        <div onClick={handleDelete}>
          <Image
            src={images.iconClose}
            alt="delete"
            className="w-[15px] h-[15px] hover:cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default CustomInput;
