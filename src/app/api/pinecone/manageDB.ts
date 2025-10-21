// Import the Pinecone library
import { Pinecone } from "@pinecone-database/pinecone";
import { Post } from "../../../types/Post";
import { create } from "domain";

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: "pcsk_4mjoTB_C4ZB4exCpBS5R1MiN9N57xhGn8p5E2QqWSdyVVHwBcMfyCDGWQpHUH9yZz22tG" });

// Create a dense index with integrated embedding
const indexName = "volunteer-me-pbm-2";

export const createDatabase = async () => {
	const indexes = await pc.listIndexes();
	if (indexes?.indexes?.some((index: { name: string }) => index.name === indexName)) {
		console.log(`Index ${indexName} already exists.`);
		return;
	}
	await pc.createIndexForModel({
		name: indexName,
		cloud: "aws",
		region: "us-east-1",
		embed: {
			model: "llama-text-embed-v2",
			fieldMap: { text: "post_content" },
		},
		waitUntilReady: true,
	});

	// Add some fake data
	const fake_data: Post[] = [
		{
			id: "1",
			title: "Animal Shelter Helper Needed",
			post_content: "Help us take care of our furry friends! We need volunteers to assist with feeding, walking, and general care of our shelter animals.",
			eventDate: "2025-11-15",
			eventTime: "09:00",
			location: "Portmore",
			volunteersNeeded: 5,
			requiredSkills: ["Animal handling", "Patience", "Basic pet care"],
			volunteers: [],
			comments: [],
		},
		{
			id: "2",
			title: "Beach Cleanup Event",
			post_content: "Join us for our monthly beach cleanup! Help keep our beaches clean and safe for wildlife.",
			eventDate: "2025-11-20",
			eventTime: "08:00",
			location: "Gun Boat beach",
			volunteersNeeded: 10,
			requiredSkills: ["Physical stamina", "Environmental awareness"],
			volunteers: [],
			comments: [],
		},
		{
			id: "3",
			title: "Food Bank Distribution",
			post_content: "Support our local community by helping distribute food to families in need.",
			eventDate: "2025-11-25",
			eventTime: "10:00",
			location: "UTech",
			volunteersNeeded: 8,
			requiredSkills: ["Organization", "Communication", "Physical lifting"],
			volunteers: [],
			comments: [],
		},
	];
	await addRecords(fake_data);
};

export const addRecords = async (records: Post[]) => {
	// Target the index
	const index = pc.index(indexName).namespace("example-namespace");

	// Convert Post objects to Pinecone-compatible format
	const pineconeRecords = records.map((record) => ({
        id: record.id,
		title: record.title,
		post_content: record.post_content,
		eventDate: record.eventDate,
		eventTime: record.eventTime,
		location: record.location,
		volunteersNeeded: record.volunteersNeeded.toString(),
		requiredSkills: JSON.stringify(record.requiredSkills),
		volunteers: JSON.stringify(record.volunteers),
		comments: JSON.stringify(record.comments),
	}));

	// Upsert the records into a namespace
	await index.upsertRecords(pineconeRecords);
};

export const queryDatabase = async (queryText: string, topK: number) => {
	const index = pc.index(indexName).namespace("example-namespace");
	// Search the dense index
	const results = await index.searchRecords({
		query: {
			topK,
			inputs: { text: queryText },
		},
	});

	// Print the results
	return results.result.hits;
};

await createDatabase();
