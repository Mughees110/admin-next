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
function AmenityCreate(props) {
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const router = useRouter();
    const notificationCtx = useContext(NotificationContext);

    const [formData, setFormData] = useState({
        name: "",
        short_name: "",
        files: [],
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
            title: "Amenity",
            message: "Storing amenity",
            status: "pending",
        });

        const apiUrl = "/api/ameneties";

        const formDataWithFiles = new FormData();
        formDataWithFiles.append("name", formData.name);
        formDataWithFiles.append("short_name", formData.short_name);

        // Append each file to the FormData object
        // formData.files.forEach((file, index) => {
        //     formDataWithFiles.append(`file${index + 1}`, file);
        // });

        Array.from(formData.files).forEach((file, index) => {
            formDataWithFiles.append(`files`, file);
        });

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formDataWithFiles,
            });

            if (response.ok) {
                notificationCtx.showNotification({
                    title: "Amenity",
                    message: "Amenity stored successfully",
                    status: "success",
                });
                router.push("/admin-panel/amenities");
                console.log("Form submitted successfully!");
            } else {
                const errorData = await response.json();
                const errorMessage =
                    errorData.message || "Something went wrong";
                notificationCtx.showNotification({
                    title: "Amenity",
                    message: errorMessage,
                    status: "error",
                });
                console.error("Form submission failed:", errorMessage);
                setSubmitDisabled(false);
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Amenity",
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
                <Link href="/admin-panel/amenities">Home</Link>
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
                    Short Name:
                    <input
                        type="text"
                        name="short_name"
                        value={formData.short_name}
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
                <button type="submit" disabled={isSubmitDisabled}>
                    Submit
                </button>
            </form>
        </>
    );
}

export default AmenityCreate;
