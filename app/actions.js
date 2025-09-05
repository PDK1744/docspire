"use server"

import { encodedRedirect } from "@/utils/utils"
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData) => {
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const supabase = await createClient();

    if (!email || !password || !confirmPassword || !name) {
        return encodedRedirect("error", "/sign-up", "All fields are required.");
    }

    if (password !== confirmPassword) {
        return encodedRedirect("error", "/sign-up", "Passwords do not match.");
    }
    if (password.length < 8) {
        return encodedRedirect("error", "/sign-up", "Password must be at least 8 characters long.");
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: name,
            }
        }
    });

    if (error) {
        console.error(error);
        return encodedRedirect("error", "/sign-up", error.message);
    }

    if (data?.user?.identities?.length === 0) {
        return encodedRedirect("error", "/sign-in", "Email already registered.");
    }

    return encodedRedirect("success", "/sign-in", "Welcome! Please Login to get started!");
};

export const signInAction = async (formData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const supabase = await createClient();



    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,

    });

    if (error) {
        return encodedRedirect("error", "/sign-in", error.message);

    }

    // After successful sign-in, get the user session
    const { data: { user } } = await supabase.auth.getUser();

    // Check if the user exists and has a company_id in the company_members table
    const { data: companyMember, error: companyError } = await supabase
        .from('company_members')
        .select('company_id')
        .eq('user_id', user.id)
        .single();

    if (companyError || !companyMember) {
        return redirect("/onboarding"); 
    }

    // check if the user is currently active
    const { data: userStatus, error: userStatusError} = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .eq('company_id', companyMember.company_id)
        .single();
    if (!userStatus || userStatus.status !== 'active' || userStatusError) {
        console.error("User is not active or an error occurred:", userStatusError);
        return encodedRedirect("error", "/sign-in", "Your account is not active. Please contact your administrator.");
    }


    return redirect("/dashboard")
};

export const forgotPasswordAction = async (formData) => {
    const email = formData.get("email")?.toString();
    const supabase = await createClient()
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Email is required",
        )
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/dashbaord/reset-password`,
    });

    if (error) {
        console.error(error.message)
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Could not reset password",
        )
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        "success",
        "/forgot-password",
        "If your email is in our system, you will receive instructions about how to reset your password",
    )
};

export const resetPasswordAction = async (formData) => {
    const supabase = await createClient();

    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!password || !confirmPassword) {
        encodedRedirect(
            "error",
            "/dashboard/reset-password",
            "Password and confirm password are required",
        )
    }

    if (password !== confirmPassword) {
        encodedRedirect(
            "error",
            "/dashboard/reset-password",
            "Passwords do not match",
        )
    }

    const { error } = await supabase.auth.updateUser({
        password
    });

    if (error) {
        encodedRedirect(
            "error",
            "/dashboard/reset-password",
            "Password update failed",
        )
    }

    encodedRedirect(
        "sucess",
        "/dashboard/reset-password",
        "Password updated",
    )
};
export const signOutAction = async () => {
    const supabase = await createClient()
    await supabase.auth.signOut();
    return redirect("/");
}

export const createCompanyAction = async (formData) => {
    const companyName = formData.get("companyName")?.toString();
    const supabase = await createClient();

    if (!companyName) {
        return encodedRedirect("error", "/onboarding", "Company name is required.");
    }

    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        console.log(userError);
        return encodedRedirect("error", "/onboarding", "You must be logged in to create a company.");
    }

    

    
    const { data: company, error: companyError } = await supabase
        .from("companies")
        .insert([
            { name: companyName, owner_id: user.id, subscription_status: 'NOT_SUBSCRIBED', subscription_plan: 'FREE'}
        ])
        .select()
        .single();

    if (companyError) {
        console.error(companyError.message);
        return encodedRedirect("error", "/onboarding", "Failed to create company. Please try again.");
    }

    
    const { error: memberError } = await supabase
        .from("company_members")
        .insert([
            { company_id: company.id, user_id: user.id, role: 'admin' }
        ]);

    if (memberError) {
        return encodedRedirect(
            "error",
            "/onboarding",
            "Failed to add you as a member. Please try again."
        );
    }

    return { success: true };
}
