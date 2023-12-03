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
function VacationEdit() {
    const router = useRouter();
    const [vacation, setVacation] = useState({});
    const [upload, setUpload] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);

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
        geopoints: "",

        // Use an array to store multiple files
    });

    useEffect(() => {
        const fetchVacation = async () => {
            const { id } = await router.query;
            if (id) {
                try {
                    const url = "/api/vacations?id=" + id;
                    console.log(url);
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setVacation(data);
                        console.log(data);
                        setFormData({
                            id: data._id,
                            reference_number: data.reference_number,
                            offering_type: data.offering_type,
                            property_type: data.property_type,
                            price_on_application: data.price_on_application,
                            price: data.price,
                            rental_period: data.rental_period,
                            cheques: data.cheques,
                            city: data.city,
                            community: data.community,
                            sub_community: data.sub_community,
                            property_name: data.property_name,
                            title_en: data.title_en,
                            description_en: data.description_en,
                            amenities: data.amenities,
                            size: data.size,
                            bedroom: data.bedroom,
                            bathroom: data.bathroom,
                            agent: data.agent,
                            parking: data.parking,
                            furnished: data.furnished,
                            view360: data.view360,
                            geopoints: data.geopoints,
                        });
                    } else {
                        console.error("Error fetching vacation.");
                    }
                } catch (error) {
                    console.error("Error fetching vacation:", error);
                }
            }
        };

        fetchVacation();
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
            title: "Vacation",
            message: "Updating vacation",
            status: "pending",
        });

        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/vacations";
        const formDataWithFiles = new FormData();
        formDataWithFiles.append("id", formData.id);
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
        formDataWithFiles.append("geopoints", formData.geopoints);

        // Append each file to the FormData object
        // formData.files.forEach((file, index) => {
        //     formDataWithFiles.append(`file${index + 1}`, file);
        // });

        // Append each file to the FormData object
        // formData.files.forEach((file, index) => {
        //     formDataWithFiles.append(`file${index + 1}`, file);
        // });

        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                body: formDataWithFiles,
            });
            console.log(formData);
            if (response.ok) {
                notificationCtx.showNotification({
                    title: "Vacation",
                    message: "Vacation updated successfully",
                    status: "success",
                });
                router.push("/admin-panel/vacations");
                console.log("Form submitted successfully!");
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Vacation",
                    message: "Something went wrong while submitting",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Vacation",
                message: "Something went wrong while submitting",
                status: "error",
            });
            setSubmitDisabled(false);
            console.error("Error submitting form:", error);
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
            {vacation && (
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {renderFormFields()}
                    <br />

                    <br />
                    <button type="submit" disabled={isSubmitDisabled}>
                        Submit
                    </button>
                </form>
            )}
        </>
    );
}
export default VacationEdit;
