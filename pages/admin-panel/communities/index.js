import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import NotificationContext from "../../../store/notification-context";
import { useContext } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

/*export async function getStaticProps() {
    // Perform initial data fetching during the build process

    try {
        const response = await fetch("http://localhost:3000/api/communities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const communities2 = await response.json();
            console.log(communities2);
            return {
                props: {
                    communities2,
                },
                revalidate: 10,
            };
        } else {
            return {
                props: {
                    communities2: [],
                },
                revalidate: 10,
            };
            console.error("Error fetching communities.");
        }
    } catch (error) {
        return {
            props: {
                communities2: [],
            },
            revalidate: 10,
        };
        console.error("Error fetching communities:", error);
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
function CommunityIndex() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);

    function logoutHandler() {
        signOut();
    }
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const router = useRouter();
    const [communities, setCommunities] = useState([]);
    const [count, setCount] = useState(0);
    useEffect(() => {
        //setIsLoading(true);
        const fetchCommunities = async () => {
            try {
                const response = await fetch("/api/communities", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLoading(false);
                    setCommunities(data);
                } else {
                    console.error("Error fetching communities.");
                }
            } catch (error) {
                console.error("Error fetching communities:", error);
            }
        };

        fetchCommunities();
    }, [count, router.asPath]);
    const del = async (id) => {
        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/communities?id=" + id;
        setSubmitDisabled(true);
        notificationCtx.showNotification({
            title: "Community",
            message: "Deleting community",
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
                    title: "Community",
                    message: "Deleted community",
                    status: "success",
                });
                setSubmitDisabled(false);
                setCount((prevCount) => prevCount + 1);
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Community",
                    message: "Something went wrong",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Community",
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
            {communities && (
                <div>
                    <h1>
                        Contact List{" "}
                        {session && (
                            <Link href="/admin-panel/communities/create">
                                Create
                            </Link>
                        )}
                        <button onClick={logoutHandler}>Logout</button>
                    </h1>
                    <ul>
                        {communities.map((community) => (
                            <>
                                <li key={community._id}>
                                    <strong>Name:</strong> {community.name},{" "}
                                    <strong>Address:</strong>{" "}
                                    {community.address}, <strong>Id:</strong>{" "}
                                    {community._id}
                                </li>
                                <li>
                                    <Link
                                        href={`/admin-panel/communities/edit/${community._id}`}
                                    >
                                        Edit
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        disabled={isSubmitDisabled}
                                        onClick={() => {
                                            del(community._id);
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

export default CommunityIndex;
