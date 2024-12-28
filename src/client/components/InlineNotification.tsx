import { FaExclamationCircle } from 'react-icons/fa'

export function InlineNotification ({ message }: { message: string; }) {

  if ( !message ) { return <></>; }

  return (
    <div className="flex gap-4 items-center max-w-md mx-auto px-4 py-1 bg-yellow-50 text-black text-sm">
      <FaExclamationCircle size="4em" className="text-yellow-600" />
      {message}
    </div>
  );
}
