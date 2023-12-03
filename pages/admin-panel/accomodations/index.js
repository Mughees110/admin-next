import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import NotificationContext from "../../../store/notification-context";
import { useContext } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

/*export async function getStaticProps() {
    // Perform initial data fetching during the build process

    try {
        const response = await fetch("http://localhost:3000/api/accomodations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const accomodations2 = await response.json();
            console.log(accomodations2);
            return {
                props: {
                    accomodations2,
                },
                revalidate: 10,
            };
        } else {
            return {
                props: {
                    accomodations2: [],
                },
                revalidate: 10,
            };
            console.error("Error fetching accomodations.");
        }
    } catch (error) {
        return {
            props: {
                accomodations2: [],
            },
            revalidate: 10,
        };
        console.error("Error fetching accomodations:", error);
    }
}*/
export async function getServerSideProps(context) {
    const session = await getSession({ req: context.req });

    if (!session) {
        return {
            redirect: {
                destination: "/admin-panel/login",
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}
function AccomodationIndex() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);

    function logoutHandler() {
        signOut();
    }
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const router = useRouter();
    const [accomodations, setAccomodations] = useState([]);
    const [count, setCount] = useState(0);
    useEffect(() => {
        //setIsLoading(true);
        const fetchAccomodations = async () => {
            try {
                const response = await fetch("/api/accomodations", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLoading(false);
                    setAccomodations(data);
                } else {
                    console.error("Error fetching accomodations.");
                }
            } catch (error) {
                console.error("Error fetching accomodations:", error);
            }
        };

        fetchAccomodations();
    }, [count, router.asPath]);
    const del = async (id) => {
        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/accomodations?id=" + id;
        setSubmitDisabled(true);
        notificationCtx.showNotification({
            title: "Accomodation",
            message: "Deleting accomodation",
            status: "pending",
        });
        try {
            const response = await fetch(apiUrl, {
                method: "DELETE",
                body: JSON.stringify({ id: id }),
            });

            if (response.ok) {
                console.log("Form submitted successfully!");
                notificationCtx.showNotification({
                    title: "Accomodation",
                    message: "Deleted accomodation",
                    status: "success",
                });
                setSubmitDisabled(false);
                setCount((prevCount) => prevCount + 1);
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Accomodation",
                    message: "Something went wrong",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Accomodation",
                message: "Something went wrong",
                status: "error",
            });
            setSubmitDisabled(false);
            console.error("Error submitting form:", error);
        }
    };
    //const [isLoading, setIsLoading] = useState(true);

    /*useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                window.location.href = "/admin-panel/login";
            } else {
                setIsLoading(false);
            }
        });
    }, []);

    if (isLoading) {
        return <p>Loading...</p>;
    }*/

    return (
        <>
            {loading && <p>Loading...</p>}
            {accomodations && (
                <div>
                    <h1>
                        Accomodation List{" "}
                        {session && (
                            <Link href="/admin-panel/accomodations/create">
                                Create
                            </Link>
                        )}
                        <button onClick={logoutHandler}>Logout</button>
                    </h1>
                    <ul>
                        {accomodations.map((accomodation) => (
                            <>
                                <li key={accomodation._id}>
                                    <strong>Name:</strong> {accomodation.name},{" "}
                                    <strong>Short Name:</strong>{" "}
                                    {accomodation.short_name},{" "}
                                    <strong>Id:</strong> {accomodation._id}
                                </li>
                                <li>
                                    <Link
                                        href={`/admin-panel/accomodations/edit/${accomodation._id}`}
                                    >
                                        Edit
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        disabled={isSubmitDisabled}
                                        onClick={() => {
                                            del(accomodation._id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            </>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default AccomodationIndex;
