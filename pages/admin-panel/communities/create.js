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
function CommunityCreate(props) {
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const router = useRouter();
    const notificationCtx = useContext(NotificationContext);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        address_lat: "",
        address_lng: "",
        files: [],
        description: "",
        slug: "",
        parent_id: "",
        status: "",
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
            title: "Community",
            message: "Storing community",
            status: "pending",
        });

        const apiUrl = "/api/communities";

        const formDataWithFiles = new FormData();
        formDataWithFiles.append("name", formData.name);
        formDataWithFiles.append("address", formData.address);

        // Append each file to the FormData object
        // formData.files.forEach((file, index) => {
        //     formDataWithFiles.append(`file${index + 1}`, file);
        // });

        Array.from(formData.files).forEach((file, index) => {
            formDataWithFiles.append(`files`, file);
        });

        formDataWithFiles.append("address_lat", formData.address_lat);
        formDataWithFiles.append("address_lng", formData.address_lng);
        formDataWithFiles.append("description", formData.description);
        formDataWithFiles.append("slug", formData.slug);
        formDataWithFiles.append("parent_id", formData.parent_id);
        formDataWithFiles.append("status", formData.status);
        formDataWithFiles.append("meta", formData.meta);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formDataWithFiles,
            });

            if (response.ok) {
                notificationCtx.showNotification({
                    title: "Community",
                    message: "Community stored successfully",
                    status: "success",
                });
                router.push("/admin-panel/communities");
                console.log("Form submitted successfully!");
            } else {
                const errorData = await response.json();
                const errorMessage =
                    errorData.message || "Something went wrong";
                notificationCtx.showNotification({
                    title: "Community",
                    message: errorMessage,
                    status: "error",
                });
                console.error("Form submission failed:", errorMessage);
                setSubmitDisabled(false);
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Community",
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
                <Link href="/admin-panel/communities">Home</Link>
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
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Address Latitude:
                    <input
                        type="text"
                        name="address_lat"
                        value={formData.address_lat}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Address Longitude:
                    <input
                        type="text"
                        name="address_lng"
                        value={formData.address_lng}
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
                    Parent Id:
                    <input
                        type="text"
                        name="parent_id"
                        value={formData.parent_id}
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
                    Meta:
                    <input
                        type="text"
                        name="meta"
                        value={formData.meta}
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

export default CommunityCreate;
