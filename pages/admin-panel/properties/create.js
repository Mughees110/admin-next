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
function PropertyCreate(props) {
    const [isSubmitDisabled, setSubmitDisabled] = useState(false);
    const router = useRouter();
    const notificationCtx = useContext(NotificationContext);

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
        Images: "",
        Facilities: "",
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
            title: "Property",
            message: "Storing property",
            status: "pending",
        });

        const apiUrl = "/api/properties";

        const formDataWithFiles = new FormData();
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
        formDataWithFiles.append("Images", formData.Images);
        formDataWithFiles.append("Facilities", formData.Facilities);
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
                    title: "Property",
                    message: "Property stored successfully",
                    status: "success",
                });
                router.push("/admin-panel/properties");
                console.log("Form submitted successfully!");
            } else {
                const errorData = await response.json();
                const errorMessage =
                    errorData.message || "Something went wrong";
                notificationCtx.showNotification({
                    title: "Property",
                    message: errorMessage,
                    status: "error",
                });
                console.error("Form submission failed:", errorMessage);
                setSubmitDisabled(false);
            }
        } catch (error) {
            notificationCtx.showNotification({
                title: "Property",
                message: "Something went wrong while submitting",
                status: "error",
            });
            console.error("Error submitting form:", error);
            setSubmitDisabled(false);
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
            "Images",
            "Facilities",
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
            <h1>
                <Link href="/admin-panel/properties">Home</Link>
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

export default PropertyCreate;
