interface AuthFormNoticeProps {
  message: string;
}

interface AuthFieldErrorProps {
  id: string;
  message?: string;
}

export function AuthFormNotice({ message }: AuthFormNoticeProps) {
  if (!message) return null;

  return (
    <div
      className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
      aria-live="polite"
    >
      {message}
    </div>
  );
}

export function AuthFieldError({ id, message }: AuthFieldErrorProps) {
  if (!message) return null;

  return (
    <p id={id} className="mt-1 text-sm text-red-600" role="alert">
      {message}
    </p>
  );
}