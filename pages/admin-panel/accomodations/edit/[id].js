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
function AccomodationEdit() {
    const router = useRouter();
    const [accomodation, setAccomodation] = useState({});
    const [upload, setUpload] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        short_name: "",
        files: [],
        // Use an array to store multiple files
    });

    useEffect(() => {
        const fetchAccomodation = async () => {
            const { id } = await router.query;
            if (id) {
                try {
                    const url = "/api/accomodations?id=" + id;
                    console.log(url);
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setAccomodation(data);
                        console.log(data);
                        setFormData({
                            name: data.name,
                            short_name: data.short_name,
                            id: data._id,
                            files: data.files,
                        });
                    } else {
                        console.error("Error fetching community.");
                    }
                } catch (error) {
                    console.error("Error fetching community:", error);
                }
            }
        };

        fetchAccomodation();
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
            title: "Accomodation",
            message: "Updating accomodation",
            status: "pending",
        });

        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/accomodations";
        const formDataWithFiles = new FormData();
        formDataWithFiles.append("id", formData.id);
        formDataWithFiles.append("name", formData.name);
        formDataWithFiles.append("short_name", formData.short_name);

        // Append each file to the FormData object
        // formData.files.forEach((file, index) => {
        //     formDataWithFiles.append(`file${index + 1}`, file);
        // });

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                body: formDataWithFiles,
            });

            if (response.ok) {
                notificationCtx.showNotification({
                    title: "Accomodation",
                    message: "Accomodation updated successfully",
                    status: "success",
                });
                router.push("/admin-panel/accomodations");
                console.log("Form submitted successfully!");
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Accomodation",
                    message: "Something went wrong while submitting",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Accomodation",
                message: "Something went wrong while submitting",
                status: "error",
            });
            setSubmitDisabled(false);
            console.error("Error submitting form:", error);
        }
    };
    return (
        <>
            {accomodation && (
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
            )}
        </>
    );
}
export default AccomodationEdit;
