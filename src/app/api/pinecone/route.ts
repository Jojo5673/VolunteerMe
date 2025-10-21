import { Post } from '@/types/Post';
import { query } from 'firebase/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
import { queryDatabase } from './manageDB';
import { NextRequest, NextResponse } from 'next/server';
 
export async function GET(req: NextRequest) {
    // Handle GET request
    const searchParams = req.nextUrl.searchParams;
      const query = searchParams.get('query'); // Get the value of the 'query' parameter

    const result = await queryDatabase(query as string, 2);
    return NextResponse.json(result);
    
}