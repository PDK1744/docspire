import { Card } from '@/components/ui/card';

export default function SettingsLayout({ children }) {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white-800 mb-2">Settings</h1>
                <p className="text-white-600">Manage your account and company preferences</p>
            </div>
            
            <div className="space-y-8">
                {children}
            </div>
        </div>
    );
}