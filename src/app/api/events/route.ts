import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { eventSchema } from '@/lib/schemas';

export async function GET() {
    try {
        const events = await db.event.findMany({
            orderBy: { date: 'asc' },
            include: {
                _count: {
                    select: { attendees: true },
                },
            },
        });
        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();
        const body = eventSchema.parse({
            ...json,
            capacity: Number(json.capacity),
        });

        const event = await db.event.create({
            data: {
                title: body.title,
                description: body.description,
                date: new Date(body.date),
                capacity: body.capacity,
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
