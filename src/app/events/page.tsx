'use client';

import { EventList } from '@/components/event-list';
import { CreateEventForm } from '@/components/create-event-form';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function EventsPage() {
    const [open, setOpen] = useState(false);

    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <Button asChild variant="ghost" className="mb-6">
                <Link href="/" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Link>
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">All Events</h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Manage and organize your events
                    </p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                            <Plus className="h-5 w-5" />
                            Create Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Create New Event</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to create a new event.
                            </DialogDescription>
                        </DialogHeader>
                        <CreateEventForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <EventList />
        </main>
    );
}
