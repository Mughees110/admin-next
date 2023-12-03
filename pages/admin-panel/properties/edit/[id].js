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
function PropertyEdit() {
    const router = useRouter();
    const [property, setProperty] = useState({});
    const [upload, setUpload] = useState(false);
    const notificationCtx = useContext(NotificationContext);
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);

    const [formData, setFormData] = useState({
        files: [],
        count: "",
        Ad_Type: "",
        Unit_Type: "",
        Unit_Model: "",
        Primary_View: "",
        Unit_Builtup_Area: "",
        No_of_Bathroom: "",
        Property_Title: "",
        Web_Remarks: "",
        Emirate: "",
        Community: "",
        Exclusive: "",
        Cheques: "",
        Plot_Area: "",
        Property_Name: "",
        Property_Ref_No: "",
        Listing_Agent: "",
        Listing_Agent_Phone: "",
        Listing_Date: "",
        Last_Updated: "",
        Bedrooms: "",
        Listing_Agent_Email: "",
        Price: "",
        Unit_Reference_No: "",
        No_of_Rooms: "",
        Latitude: "",
        Longitude: "",
        unit_measure: "",
        Featured: "",
        Fitted: "",
        company_name: "",
        Web_Tour: "",
        Threesixty_Tour: "",
        Audio_Tour: "",
        Virtual_Tour: "",
        QR_Code: "",
        company_logo: "",
        Parking: "",
        Strno: "",
        PreviewLink: "",
        price_on_application: "",
        off_plan: "",
        permit_number: "",
        completion_status: "",

        // Use an array to store multiple files
    });

    useEffect(() => {
        const fetchProperty = async () => {
            const { id } = await router.query;
            if (id) {
                try {
                    const url = "/api/properties?id=" + id;
                    console.log(url);
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setProperty(data);
                        console.log(data);
                        setFormData({
                            id: data._id,
                            count: data.count,
                            Ad_Type: data.Ad_Type,
                            Unit_Type: data.Unit_Type,
                            Unit_Model: data.Unit_Model,
                            Primary_View: data.Primary_View,
                            Unit_Builtup_Area: data.Unit_Builtup_Area,
                            No_of_Bathroom: data.No_of_Bathroom,
                            Property_Title: data.Property_Title,
                            Web_Remarks: data.Web_Remarks,
                            Emirate: data.Emirate,
                            Community: data.Community,
                            Exclusive: data.Exclusive,
                            Cheques: data.Cheques,
                            Plot_Area: data.Plot_Area,
                            Property_Name: data.Property_Name,
                            Property_Ref_No: data.Property_Ref_No,
                            Listing_Agent: data.Listing_Agent,
                            Listing_Agent_Phone: data.Listing_Agent_Phone,
                            Listing_Date: data.Listing_Date,
                            Last_Updated: data.Last_Updated,
                            Bedrooms: data.Bedrooms,
                            Listing_Agent_Email: data.Listing_Agent_Email,
                            Price: data.Price,
                            Unit_Reference_No: data.Unit_Reference_No,
                            No_of_Rooms: data.No_of_Rooms,
                            Latitude: data.Latitude,
                            Longitude: data.Longitude,
                            unit_measure: data.unit_measure,
                            Featured: data.Featured,
                            Fitted: data.Fitted,
                            company_name: data.company_name,
                            Web_Tour: data.Web_Tour,
                            Threesixty_Tour: data.Threesixty_Tour,
                            Audio_Tour: data.Audio_Tour,
                            Virtual_Tour: data.Virtual_Tour,
                            QR_Code: data.QR_Code,
                            company_logo: data.company_logo,
                            Parking: data.Parking,
                            Strno: data.Strno,
                            PreviewLink: data.PreviewLink,
                            price_on_application: data.price_on_application,
                            off_plan: data.off_plan,
                            permit_number: data.permit_number,
                            completion_status: data.completion_status,
                        });
                    } else {
                        console.error("Error fetching property.");
                    }
                } catch (error) {
                    console.error("Error fetching property:", error);
                }
            }
        };

        fetchProperty();
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
            title: "Property",
            message: "Updating property",
            status: "pending",
        });

        // Assuming your API endpoint is https://example.com/api/contact
        const apiUrl = "/api/properties";
        const formDataWithFiles = new FormData();
        formDataWithFiles.append("id", formData.id);
        formDataWithFiles.append("count", formData.count);
        formDataWithFiles.append("Ad_Type", formData.Ad_Type);
        formDataWithFiles.append("Unit_Type", formData.Unit_Type);
        formDataWithFiles.append("Unit_Model", formData.Unit_Model);
        formDataWithFiles.append("Primary_View", formData.Primary_View);
        formDataWithFiles.append(
            "Unit_Builtup_Area",
            formData.Unit_Builtup_Area
        );
        formDataWithFiles.append("No_of_Bathroom", formData.No_of_Bathroom);
        formDataWithFiles.append("Property_Title", formData.Property_Title);
        formDataWithFiles.append("Web_Remarks", formData.Web_Remarks);
        formDataWithFiles.append("Emirate", formData.Emirate);
        formDataWithFiles.append("Community", formData.Community);
        formDataWithFiles.append("Exclusive", formData.Exclusive);
        formDataWithFiles.append("Cheques", formData.Cheques);
        formDataWithFiles.append("Plot_Area", formData.Plot_Area);
        formDataWithFiles.append("Property_Name", formData.Property_Name);
        formDataWithFiles.append("Property_Ref_No", formData.Property_Ref_No);
        formDataWithFiles.append("Listing_Agent", formData.Listing_Agent);
        formDataWithFiles.append(
            "Listing_Agent_Phone",
            formData.Listing_Agent_Phone
        );
        formDataWithFiles.append("Listing_Date", formData.Listing_Date);
        formDataWithFiles.append("Last_Updated", formData.Last_Updated);
        formDataWithFiles.append("Bedrooms", formData.Bedrooms);
        formDataWithFiles.append(
            "Listing_Agent_Email",
            formData.Listing_Agent_Email
        );
        formDataWithFiles.append("Price", formData.Price);
        formDataWithFiles.append(
            "Unit_Reference_No",
            formData.Unit_Reference_No
        );
        formDataWithFiles.append("No_of_Rooms", formData.No_of_Rooms);
        formDataWithFiles.append("Latitude", formData.Latitude);
        formDataWithFiles.append("Longitude", formData.Longitude);
        formDataWithFiles.append("unit_measure", formData.unit_measure);
        formDataWithFiles.append("Featured", formData.Featured);
        formDataWithFiles.append("Fitted", formData.Fitted);
        formDataWithFiles.append("company_name", formData.company_name);
        formDataWithFiles.append("Web_Tour", formData.Web_Tour);
        formDataWithFiles.append("Threesixty_Tour", formData.Threesixty_Tour);
        formDataWithFiles.append("Audio_Tour", formData.Audio_Tour);
        formDataWithFiles.append("Virtual_Tour", formData.Audio_Tour);
        formDataWithFiles.append("company_logo", formData.company_logo);
        formDataWithFiles.append("QR_Code", formData.QR_Code);
        formDataWithFiles.append("Parking", formData.Parking);
        formDataWithFiles.append("Strno", formData.Strno);
        formDataWithFiles.append("PreviewLink", formData.Strno);
        formDataWithFiles.append(
            "price_on_application",
            formData.price_on_application
        );
        formDataWithFiles.append("off_plan", formData.off_plan);
        formDataWithFiles.append("permit_number", formData.permit_number);
        formDataWithFiles.append(
            "completion_status",
            formData.completion_status
        );

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
                    title: "Property",
                    message: "Property updated successfully",
                    status: "success",
                });
                router.push("/admin-panel/properties");
                console.log("Form submitted successfully!");
                // You can handle success, redirect, or any other logic here.
            } else {
                notificationCtx.showNotification({
                    title: "Property",
                    message: "Something went wrong while submitting",
                    status: "error",
                });
                setSubmitDisabled(false);
                console.error("Form submission failed.");
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Property",
                message: "Something went wrong while submitting",
                status: "error",
            });
            setSubmitDisabled(false);
            console.error("Error submitting form:", error);
        }
    };
    const renderFormFields = () => {
        const keys = [
            "count",
            "Ad_Type",
            "Unit_Type",
            "Unit_Model",
            "Primary_View",
            "Unit_Builtup_Area",
            "No_of_Bathroom",
            "Property_Title",
            "Web_Remarks",
            "Emirate",
            "Community",
            "Exclusive",
            "Cheques",
            "Plot_Area",
            "Property_Name",
            "Property_Ref_No",
            "Listing_Agent",
            "Listing_Agent_Phone",
            "Listing_Date",
            "Last_Updated",
            "Bedrooms",
            "Listing_Agent_Email",
            "Price",
            "Unit_Reference_No",
            "No_of_Rooms",
            "Latitude",
            "Longitude",
            "unit_measure",
            "Featured",
            "Fitted",

            "company_name",
            "Web_Tour",
            "Threesixty_Tour",
            "Audio_Tour",
            "Virtual_Tour",
            "QR_Code",
            "company_logo",
            "Parking",
            "Strno",
            "PreviewLink",
            "price_on_application",
            "off_plan",
            "permit_number",
            "completion_status",
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
            {property && (
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
export default PropertyEdit;
