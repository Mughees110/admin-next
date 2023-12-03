import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import NotificationContext from "../../../../store/notification-context";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
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
function AgentEdit() {
    const router = useRouter();
    const [agent, setAgent] = useState({});
    const [upload, setUpload] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact_number: "",
        whatsapp_number: "",
        files: [],
        status: "",
        description: "",
        designation: "",
        slug: "",
        department: "",
        meta: "",
        // Use an array to store multiple files
    });

    useEffect(() => {
        const fetchAgent = async () => {
            const { id } = await router.query;
            if (id) {
                try {
                    const url = "/api/agents?id=" + id;
                    console.log(url);
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setAgent(data);
                        console.log(data);
                        setFormData({
                            name: data.name,
                            email: data.email,
                            id: data._id,
                            contact_number: data.contact_number,
                            whatsapp_number: data.whatsapp_number,
                            files: data.files,
                            status: data.status,
                            description: data.description,
                            slug: data.slug,
                            designation: data.designation,
                            meta: data.meta,
                            department: data.department,
                        });
                    } else {
                        console.error("Error fetching agent.");
                    }
                } catch (error) {
                    console.error("Error fetching agent:", error);
                }
            }
        };

        fetchAgent();
    }, [router.query.id]);

    const handleChange = (e) => {
        // Update formData based on the input type
        if (e.target.type === "file") {
            // Handle multiple files
            setUpload(true);
            setFormData({
                ...formData,
                files: e.target.files,
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value,
            });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitDisabled(true);
        notificationCtx.showNotification({
            title: "Agent",
            message: "Updating agent",
            status: "pending",
        });

        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/agents";
        const formDataWithFiles = new FormData();
        formDataWithFiles.append("id", formData.id);
        formDataWithFiles.append("name", formData.name);
        formDataWithFiles.append("email", formData.email);

        // Append each file to the FormData object
        // formData.files.forEach((file, index) => {
        //     formDataWithFiles.append(`file${index + 1}`, file);
        // });
        formDataWithFiles.append("contact_number", formData.contact_number);
        formDataWithFiles.append("whatsapp_number", formData.whatsapp_number);
        formDataWithFiles.append("description", formData.description);
        formDataWithFiles.append("status", formData.status);
        formDataWithFiles.append("slug", formData.slug);
        formDataWithFiles.append("designation", formData.designation);
        formDataWithFiles.append("meta", formData.meta);
        formDataWithFiles.append("department", formData.department);

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                body: formDataWithFiles,
            });

            if (response.ok) {
                notificationCtx.showNotification({
                    title: "Agent",
                    message: "Agent updated successfully",
                    status: "success",
                });
                router.push("/admin-panel/agents");
                console.log("Form submitted successfully!");
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Agent",
                    message: "Something went wrong while submitting",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Agent",
                message: "Something went wrong while submitting",
                status: "error",
            });
            setSubmitDisabled(false);
            console.error("Error submitting form:", error);
        }
    };
    return (
        <>
            {agent && (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Contact Number:
                        <input
                            type="text"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Whatsapp number:
                        <input
                            type="text"
                            name="whatsapp_number"
                            value={formData.whatsapp_number}
                            onChange={handleChange}
                        />
                    </label>

                    <br />
                    <label>
                        Files:
                        <input
                            type="file"
                            name="files"
                            onChange={handleChange}
                            multiple // Allow multiple file selection
                        />
                    </label>
                    <br />
                    <label>
                        Description:
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Status:
                        <input
                            type="text"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Slug:
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Designation:
                        <input
                            type="text"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Meta:
                        <input
                            type="text"
                            name="meta"
                            value={formData.meta}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <label>
                        Department:
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        />
                    </label>
                    <br />
                    <button type="submit" disabled={isSubmitDisabled}>
                        Submit
                    </button>
                </form>
            )}
        </>
    );
}
export default AgentEdit;
