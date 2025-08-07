-- Enable RLS (Row Level Security)
alter table auth.users enable row level security;

-- Companies Table
create table public.companies (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    subscription_tier text default 'free' check (subscription_tier in ('free', 'premium')),
    stripe_customer_id text unique,
    stripe_subscription_id text unique
);

-- Company Members Table (Junction between Users and Companies)
create table public.company_members (
    id uuid default gen_random_uuid() primary key,
    company_id uuid references public.companies(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    role text not null check (role in ('admin', 'editor', 'viewer')),
    created_at timestamp with time zone default now(),
    unique(company_id, user_id)
);

-- Document Collections (Tiles) Table
create table public.document_collections (
    id uuid default gen_random_uuid() primary key,
    company_id uuid references public.companies(id) on delete cascade,
    name text not null,
    description text,
    icon text,
    color text,
    created_by uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    display_order integer default 0
);

-- Documents Table
create table public.documents (
    id uuid default gen_random_uuid() primary key,
    company_id uuid references public.companies(id) on delete cascade,
    collection_id uuid references public.document_collections(id) on delete set null,
    title text not null,
    content jsonb,
    created_by uuid references auth.users(id) on delete set null,
    updated_by uuid references auth.users(id) on delete set null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    display_order integer default 0,
    is_published boolean default false
);

-- Document Permissions Table
create table public.document_permissions (
    id uuid default gen_random_uuid() primary key,
    document_id uuid references public.documents(id) on delete cascade,
    role text not null check (role in ('admin', 'editor', 'viewer')),
    permission text not null check (permission in ('read', 'write', 'manage')),
    created_at timestamp with time zone default now()
);

-- Create indexes for better query performance
create index idx_company_members_user_id on public.company_members(user_id);
create index idx_company_members_company_id on public.company_members(company_id);
create index idx_documents_company_id on public.documents(company_id);
create index idx_documents_parent_id on public.documents(parent_id);

-- Row Level Security Policies

-- Companies RLS
create policy "Users can view their own companies"
    on companies for select
    using (
        id in (
            select company_id 
            from company_members 
            where user_id = auth.uid()
        )
    );

create policy "Admins can update their companies"
    on companies for update
    using (
        id in (
            select company_id 
            from company_members 
            where user_id = auth.uid() 
            and role = 'admin'
        )
    );

-- Company Members RLS
create policy "Users can view members in their companies"
    on company_members for select
    using (
        company_id in (
            select company_id 
            from company_members 
            where user_id = auth.uid()
        )
    );

create policy "Admins can manage company members"
    on company_members for all
    using (
        company_id in (
            select company_id 
            from company_members 
            where user_id = auth.uid() 
            and role = 'admin'
        )
    );

-- Documents RLS
create policy "Users can view documents in their companies"
    on documents for select
    using (
        company_id in (
            select company_id 
            from company_members 
            where user_id = auth.uid()
        )
    );

create policy "Users can create documents in their companies"
    on documents for insert
    with check (
        company_id in (
            select company_id 
            from company_members 
            where user_id = auth.uid() 
            and role in ('admin', 'editor')
        )
    );

create policy "Users can update documents they have access to"
    on documents for update
    using (
        company_id in (
            select company_id 
            from company_members 
            where user_id = auth.uid() 
            and role in ('admin', 'editor')
        )
    );

-- Functions
create or replace function public.get_user_companies(user_id uuid)
returns setof companies
language sql
security definer
set search_path = public
stable
as $$
    select c.*
    from companies c
    inner join company_members cm on c.id = cm.company_id
    where cm.user_id = user_id;
$$;

-- Alter documents table to add collection support and remove parent_id
ALTER TABLE public.documents
    ADD COLUMN collection_id uuid REFERENCES public.document_collections(id) ON DELETE SET NULL,
    ADD COLUMN display_order integer DEFAULT 0;

ALTER TABLE public.documents
    DROP COLUMN parent_id;
