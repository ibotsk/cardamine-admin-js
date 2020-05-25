import 'react-notifications/lib/notifications.css';

import { NotificationManager } from 'react-notifications';

const info = (message) => NotificationManager.info(message);

const success = (message) => NotificationManager.success(message);

const warning = (message) => NotificationManager.warning(message);

const error = (message) => NotificationManager.error(message);

export default {
  info,
  success,
  warning,
  error,
};
