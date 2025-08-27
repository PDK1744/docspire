import * as React from 'react';
import TeamList from '@/components/team/team-list';

export default async function TeamPage({ params }) {
    const { id: companyId } = await params;
    
    return (
        <div className=''>
            <TeamList companyId={companyId}/>
        </div>
    )
    
}