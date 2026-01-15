import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { attendeeSchema } from '@/lib/schemas';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const attendees = await db.attendee.findMany({
            where: { eventId: id },
            orderBy: { registeredAt: 'desc' },
        });
        return NextResponse.json(attendees);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch attendees' }, { status: 500 });
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const json = await req.json();
        const body = attendeeSchema.parse(json);

        // Check capacity
        const event = await db.event.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { attendees: true }
                }
            }
        })

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        if (event._count.attendees >= event.capacity) {
            return NextResponse.json({ error: 'Event is full' }, { status: 400 });
        }

        const attendee = await db.attendee.create({
            data: {
                ...body,
                eventId: id,
            },
        });

        return NextResponse.json(attendee, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            // Unique constraint violation (P2002)
            // @ts-ignore
            if (error.code === 'P2002') {
                return NextResponse.json({ error: 'Email already registered for this event' }, { status: 409 });
            }
        }
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
