import "../styles/globals.css";

import { useContext } from "react";
import Notification from "../components/ui/notification";
import { NotificationContextProvider } from "../store/notification-context";
import Layout from "../components/ui/layout";
import { SessionProvider } from "next-auth/react";
function MyApp({ Component, pageProps }) {
    console.log(pageProps.session);
    return (
        <SessionProvider session={pageProps.session}>
            <NotificationContextProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </NotificationContextProvider>
        </SessionProvider>
    );
}

export default MyApp;
