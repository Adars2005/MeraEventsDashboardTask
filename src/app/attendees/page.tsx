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
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

type AttendeeWithEvent = {
    id: string;
    name: string;
    email: string;
    phone: string;
    registeredAt: string;
    event: {
        id: string;
        title: string;
    };
};

export default function AttendeesPage() {
    const { data: attendees, isLoading, error } = useQuery<AttendeeWithEvent[]>({
        queryKey: ['all-attendees'],
        queryFn: async () => {
            const res = await fetch('/api/attendees');
            if (!res.ok) throw new Error('Failed to fetch attendees');
            return res.json();
        },
    });

    const handleExportCSV = () => {
        if (!attendees || attendees.length === 0) return;

        const headers = ['Name', 'Email', 'Phone', 'Event', 'Registered At'];
        const rows = attendees.map(a => [
            a.name,
            a.email,
            a.phone || 'N/A',
            a.event.title,
            format(new Date(a.registeredAt), 'PPP p')
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendees-${format(new Date(), 'yyyy-MM-dd')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Button asChild variant="ghost" className="mb-6">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">All Attendees</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        View and manage all registered attendees
                    </p>
                </div>

                {attendees && attendees.length > 0 && (
                    <Button onClick={handleExportCSV} size="lg" variant="outline" className="gap-2">
                        <Download className="h-5 w-5" />
                        Export CSV
                    </Button>
                )}
            </div>

            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            ) : error ? (
                <div className="text-red-500">Failed to load attendees</div>
            ) : !attendees || attendees.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                    No attendees registered yet
                </div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Event</TableHead>
                                <TableHead className="text-right">Registered At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attendees.map((attendee) => (
                                <TableRow key={attendee.id}>
                                    <TableCell className="font-medium">{attendee.name}</TableCell>
                                    <TableCell>{attendee.email}</TableCell>
                                    <TableCell>{attendee.phone || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Link href={`/events/${attendee.event.id}`} className="text-primary hover:underline">
                                            {attendee.event.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {format(new Date(attendee.registeredAt), 'PP p')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </main>
    );
}
