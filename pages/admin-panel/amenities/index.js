import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import NotificationContext from "../../../store/notification-context";
import { useContext } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

/*export async function getStaticProps() {
    // Perform initial data fetching during the build process

    try {
        const response = await fetch("http://localhost:3000/api/ameneties", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const ameneties2 = await response.json();
            console.log(ameneties2);
            return {
                props: {
                    ameneties2,
                },
                revalidate: 10,
            };
        } else {
            return {
                props: {
                    ameneties2: [],
                },
                revalidate: 10,
            };
            console.error("Error fetching ameneties.");
        }
    } catch (error) {
        return {
            props: {
                ameneties2: [],
            },
            revalidate: 10,
        };
        console.error("Error fetching ameneties:", error);
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
function AmenitiesIndex() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);

    function logoutHandler() {
        signOut();
    }
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const router = useRouter();
    const [ameneties, setAmeneties] = useState([]);
    const [count, setCount] = useState(0);
    useEffect(() => {
        //setIsLoading(true);
        const fetchAmeneties = async () => {
            try {
                const response = await fetch("/api/ameneties", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLoading(false);
                    setAmeneties(data);
                } else {
                    console.error("Error fetching ameneties.");
                }
            } catch (error) {
                console.error("Error fetching ameneties:", error);
            }
        };

        fetchAmeneties();
    }, [count, router.asPath]);
    const del = async (id) => {
        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/ameneties?id=" + id;
        setSubmitDisabled(true);
        notificationCtx.showNotification({
            title: "Amenity",
            message: "Deleting amenety",
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
                    title: "Amenity",
                    message: "Deleted amenety",
                    status: "success",
                });
                setSubmitDisabled(false);
                setCount((prevCount) => prevCount + 1);
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Amenity",
                    message: "Something went wrong",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "amenity",
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
            {ameneties && (
                <div>
                    <h1>
                        Amenity List{" "}
                        {session && (
                            <Link href="/admin-panel/amenities/create">
                                Create
                            </Link>
                        )}
                        <button onClick={logoutHandler}>Logout</button>
                    </h1>
                    <ul>
                        {ameneties.map((amenety) => (
                            <>
                                <li key={amenety._id}>
                                    <strong>Name:</strong> {amenety.name},{" "}
                                    <strong>Short Name:</strong>{" "}
                                    {amenety.short_name}, <strong>Id:</strong>{" "}
                                    {amenety._id}
                                </li>
                                <li>
                                    <Link
                                        href={`/admin-panel/amenities/edit/${amenety._id}`}
                                    >
                                        Edit
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        disabled={isSubmitDisabled}
                                        onClick={() => {
                                            del(amenety._id);
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

export default AmenitiesIndex;
