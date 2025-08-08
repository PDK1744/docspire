import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function OnboardingLayout({ children }) {
    const supabase = await createClient();
    const {
        data: { session },
        error
    } = await supabase.auth.getSession();

    if (error || !session) {
        redirect("/sign-in");
    }

    return (
        <div>
            {children}
        </div>
    );
}