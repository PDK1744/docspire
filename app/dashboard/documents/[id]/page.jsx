'use client'
import * as React from 'react'
import DocumentEditor from './document-editor'

export default function DocumentPage({ params }) {
    const { id } = React.use(params);
  return <DocumentEditor documentId={id} />;
}
