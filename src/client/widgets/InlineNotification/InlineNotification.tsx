import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { IconType } from 'react-icons/lib';

type NotificationType = 'success' | 'warning' | 'error';

type NotificationOptionsType = Record<NotificationType, { 
  bgColor: string; 
  iconColor: string;
  Icon: IconType; 
}>;

const noficationOptions: NotificationOptionsType = {
  success: {
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600',
    Icon: FaCheckCircle
  },
  warning: {
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600',
    Icon: FaExclamationCircle
  },
  error: {
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600',
    Icon: FaExclamationCircle
  }  
}

export interface InlineNotificationProps {
  type: NotificationType,
  message: string;
}

export function InlineNotification ({ type, message }: InlineNotificationProps) {
  if ( !message || !type ) { return <></>; }

  const { bgColor, iconColor, Icon } = noficationOptions[type];

  return (
    <div className={`flex gap-4 items-center max-w-md mx-auto px-4 py-1 ${bgColor} text-black text-sm`}>
      <Icon size="4em" className={`${iconColor}`} />
      {message}
    </div>
  );
}
