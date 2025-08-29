import * as React from 'react'
import ProfileSettings from '@/components/settings/ProfileSettings'
import CompanySettings from '@/components/settings/CompanySettings'
import { createClient } from '@/utils/supabase/server'

export default async function SettingsPage({ params }) {
    const supabase = await createClient()
    const { id } = await params
    const companyId = id

    const { data: {user}, } = await supabase.auth.getUser()
    

    if (!user) {
        return <div>Please sign in to access settings.</div>
    }

    const {data: membership, error} = await supabase
    .from("company_members")
    .select("role")
    .eq("user_id", user.id)
    .eq("company_id", companyId)
    .single()

    if (error || !membership) {
        return <div>Access denied. you are not a member of this company.</div>
    }

    

    
    const role = membership.role

    

    return (
        <div className=''>
            <ProfileSettings />
            {role === "admin" && <CompanySettings companyId={companyId}  />}
        </div>
    );
}