import { useContext, useState } from "react";
import Link from "next/link";
import NotificationContext from "../../../store/notification-context";
import { useRouter } from "next/router";
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
function AgentCreate(props) {
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const router = useRouter();
    const notificationCtx = useContext(NotificationContext);

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

    const handleChange = (e) => {
        // Update formData based on the input type
        if (e.target.type === "file") {
            // Handle multiple files
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
        console.log(formData);
        notificationCtx.showNotification({
            title: "Agent",
            message: "Storing agent",
            status: "pending",
        });

        const apiUrl = "/api/agents";

        const formDataWithFiles = new FormData();
        formDataWithFiles.append("name", formData.name);
        formDataWithFiles.append("email", formData.email);

        // Append each file to the FormData object
        // formData.files.forEach((file, index) => {
        //     formDataWithFiles.append(`file${index + 1}`, file);
        // });

        Array.from(formData.files).forEach((file, index) => {
            formDataWithFiles.append(`files`, file);
        });

        formDataWithFiles.append("contact_number", formData.contact_number);
        formDataWithFiles.append("whatsapp_number", formData.whatsapp_number);
        formDataWithFiles.append("status", formData.status);
        formDataWithFiles.append("description", formData.description);
        formDataWithFiles.append("slug", formData.slug);
        formDataWithFiles.append("designation", formData.designation);
        formDataWithFiles.append("department", formData.department);
        formDataWithFiles.append("meta", formData.meta);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formDataWithFiles,
            });

            if (response.ok) {
                notificationCtx.showNotification({
                    title: "Agent",
                    message: "Agent stored successfully",
                    status: "success",
                });
                router.push("/admin-panel/agents");
                console.log("Form submitted successfully!");
            } else {
                const errorData = await response.json();
                const errorMessage =
                    errorData.message || "Something went wrong";
                notificationCtx.showNotification({
                    title: "Agent",
                    message: errorMessage,
                    status: "error",
                });
                console.error("Form submission failed:", errorMessage);
                setSubmitDisabled(false);
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Agent",
                message: "Something went wrong while submitting",
                status: "error",
            });
            console.error("Error submitting form:", error);
            setSubmitDisabled(false);
        }
    };

    return (
        <>
            <h1>
                <Link href="/admin-panel/agents">Home</Link>
            </h1>
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
        </>
    );
}

export default AgentCreate;
