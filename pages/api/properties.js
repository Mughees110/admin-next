import { MongoClient, ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import fs from "fs";
import { useSession, signIn, signOut, getSession } from "next-auth/react";
async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI, {});

    await client.connect();

    return client;
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.resolve("./public/uploads");
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    const session = await getSession({ req: req });
    console.log(session.user.email);
    if (!session) {
        res.status(401).json({ message: "Not authenticated!" });
        return;
    }
    const { method } = req;
    switch (method) {
        case "GET":
            try {
                const client = await connectToDatabase();
                const db = client.db();

                // Check if an ID is provided in the query parameters
                const { id } = req.query;

                if (id) {
                    console.log("here");
                    // Fetch details of a specific community by ID
                    const amenety = await db
                        .collection("properties")
                        .findOne({ _id: new ObjectId(id) });

                    client.close();

                    if (amenety) {
                        console.log("myself");
                        return res.status(201).json(amenety);
                    } else {
                        return res
                            .status(404)
                            .json({ message: "Property not found" });
                    }
                } else {
                    // Fetch all records from the 'ameneties' collection
                    const ameneties = await db
                        .collection("properties")
                        .find()
                        .toArray();

                    client.close();

                    return res.status(201).json(ameneties);
                }
            } catch (error) {
                console.error("Error fetching properties:", error);
                return res
                    .status(500)
                    .json({ message: "Internal Server Error" });
            }

        case "POST":
            try {
                const uploadMiddleware = upload.array("files");

                uploadMiddleware(req, res, async (err) => {
                    if (err instanceof multer.MulterError) {
                        console.error("Multer error:", err);
                        return res
                            .status(500)
                            .json({ message: "Internal Server Error" });
                    } else if (err) {
                        console.error("Error handling upload:", err);
                        return res
                            .status(500)
                            .json({ message: "Internal Server Error" });
                    }

                    const {
                        count,
                        Ad_Type,
                        Unit_Type,
                        Unit_Model,
                        Primary_View,
                        Unit_Builtup_Area,
                        No_of_Bathroom,
                        Property_Title,
                        Web_Remarks,
                        Emirate,
                        Community,
                        Exclusive,
                        Cheques,
                        Plot_Area,
                        Property_Name,
                        Property_Ref_No,
                        Listing_Agent,
                        Listing_Agent_Phone,
                        Listing_Date,
                        Last_Updated,
                        Bedrooms,
                        Listing_Agent_Email,
                        Price,
                        Unit_Reference_No,
                        No_of_Rooms,
                        Latitude,
                        Longitude,
                        unit_measure,
                        Featured,
                        Fitted,
                        company_name,
                        Web_Tour,
                        Threesixty_Tour,
                        Audio_Tour,
                        Virtual_Tour,
                        QR_Code,
                        company_logo,
                        Parking,
                        Strno,
                        PreviewLink,
                        price_on_application,
                        off_plan,
                        permit_number,
                        completion_status,
                    } = req.body;

                    const client = await connectToDatabase();
                    const db = client.db();

                    // Save the data to MongoDB
                    const result = await db.collection("properties").insertOne({
                        count,
                        Ad_Type,
                        Unit_Type,
                        Unit_Model,
                        Primary_View,
                        Unit_Builtup_Area,
                        No_of_Bathroom,
                        Property_Title,
                        Web_Remarks,
                        Emirate,
                        Community,
                        Exclusive,
                        Cheques,
                        Plot_Area,
                        Property_Name,
                        Property_Ref_No,
                        Listing_Agent,
                        Listing_Agent_Phone,
                        Listing_Date,
                        Last_Updated,
                        Bedrooms,
                        Listing_Agent_Email,
                        Price,
                        Unit_Reference_No,
                        No_of_Rooms,
                        Latitude,
                        Longitude,
                        unit_measure,
                        Featured,
                        Fitted,
                        company_name,
                        Web_Tour,
                        Threesixty_Tour,
                        Audio_Tour,
                        Virtual_Tour,
                        QR_Code,
                        company_logo,
                        Parking,
                        Strno,
                        PreviewLink,
                        price_on_application,
                        off_plan,
                        permit_number,
                        completion_status,
                        files: req.files.map((file) => file.originalname),
                    });

                    client.close();

                    return res.status(201).json({
                        message: "Property added successfully",
                        result,
                    });
                });
                break;
            } catch (error) {
                console.error("Error saving property:", error);
                return res
                    .status(500)
                    .json({ message: "Internal Server Error" });
            }

        case "PUT":
            try {
                const uploadMiddleware = upload.array("files");

                uploadMiddleware(req, res, async (err) => {
                    if (err instanceof multer.MulterError) {
                        console.error("Multer error:", err);
                        return res
                            .status(500)
                            .json({ message: "Internal Server Error" });
                    } else if (err) {
                        console.error("Error handling upload:", err);
                        return res
                            .status(500)
                            .json({ message: "Internal Server Error" });
                    }

                    const {
                        id,
                        count,
                        Ad_Type,
                        Unit_Type,
                        Unit_Model,
                        Primary_View,
                        Unit_Builtup_Area,
                        No_of_Bathroom,
                        Property_Title,
                        Web_Remarks,
                        Emirate,
                        Community,
                        Exclusive,
                        Cheques,
                        Plot_Area,
                        Property_Name,
                        Property_Ref_No,
                        Listing_Agent,
                        Listing_Agent_Phone,
                        Listing_Date,
                        Last_Updated,
                        Bedrooms,
                        Listing_Agent_Email,
                        Price,
                        Unit_Reference_No,
                        No_of_Rooms,
                        Latitude,
                        Longitude,
                        unit_measure,
                        Featured,
                        Fitted,
                        company_name,
                        Web_Tour,
                        Threesixty_Tour,
                        Audio_Tour,
                        Virtual_Tour,
                        QR_Code,
                        company_logo,
                        Parking,
                        Strno,
                        PreviewLink,
                        price_on_application,
                        off_plan,
                        permit_number,
                        completion_status,
                    } = req.body;
                    console.log(id);

                    const client = await connectToDatabase();
                    const db = client.db();

                    //const files = req.files.map((file) => file.originalname);

                    //if (files.length == 0) {
                    //const { files } = req.body;

                    //}

                    // Save the data to MongoDB
                    const result = await db.collection("properties").updateOne(
                        { _id: new ObjectId(id) },
                        {
                            $set: {
                                count,
                                Ad_Type,
                                Unit_Type,
                                Unit_Model,
                                Primary_View,
                                Unit_Builtup_Area,
                                No_of_Bathroom,
                                Property_Title,
                                Web_Remarks,
                                Emirate,
                                Community,
                                Exclusive,
                                Cheques,
                                Plot_Area,
                                Property_Name,
                                Property_Ref_No,
                                Listing_Agent,
                                Listing_Agent_Phone,
                                Listing_Date,
                                Last_Updated,
                                Bedrooms,
                                Listing_Agent_Email,
                                Price,
                                Unit_Reference_No,
                                No_of_Rooms,
                                Latitude,
                                Longitude,
                                unit_measure,
                                Featured,
                                Fitted,
                                company_name,
                                Web_Tour,
                                Threesixty_Tour,
                                Audio_Tour,
                                Virtual_Tour,
                                QR_Code,
                                company_logo,
                                Parking,
                                Strno,
                                PreviewLink,
                                price_on_application,
                                off_plan,
                                permit_number,
                                completion_status,
                            },
                        }
                    );

                    if (result.acknowledged) {
                        client.close();
                        return res.status(200).json({
                            message: "Property updated successfully",
                        });
                    } else {
                        client.close();
                        return res
                            .status(404)
                            .json({ message: "Property not found" });
                    }
                });
                break;
            } catch (error) {
                console.error("Error saving Property:", error);
                return res
                    .status(500)
                    .json({ message: "Internal Server Error" });
            }

        case "DELETE":
            try {
                const { id } = req.query;
                console.log(id);
                const client = await connectToDatabase();
                const db = client.db();

                // Delete the data from MongoDB
                const result = await db
                    .collection("properties")
                    .deleteOne({ _id: new ObjectId(id) });

                client.close();
                console.log(result);

                if (result.deletedCount > 0) {
                    return res
                        .status(200)
                        .json({ message: "Property deleted successfully" });
                } else {
                    return res
                        .status(404)
                        .json({ message: "Property not found" });
                }
            } catch (error) {
                console.error("Error deleting Property:", error);
                return res
                    .status(500)
                    .json({ message: "Internal Server Error" });
            }

        default:
            return res.status(405).json({ message: "Method Not Allowed" });
    }
}
