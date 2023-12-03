import { Fragment, useContext } from "react";
import Notification from "./notification";
import NotificationContext from "../../store/notification-context";

function Layout(props) {
    const notificationCtx = useContext(NotificationContext);

    const activeNotification = notificationCtx.notification;

    return (
        <Fragment>
            <main>{props.children}</main>
            {activeNotification && (
                <Notification
                    title={activeNotification.title}
                    message={activeNotification.message}
                    status={activeNotification.status}
                />
            )}
        </Fragment>
    );
}

export default Layout;
