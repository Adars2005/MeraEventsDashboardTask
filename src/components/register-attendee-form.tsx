'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { attendeeSchema } from '@/lib/schemas';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export function RegisterAttendeeForm({ eventId, onSuccess }: { eventId: string, onSuccess?: () => void }) {
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof attendeeSchema>>({
        resolver: zodResolver(attendeeSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof attendeeSchema>) => {
            const response = await fetch(`/api/events/${eventId}/attendees`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to register');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events', eventId] }); // For count update
            queryClient.invalidateQueries({ queryKey: ['attendees', eventId] }); // For list update
            toast.success('Attendee registered successfully');
            form.reset();
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input placeholder="john@example.com" type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Registering...' : 'Register Attendee'}
                </Button>
            </form>
        </Form>
    );
}
