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
function CommunityEdit() {
    const router = useRouter();
    const [community, setCommunity] = useState({});
    const [upload, setUpload] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        id: "",
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

    useEffect(() => {
        const fetchCommunity = async () => {
            const { id } = await router.query;
            if (id) {
                try {
                    const url = "/api/communities?id=" + id;
                    console.log(url);
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setCommunity(data);
                        console.log(data);
                        setFormData({
                            name: data.name,
                            address: data.address,
                            id: data._id,
                            address_lat: data.address_lat,
                            address_lng: data.address_lng,
                            files: data.files,
                            description: data.description,
                            slug: data.slug,
                            parent_id: data.parent_id,
                            status: data.status,
                            meta: data.meta,
                        });
                    } else {
                        console.error("Error fetching community.");
                    }
                } catch (error) {
                    console.error("Error fetching community:", error);
                }
            }
        };

        fetchCommunity();
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
            title: "Community",
            message: "Updating community",
            status: "pending",
        });

        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/communities";
        const formDataWithFiles = new FormData();
        formDataWithFiles.append("id", formData.id);
        formDataWithFiles.append("name", formData.name);
        formDataWithFiles.append("address", formData.address);

        // Append each file to the FormData object
        // formData.files.forEach((file, index) => {
        //     formDataWithFiles.append(`file${index + 1}`, file);
        // });
        formDataWithFiles.append("address_lat", formData.address_lat);
        formDataWithFiles.append("address_lng", formData.address_lng);
        formDataWithFiles.append("description", formData.description);
        formDataWithFiles.append("slug", formData.slug);
        formDataWithFiles.append("parent_id", formData.parent_id);
        formDataWithFiles.append("status", formData.status);
        formDataWithFiles.append("meta", formData.meta);

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                body: formDataWithFiles,
            });

            if (response.ok) {
                notificationCtx.showNotification({
                    title: "Community",
                    message: "Community updated successfully",
                    status: "success",
                });
                router.push("/admin-panel/communities");
                console.log("Form submitted successfully!");
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Community",
                    message: "Something went wrong while submitting",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Community",
                message: "Something went wrong while submitting",
                status: "error",
            });
            setSubmitDisabled(false);
            console.error("Error submitting form:", error);
        }
    };
    return (
        <>
            {community && (
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
            )}
        </>
    );
}
export default CommunityEdit;
