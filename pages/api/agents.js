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
                    const agent = await db
                        .collection("agents")
                        .findOne({ _id: new ObjectId(id) });

                    client.close();

                    if (agent) {
                        console.log("myself");
                        return res.status(201).json(agent);
                    } else {
                        return res
                            .status(404)
                            .json({ message: "Agent not found" });
                    }
                } else {
                    // Fetch all records from the 'agents' collection
                    const agents = await db
                        .collection("agents")
                        .find()
                        .toArray();

                    client.close();

                    return res.status(201).json(agents);
                }
            } catch (error) {
                console.error("Error fetching agents:", error);
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
                        name,
                        email,
                        contact_number,
                        whatsapp_number,
                        status,
                        description,
                        slug,
                        designation,
                        department,
                        meta,
                    } = req.body;

                    const client = await connectToDatabase();
                    const db = client.db();

                    // Save the data to MongoDB
                    const result = await db.collection("agents").insertOne({
                        name,
                        email,
                        files: req.files.map((file) => file.originalname),
                        contact_number,
                        whatsapp_number,
                        status,
                        description,
                        slug,
                        designation,
                        department,
                        meta,
                    });

                    client.close();

                    return res.status(201).json({
                        message: "Agent added successfully",
                        result,
                    });
                });
                break;
            } catch (error) {
                console.error("Error saving community:", error);
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
                        name,
                        email,
                        contact_number,
                        whatsapp_number,
                        status,
                        description,
                        slug,
                        designation,
                        department,
                        meta,
                    } = req.body;

                    const client = await connectToDatabase();
                    const db = client.db();

                    //const files = req.files.map((file) => file.originalname);

                    //if (files.length == 0) {
                    //const { files } = req.body;

                    //}

                    // Save the data to MongoDB
                    const result = await db.collection("agents").updateOne(
                        { _id: new ObjectId(id) },
                        {
                            $set: {
                                name,
                                email,
                                contact_number,
                                whatsapp_number,
                                status,
                                description,
                                slug,
                                designation,
                                meta,
                                department,
                            },
                        }
                    );

                    if (result.acknowledged) {
                        client.close();
                        return res.status(200).json({
                            message: "Agent updated successfully",
                        });
                    } else {
                        client.close();
                        return res
                            .status(404)
                            .json({ message: "Agent not found" });
                    }
                });
                break;
            } catch (error) {
                console.error("Error saving agent:", error);
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
                    .collection("agents")
                    .deleteOne({ _id: new ObjectId(id) });

                client.close();
                console.log(result);

                if (result.deletedCount > 0) {
                    return res
                        .status(200)
                        .json({ message: "Agent deleted successfully" });
                } else {
                    return res.status(404).json({ message: "Agent not found" });
                }
            } catch (error) {
                console.error("Error deleting agent:", error);
                return res
                    .status(500)
                    .json({ message: "Internal Server Error" });
            }

        default:
            return res.status(405).json({ message: "Method Not Allowed" });
    }
}
