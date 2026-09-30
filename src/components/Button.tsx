import { FC } from 'react';

interface IButton {
  onClick: () => void;
  text?: string;
  variant?: 'primary' | 'secondary' | 'link';
}

const variantStyles = {
  primary: `w-full bg-green-600 text-white border border-green-600
             rounded-xl py-3 px-6 text-base font-medium cursor-pointer transition-all duration-300 block
             hover:bg-green-700 hover:border-green-700 focus:outline-none
             focus:ring-2 focus:ring-green-500 focus:ring-offset-2`,
  secondary: `w-full bg-transparent text-green-700 border-2 border-green-600
             rounded-xl py-3 px-6 text-base font-medium cursor-pointer transition-all duration-300 block
             hover:bg-green-600 hover:text-white focus:outline-none
             focus:ring-2 focus:ring-green-500 focus:ring-offset-2`,
  link: `w-full bg-transparent text-green-700 text-base font-medium cursor-pointer
           hover:text-green-800 underline-offset-2 hover:underline`,
};

const Button: FC<IButton> = ({ onClick, text, variant }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${variantStyles[variant ? variant : 'primary']}`}
    >
      {text ? text : 'Default'}
    </button>
  );
};

export default Button;
