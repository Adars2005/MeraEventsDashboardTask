import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const attendees = await db.attendee.findMany({
            orderBy: { registeredAt: 'desc' },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
        return NextResponse.json(attendees);
    } catch (error) {
        console.error('Error fetching all attendees:', error);
        return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 });
    }
}
