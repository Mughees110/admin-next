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
function PropertyIndex() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);

    function logoutHandler() {
        signOut();
    }
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [count, setCount] = useState(0);
    useEffect(() => {
        //setIsLoading(true);
        const fetchProperties = async () => {
            try {
                const response = await fetch("/api/properties", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLoading(false);
                    setProperties(data);
                } else {
                    console.error("Error fetching properties.");
                }
            } catch (error) {
                console.error("Error fetching properties:", error);
            }
        };

        fetchProperties();
    }, [count, router.asPath]);
    const del = async (id) => {
        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/properties?id=" + id;
        setSubmitDisabled(true);
        notificationCtx.showNotification({
            title: "Property",
            message: "Deleting property",
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
                    title: "Property",
                    message: "Deleted property",
                    status: "success",
                });
                setSubmitDisabled(false);
                setCount((prevCount) => prevCount + 1);
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Property",
                    message: "Something went wrong",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Property",
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
            {properties && (
                <div>
                    <h1>
                        Property List{" "}
                        {session && (
                            <Link href="/admin-panel/properties/create">
                                Create
                            </Link>
                        )}
                        <button onClick={logoutHandler}>Logout</button>
                    </h1>
                    <ul>
                        {properties.map((property) => (
                            <>
                                <li key={property._id}>
                                    <strong>Count:</strong> {property.count},{" "}
                                    <strong>Id:</strong> {property._id}
                                </li>
                                <li>
                                    <Link
                                        href={`/admin-panel/properties/edit/${property._id}`}
                                    >
                                        Edit
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        disabled={isSubmitDisabled}
                                        onClick={() => {
                                            del(property._id);
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

export default PropertyIndex;
