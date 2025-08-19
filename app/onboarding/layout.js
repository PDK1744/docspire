import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function OnboardingLayout({ children }) {
    const supabase = await createClient();
    const {
        data: { user },
        error
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect("/sign-in");
    }

    return (
        <div>
            {children}
        </div>
    );
}