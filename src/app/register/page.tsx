'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Calendar, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    capacity: number;
    category: string;
    location: string;
    status: string;
    _count: {
        attendees: number;
    }
};

export default function RegisterPage() {
    const { data: events, isLoading, error } = useQuery<Event[]>({
        queryKey: ['public-events'],
        queryFn: async () => {
            const res = await fetch('/api/events');
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
    });

    // Filter upcoming events only
    const upcomingEvents = events?.filter(e => new Date(e.date) > new Date()) || [];

    if (isLoading) {
        return (
            <div className="container mx-auto py-10 px-4 max-w-7xl">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight">Register for Events</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Browse upcoming events and register
                    </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="flex flex-col">
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-20 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <div className="container mx-auto py-20 text-center text-red-500">Failed to load events.</div>;

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight">Register for Events</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Browse upcoming events and register to attend
                </p>
            </div>

            {!upcomingEvents || upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50/50">
                    <p className="text-muted-foreground text-lg">No upcoming events available</p>
                    <p className="text-sm text-gray-400 mt-2">Check back later for new events!</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => {
                        const isFull = event._count.attendees >= event.capacity;
                        const spotsLeft = event.capacity - event._count.attendees;

                        return (
                            <Card key={event.id} className="flex flex-col transition-all hover:shadow-md">
                                <CardHeader>
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <Badge variant="outline">{event.category}</Badge>
                                        {isFull && <Badge variant="destructive">Full</Badge>}
                                    </div>
                                    <CardTitle className="line-clamp-1 text-xl">{event.title}</CardTitle>
                                    <CardDescription className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {format(new Date(event.date), 'PPP p')}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {event.location}
                                        </div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{event.description}</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Users className="h-4 w-4" />
                                        <span className={spotsLeft <= 5 && spotsLeft > 0 ? 'text-orange-600 font-medium' : ''}>
                                            {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Event is full'}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button asChild className="w-full" disabled={isFull}>
                                        <Link href={`/events/${event.id}`}>
                                            {isFull ? 'Event Full' : 'View & Register'}
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </main>
    );
}
