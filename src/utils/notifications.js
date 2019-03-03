import 'react-notifications/lib/notifications.css';

import { NotificationManager } from 'react-notifications';

const info = (message) => {
    return NotificationManager.info(message);
}

const success = (message) => {
    return NotificationManager.success(message);
}

const warning = (message) => {
    return NotificationManager.warning(message);
}

const error = (message) => {
    return NotificationManager.error(message);
}

export default { info, success, warning, error };