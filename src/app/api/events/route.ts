import { NextRequest, NextResponse } from 'next/server';
import { Comment, Post, Volunteer } from '@/types/Post';
import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: 'pcsk_4mjoTB_C4ZB4exCpBS5R1MiN9N57xhGn8p5E2QqWSdyVVHwBcMfyCDGWQpHUH9yZz22tG' });
const indexName = 'volunteer-me-pbm-2';

async function getEventFromPinecone(eventId: string): Promise<Post | null> {
    const index = pc.index(indexName).namespace("example-namespace");
    
    // Search for the specific event
    const results = await index.searchRecords({
        query: {
            topK: 1,
            inputs: { text: eventId },
        },
    });

    if (results.result.hits.length === 0) return null;

    const eventData = results.result.hits[0];
    return {
        id: eventData._id,
        ...eventData.fields as unknown as Post
    };
}

async function updateEventInPinecone(event: Post) {
    const index = pc.index(indexName).namespace("example-namespace");
    await index.upsertRecord(event);
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const eventId = searchParams.get('eventId');

    if (!eventId) {
        return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    const event = await getEventFromPinecone(eventId);
    if (!event) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { eventId, action, data } = body;

        if (!eventId || !action) {
            return NextResponse.json({ error: 'Event ID and action are required' }, { status: 400 });
        }

        // Get current event data
        let event = await getEventFromPinecone(eventId);
        if (!event) {
            console.log("not found")
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        switch (action) {
            case 'volunteer':
                const volunteer: Volunteer = {
                    userId: data.userId,
                    userName: data.userName,
                    signupDate: new Date().toISOString()
                };
                
                // Check if user already volunteered
                if (!event.volunteers.some((v: Volunteer) => v.userId === volunteer.userId)) {
                    event.volunteers.push(volunteer);
                }
                break;

            case 'comment':
                const comment: Comment = {
                    id: Date.now().toString(),
                    userId: data.userId,
                    userName: data.userName,
                    content: data.content,
                    timestamp: new Date().toISOString()
                };
                event.comments = [...event.comments, comment];
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Update the event in Pinecone
        await updateEventInPinecone(event);
        return NextResponse.json(event);
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}