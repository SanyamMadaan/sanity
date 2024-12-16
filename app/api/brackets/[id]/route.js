import dbConnect from '../../../../lib/dbConnect';
import Bracket from '../../../../model/Bracket';
import { NextResponse } from 'next/server';
import mockBrackets from './mockBrackets';

export async function GET(request, { params }) {
    const { id } = params;
    console.log('Fetching bracket with ID:', id);
    try {
        await dbConnect();
        // const bracket = await Bracket.findById(id);
        // if (!bracket) {
        //     console.log('Bracket not found');
        //     return NextResponse.json({ error: 'Bracket not found' }, { status: 404 });
        // }
        return NextResponse.json(mockBrackets);
    } catch (error) {
        console.error('Error fetching bracket:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}