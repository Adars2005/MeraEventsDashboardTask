'use client';

import { useQuery } from '@tanstack/react-query';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { User, Mail, CalendarClock } from 'lucide-react';

type Attendee = {
    id: string;
    name: string;
    email: string;
    registeredAt: string;
};

export function AttendeeList({ eventId }: { eventId: string }) {
    const { data: attendees, isLoading, error } = useQuery<Attendee[]>({
        queryKey: ['attendees', eventId],
        queryFn: async () => {
            const res = await fetch(`/api/events/${eventId}/attendees`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
            </div>
        )
    }

    if (error) return <div className="text-destructive">Failed to load attendees.</div>;

    if (!attendees || attendees.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                No attendees registered yet.
            </div>
        )
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4" /> Name
                            </div>
                        </TableHead>
                        <TableHead>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" /> Email
                            </div>
                        </TableHead>
                        <TableHead className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <CalendarClock className="h-4 w-4" /> Registered At
                            </div>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {attendees.map((attendee) => (
                        <TableRow key={attendee.id}>
                            <TableCell className="font-medium">{attendee.name}</TableCell>
                            <TableCell>{attendee.email}</TableCell>
                            <TableCell className="text-right">
                                {format(new Date(attendee.registeredAt), 'PP p')}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
