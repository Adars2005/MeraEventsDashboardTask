'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AttendeeList } from '@/components/attendee-list';
import { RegisterAttendeeForm } from '@/components/register-attendee-form';
import { Calendar, Users, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type EventDetail = {
    id: string;
    title: string;
    description: string;
    date: string;
    capacity: number;
    _count: {
        attendees: number;
    }
};

export default function EventPage() {
    const { id } = useParams<{ id: string }>();

    const { data: event, isLoading, error } = useQuery<EventDetail>({
        queryKey: ['events', id],
        queryFn: async () => {
            const res = await fetch(`/api/events/${id}`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
    });

    if (isLoading) return (
        <div className="container mx-auto py-10 max-w-5xl space-y-8">
            <Skeleton className="h-8 w-32" />
            <div className="grid md:grid-cols-3 gap-8">
                <Skeleton className="h-[300px] col-span-2" />
                <Skeleton className="h-[300px]" />
            </div>
        </div>
    );

    if (error || !event) return <div className="container py-20 text-center">Event not found</div>;

    const isFull = event._count.attendees >= event.capacity;

    return (
        <main className="container mx-auto py-10 px-4 max-w-5xl">
            <Button asChild variant="ghost" className="mb-6 pl-0 hover:pl-2 transition-all">
                <Link href="/" className="flex items-center gap-2 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-4">{event.title}</h1>
                        <div className="flex items-center gap-6 text-muted-foreground mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                {format(new Date(event.date), 'PPP p')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                <span>{event._count.attendees} / {event.capacity} Registered</span>
                            </div>
                        </div>
                        <p className="text-lg leading-relaxed text-gray-700">{event.description}</p>
                    </div>

                    <Separator />

                    <div>
                        <h2 className="text-2xl font-bold tracking-tight mb-4">Registered Attendees</h2>
                        <AttendeeList eventId={id} />
                    </div>
                </div>

                <div>
                    <Card className="sticky top-6 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>Registration</CardTitle>
                            <CardDescription>Add a new attendee to this event.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isFull ? (
                                <div className="bg-destructive/10 text-destructive p-4 rounded-md text-center font-medium border border-destructive/20">
                                    Event is Full
                                </div>
                            ) : (
                                <RegisterAttendeeForm eventId={id} />
                            )}

                            <div className="mt-6 text-xs text-center text-muted-foreground">
                                <p>{event.capacity - event._count.attendees} spots remaining</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
