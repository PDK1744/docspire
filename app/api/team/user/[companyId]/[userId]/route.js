import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  const { userId, companyId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError.message }, { status: 401 });
  }
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { display_name, role, status } = await request.json();

  console.log("Update data:", { display_name, role, status });

  try {
    const { data: userProfile, error: getUserError } = await supabase
      .from("profiles")
      .select("id, id")
      .eq("id", userId)
      .eq("company_id", companyId)
      .single();

    if (getUserError) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    const updateData = {};
    if (display_name !== undefined) updateData.display_name = display_name;
    if (role !== undefined) updateData.role = role;
    if (status !== undefined) updateData.status = status;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .eq("company_id", companyId)
      .select()
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: profile,
        message: "User updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      {
        error: "Failed to update user",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
