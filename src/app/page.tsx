'use client';

import { EventList } from '@/components/event-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
    return (
        <main className="container mx-auto py-10 px-4 max-w-7xl">
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Welcome to MeraEvents - Manage your events and attendees efficiently
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-10">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href="/events">Create New Event</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Manage Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/events">View All Events</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Manage Attendees</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/attendees">View All Attendees</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">Recent Events</h2>
            </div>

            <EventList />
        </main>
    );
}

