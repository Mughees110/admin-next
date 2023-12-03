const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
import fetch from "node-fetch";
import { MongoClient, ObjectId } from "mongodb";
async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI, {});

    await client.connect();

    return client;
}
export default async function handler(req, res) {
    try {
        const parser = new XMLParser();
        const xmlUrl =
            "http://xml.propspace.com/feed/xml.php?cl=3457&pid=8245&acc=8807";
        const response = await fetch(xmlUrl);
        const xmlText = await response.text();

        // Parse the XML data using fast-xml-parser
        const jsonData = parser.parse(xmlText);
        const dataArray = jsonData.Listings.Listing;
        const client = await connectToDatabase();
        const db = client.db();
        for (let i = 0; i < 5; i++) {
            const data = dataArray[i];
            const filter = { Unit_Reference_No: data.Unit_Reference_No }; // Specify the filter for finding the document

            // Perform the findOne operation
            const existingDocument = await db
                .collection("properties")
                .findOne(filter);
            //return res.status(200).json({ message: existingDocument });

            //const { Unit_Reference_No } = data;
            // return res.status(200).json({ message: Unit_Reference_No });
            if (!existingDocument) {
                // Save the data to MongoDB
                const result2 = await db.collection("properties").insertOne({
                    ...data,
                });
            }
            if (existingDocument) {
                const update = {
                    $set: {
                        ...data,
                    },
                };
                const options = {
                    returnDocument: "after", // Return the updated document
                };
                const result3 = await db
                    .collection("properties")
                    .findOneAndUpdate(filter, update, options);
            }
        }
        client.close();
        return res.status(200).json({ message: "parsed successfully" });
        //const filter = { Unit_Reference_No: data.Unit_Reference_No }; // Specify the filter for finding the document
    } catch (error) {
        console.error("Error while parsing:", error);
        return res.status(500).json({ message: "Error while parsing" });
    }
}
