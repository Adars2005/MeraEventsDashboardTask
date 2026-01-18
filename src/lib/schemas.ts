import { z } from 'zod';

export const eventSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date",
    }),
    capacity: z.number().int().positive('Capacity must be a positive number'),
    category: z.string().min(1, 'Category is required'),
    location: z.string().min(1, 'Location is required'),
});

export const attendeeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});
