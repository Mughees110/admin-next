import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import NotificationContext from "../../../store/notification-context";
import { useContext } from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";

/*export async function getStaticProps() {
    // Perform initial data fetching during the build process

    try {
        const response = await fetch("http://localhost:3000/api/agents", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const agents2 = await response.json();
            console.log(agents2);
            return {
                props: {
                    agents2,
                },
                revalidate: 10,
            };
        } else {
            return {
                props: {
                    agents2: [],
                },
                revalidate: 10,
            };
            console.error("Error fetching agenst.");
        }
    } catch (error) {
        return {
            props: {
                agents2: [],
            },
            revalidate: 10,
        };
        console.error("Error fetching agents:", error);
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
function AgentIndex() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);

    function logoutHandler() {
        signOut();
    }
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const router = useRouter();
    const [agents, setAgents] = useState([]);
    const [count, setCount] = useState(0);
    useEffect(() => {
        //setIsLoading(true);
        const fetchAgents = async () => {
            try {
                const response = await fetch("/api/agents", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setLoading(false);
                    setAgents(data);
                } else {
                    console.error("Error fetching agents.");
                }
            } catch (error) {
                console.error("Error fetching agents:", error);
            }
        };

        fetchAgents();
    }, [count, router.asPath]);
    const del = async (id) => {
        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/agents?id=" + id;
        setSubmitDisabled(true);
        notificationCtx.showNotification({
            title: "Agents",
            message: "Deleting agent",
            status: "pending",
        });
        try {
            const response = await fetch(apiUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: id }),
            });

            if (response.ok) {
                console.log("Form submitted successfully!");
                notificationCtx.showNotification({
                    title: "Agents",
                    message: "Deleted agent",
                    status: "success",
                });
                setSubmitDisabled(false);
                setCount((prevCount) => prevCount + 1);
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Agents",
                    message: "Something went wrong",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Agents",
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
            {agents && (
                <div>
                    <h1>
                        Agent List{" "}
                        {session && (
                            <Link href="/admin-panel/agents/create">
                                Create
                            </Link>
                        )}
                        <button onClick={logoutHandler}>Logout</button>
                    </h1>
                    <ul>
                        {agents.map((agent) => (
                            <>
                                <li key={agent._id}>
                                    <strong>Name:</strong> {agent.name},{" "}
                                    <strong>Email:</strong> {agent.email},{" "}
                                    <strong>Id:</strong> {agent._id}
                                </li>
                                <li>
                                    <Link
                                        href={`/admin-panel/agents/edit/${agent._id}`}
                                    >
                                        Edit
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        disabled={isSubmitDisabled}
                                        onClick={() => {
                                            del(agent._id);
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

export default AgentIndex;
