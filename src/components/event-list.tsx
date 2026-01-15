'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    capacity: number;
    _count: {
        attendees: number;
    }
};

export function EventList() {
    const queryClient = useQueryClient();
    const { data: events, isLoading, error } = useQuery<Event[]>({
        queryKey: ['events'],
        queryFn: async () => {
            const res = await fetch('/api/events');
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete');
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['events'] });
            const previousEvents = queryClient.getQueryData(['events']);
            queryClient.setQueryData(['events'], (old: Event[]) => old.filter(e => e.id !== id));
            return { previousEvents };
        },
        onError: (_err, _newTodo, context) => {
            queryClient.setQueryData(['events'], context?.previousEvents);
            toast.error("Failed to delete event");
        },
        onSuccess: () => {
            toast.success("Event deleted");
            queryClient.invalidateQueries({ queryKey: ['events'] });
        },
    });

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="flex flex-col">
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="flex-1">
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) return <div className="text-red-500">Failed to load events.</div>;

    if (!events || events.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50/50">
                <p className="text-muted-foreground text-lg">No events found</p>
                <p className="text-sm text-gray-400">Create one to get started!</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
                <Card key={event.id} className="flex flex-col transition-all hover:shadow-md">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="line-clamp-1 text-xl">{event.title}</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive/90"
                                onClick={() => {
                                    if (confirm('Are you sure?')) deleteMutation.mutate(event.id)
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(event.date), 'PPP p')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{event.description}</p>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <Users className="h-4 w-4" />
                            <span>{event._count.attendees} / {event.capacity} Attendees</span>
                        </div>
                        {/* Progress bar could go here */}
                        <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-500 ease-out"
                                style={{ width: `${Math.min((event._count.attendees / event.capacity) * 100, 100)}%` }}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href={`/events/${event.id}`}>Manage Event</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
