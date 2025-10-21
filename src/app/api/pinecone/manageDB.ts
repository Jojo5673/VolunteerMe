// Import the Pinecone library
import { Pinecone } from '@pinecone-database/pinecone'
import { Post } from '../../../types/Post';
import { create } from 'domain';

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: 'pcsk_4mjoTB_C4ZB4exCpBS5R1MiN9N57xhGn8p5E2QqWSdyVVHwBcMfyCDGWQpHUH9yZz22tG' });

// Create a dense index with integrated embedding
const indexName = 'volunteer-me';

export const createDatabase = async () => {
    const indexes = await pc.listIndexes();
    if (indexes?.indexes?.some((index: { name: string; }) => index.name === indexName)) {
        console.log(`Index ${indexName} already exists.`);
        return;
    }
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

await createDatabase();