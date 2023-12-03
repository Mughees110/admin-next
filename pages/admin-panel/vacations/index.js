import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import NotificationContext from "../../../store/notification-context";
import { useContext } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

/*export async function getStaticProps() {
    // Perform initial data fetching during the build process

    try {
        const response = await fetch("http://localhost:3000/api/properties", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const properties2 = await response.json();
            console.log(properties2);
            return {
                props: {
                    properties2,
                },
                revalidate: 10,
            };
        } else {
            return {
                props: {
                    properties2: [],
                },
                revalidate: 10,
            };
            console.error("Error fetching properties.");
        }
    } catch (error) {
        return {
            props: {
                properties2: [],
            },
            revalidate: 10,
        };
        console.error("Error fetching properties:", error);
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
function VacationIndex() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);

    function logoutHandler() {
        signOut();
    }
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const router = useRouter();
    const [vacations, setVacations] = useState([]);
    const [count, setCount] = useState(0);
    useEffect(() => {
        //setIsLoading(true);
        const fetchVacations = async () => {
            try {
                const response = await fetch("/api/vacations", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLoading(false);
                    setVacations(data);
                } else {
                    console.error("Error fetching vacations.");
                }
            } catch (error) {
                console.error("Error fetching vacations:", error);
            }
        };

        fetchVacations();
    }, [count, router.asPath]);
    const del = async (id) => {
        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/vacations?id=" + id;
        setSubmitDisabled(true);
        notificationCtx.showNotification({
            title: "Vacation",
            message: "Deleting vacation",
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
                    title: "Vacation",
                    message: "Deleted vacation",
                    status: "success",
                });
                setSubmitDisabled(false);
                setCount((prevCount) => prevCount + 1);
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Vacation",
                    message: "Something went wrong",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Vacation",
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
            {vacations && (
                <div>
                    <h1>
                        Vacation List{" "}
                        {session && (
                            <Link href="/admin-panel/vacations/create">
                                Create
                            </Link>
                        )}
                        <button onClick={logoutHandler}>Logout</button>
                    </h1>
                    <ul>
                        {vacations.map((vacation) => (
                            <>
                                <li key={vacation._id}>
                                    <strong>Price:</strong> {vacation.price},{" "}
                                    <strong>City:</strong> {vacation._id}
                                </li>
                                <li>
                                    <Link
                                        href={`/admin-panel/vacations/edit/${vacation._id}`}
                                    >
                                        Edit
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        disabled={isSubmitDisabled}
                                        onClick={() => {
                                            del(vacation._id);
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

export default VacationIndex;
