import * as React from 'react'
import DocsTable from '@/components/docs/DocsTable'


export default async function DocumentsPage({ params }) {
    const { id: companyId } = await params
    

    

    return (
        <div className=''>
            <DocsTable companyId={companyId}/>
        </div>
    );
}