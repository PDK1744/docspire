import { Card } from '@/components/ui/card';

export default function SettingsLayout({ children }) {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4 bg-[var(--card-background)] rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <Card className="p-6 shadow-lg">{children}</Card>
        </div>
    );
}