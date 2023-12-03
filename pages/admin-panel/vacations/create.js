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
function VacationCreate(props) {
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const router = useRouter();
    const notificationCtx = useContext(NotificationContext);

    const [formData, setFormData] = useState({
        files: [],
        reference_number: "",
        offering_type: "",
        property_type: "",
        price_on_application: "",
        price: "",
        rental_period: "",
        cheques: "",
        city: "",
        community: "",
        sub_community: "",
        property_name: "",
        title_en: "",
        description_en: "",
        amenities: "",
        size: "",
        bedroom: "",
        bathroom: "",
        agent: "",
        parking: "",
        furnished: "",
        view360: "",
        photo: "",
        geopoints: "",

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
            title: "Vacation",
            message: "Storing vacation",
            status: "pending",
        });

        const apiUrl = "/api/vacations";

        const formDataWithFiles = new FormData();

        formDataWithFiles.append("reference_number", formData.reference_number);
        formDataWithFiles.append("offering_type", formData.offering_type);
        formDataWithFiles.append("property_type", formData.property_type);
        formDataWithFiles.append(
            "price_on_application",
            formData.price_on_application
        );
        formDataWithFiles.append("price", formData.price);
        formDataWithFiles.append("rental_period", formData.rental_period);
        formDataWithFiles.append("cheques", formData.cheques);
        formDataWithFiles.append("city", formData.city);
        formDataWithFiles.append("community", formData.community);
        formDataWithFiles.append("sub_community", formData.sub_community);
        formDataWithFiles.append("property_name", formData.property_name);
        formDataWithFiles.append("title_en", formData.title_en);
        formDataWithFiles.append("description_en", formData.description_en);
        formDataWithFiles.append("amenities", formData.amenities);
        formDataWithFiles.append("size", formData.size);
        formDataWithFiles.append("bedroom", formData.bedroom);
        formDataWithFiles.append("bathroom", formData.bathroom);
        formDataWithFiles.append("agent", formData.agent);
        formDataWithFiles.append("parking", formData.parking);
        formDataWithFiles.append("furnished", formData.furnished);
        formDataWithFiles.append("view360", formData.view360);
        formDataWithFiles.append("photo", formData.photo);
        formDataWithFiles.append("geopoints", formData.geopoints);

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
                    title: "Vacation",
                    message: "Vacation stored successfully",
                    status: "success",
                });
                router.push("/admin-panel/vacations");
                console.log("Form submitted successfully!");
            } else {
                const errorData = await response.json();
                const errorMessage =
                    errorData.message || "Something went wrong";
                notificationCtx.showNotification({
                    title: "Vacation",
                    message: errorMessage,
                    status: "error",
                });
                console.error("Form submission failed:", errorMessage);
                setSubmitDisabled(false);
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Vacation",
                message: "Something went wrong while submitting",
                status: "error",
            });
            console.error("Error submitting form:", error);
            setSubmitDisabled(false);
        }
    };
    const renderFormFields = () => {
        const keys = [
            "reference_number",
            "offering_type",
            "property_type",
            "price_on_application",
            "price",
            "rental_period",
            "cheques",
            "city",
            "community",
            "sub_community",
            "property_name",
            "title_en",
            "description_en",
            "amenities",
            "size",
            "bedroom",
            "bathroom",
            "agent",
            "parking",
            "furnished",
            "view360",
            "photo",
            "geopoints",
        ];
        return keys.map((key) => (
            <>
                <label key={key}>
                    {key}:
                    <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                    />
                </label>
                <br />
            </>
        ));
    };

    return (
        <>
            <h1>
                <Link href="/admin-panel/vacations">Home</Link>
            </h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {renderFormFields()}
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

export default VacationCreate;
