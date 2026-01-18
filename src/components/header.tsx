'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Users, UserPlus, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Attendees', href: '/attendees', icon: Users },
    { name: 'Register', href: '/register', icon: UserPlus },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="border-b">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="text-2xl font-bold">
                        MeraEvents
                    </Link>

                    <nav className="flex gap-6">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary',
                                        isActive ? 'text-primary' : 'text-muted-foreground'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </header>
    );
}
