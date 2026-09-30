import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className={`w-full text-center mx-auto pt-4`}>
      <p className={`text-[color:var(--color-dark)] text-2xl`}>
        Page not found
      </p>
      <Link
        to={'/'}
        className={`text-[color:var(--color-main)] underline italic`}
      >
        Back to home
      </Link>
    </div>
  );
};

export default NotFound;
