import { Post } from '@/types/Post';
import { query } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from './manageDB';
import { NextRequest, NextResponse } from 'next/server';
 
export async function GET(req: NextRequest) {
    // Handle GET request
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('query'); // Get the value of the 'query' parameter
    
    if (!query) {
        return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
    }

    try {
        // If it looks like an ID (exact match query), return more results to ensure we find the right one
        const isIdQuery = query.startsWith('"') && query.endsWith('"');
        const topK = isIdQuery ? 10 : 2;
        
        const result = await queryDatabase(query, topK);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to query database' },
            { status: 500 }
        );
    }
}

