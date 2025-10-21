// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'
import { Post } from '../types/Post';

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_PRIVATE_API_KEY! });

// Create a dense index with integrated embedding
const indexName = 'volunteerMe';

export const createDatabase = async () => {
    await pc.createIndexForModel({
    name: indexName,
    cloud: 'aws',
    region: 'us-east-1',
    embed: {
        model: 'llama-text-embed-v2',
        fieldMap: { text: 'post_content' },
    },
    waitUntilReady: true,
    });

    // Add some fake data
    const fake_data: Post[] = [
        { id: '1', title: 'First Post', post_content: 'This is the content of the first post.' },
        { id: '2', title: 'Second Post', post_content: 'This is the content of the second post.' },
        { id: '3', title: 'Third Post', post_content: 'Volunteer at animal shelter and make a difference!' },
    ];
    await addRecords(fake_data);
}

export const addRecords = async (records: Post[]) => {
    // Target the index
    const index = pc.index(indexName).namespace("example-namespace");

    // Upsert the records into a namespace
    await index.upsertRecords(records);
}

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
}