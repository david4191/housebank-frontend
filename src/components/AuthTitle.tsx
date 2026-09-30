import { FC } from 'react';
import { Link } from 'react-router-dom';

interface IAuthTitleProps {
  headerText?: string;
  subtitle?: string;
  linkText?: string;
  linkTo?: string;
}

const AuthTitle: FC<IAuthTitleProps> = ({ headerText, subtitle, linkText, linkTo }) => {
  return (
    <>
      <h2 className="text-4xl font-bold mb-6 text-[color:var(--color-dark)]">
        {headerText ? headerText : ''}
      </h2>
      <div className="flex gap-1 mb-8 text-[color:var(--color-dark)] text-sm">
        <p>{subtitle ? subtitle : ''}</p>
        <Link to={linkTo ? linkTo : '/signup'} className="text-[color:var(--color-dark)] font-semibold hover:underline">
          {linkText ? linkText : ''}
        </Link>
      </div>
    </>
  );
};

export default AuthTitle;
