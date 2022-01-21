DROP SCHEMA IF EXISTS membership CASCADE;

CREATE SCHEMA membership;

CREATE TABLE
    membership.tenants (
        id text PRIMARY KEY,
        name text NOT NULL UNIQUE,
        comment text NOT NULL,
        active BOOLEAN DEFAULT TRUE,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.locales (
        id text PRIMARY KEY,
        name text NOT NULL UNIQUE,
        comment text NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.status (
        id text PRIMARY KEY,
        name text NOT NULL UNIQUE,
        comment text NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.roles (
        id text PRIMARY KEY,
        name text NOT NULL UNIQUE,
        comment text NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.groups (
        group_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        tenant_id VARCHAR NOT NULL REFERENCES membership.tenants,
        name text NOT NULL,
        state text NOT NULL,
        leader_id uuid NULL,
        meeting_day text NOT NULL,
        group_news text NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.members (
        member_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        tenant_id VARCHAR NOT NULL REFERENCES membership.tenants,
        user_id uuid NULL UNIQUE,
        email text NULL UNIQUE,
        mobile text NOT NULL DEFAULT '',
        group_id uuid NULL REFERENCES membership.groups,
        status_id text NOT NULL REFERENCES membership.status,
        role_id text NOT NULL REFERENCES membership.roles,
        locale_id text NOT NULL REFERENCES membership.locales,
        firstname text NULL,
        lastname text NULL,
        about_me text NULL,
        company text NULL,
        photo text NULL DEFAULT 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgNDggNDgiIHdpZHRoPSI0OCI+PHBhdGggZD0iTTI0IDhjLTQuNDIgMC04IDMuNTgtOCA4IDAgNC40MSAzLjU4IDggOCA4czgtMy41OSA4LThjMC00LjQyLTMuNTgtOC04LTh6bTAgMjBjLTUuMzMgMC0xNiAyLjY3LTE2IDh2NGgzMnYtNGMwLTUuMzMtMTAuNjctOC0xNi04eiIvPjxwYXRoIGQ9Ik0wIDBoNDh2NDhoLTQ4eiIgZmlsbD0ibm9uZSIvPgoJCgkKCTxtZXRhZGF0YT4KCQk8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnJkZnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSMiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CgkJCTxyZGY6RGVzY3JpcHRpb24gYWJvdXQ9Imh0dHBzOi8vaWNvbnNjb3V0LmNvbS9sZWdhbCNsaWNlbnNlcyIgZGM6dGl0bGU9IkFjY291bnQsIEF2YXRhciwgUHJvZmlsZSwgSHVtYW4sIE1hbiwgVXNlciIgZGM6ZGVzY3JpcHRpb249IkFjY291bnQsIEF2YXRhciwgUHJvZmlsZSwgSHVtYW4sIE1hbiwgVXNlciIgZGM6cHVibGlzaGVyPSJJY29uc2NvdXQiIGRjOmRhdGU9IjIwMTYtMTItMTQiIGRjOmZvcm1hdD0iaW1hZ2Uvc3ZnK3htbCIgZGM6bGFuZ3VhZ2U9ImVuIj4KCQkJCTxkYzpjcmVhdG9yPgoJCQkJCTxyZGY6QmFnPgoJCQkJCQk8cmRmOmxpPkdvb2dsZSBJbmMuPC9yZGY6bGk+CgkJCQkJPC9yZGY6QmFnPgoJCQkJPC9kYzpjcmVhdG9yPgoJCQk8L3JkZjpEZXNjcmlwdGlvbj4KCQk8L3JkZjpSREY+CiAgICA8L21ldGFkYXRhPjwvc3ZnPgo=',
        rating INTEGER NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz
    );

ALTER TABLE
    membership.groups
ADD
    CONSTRAINT group_leader FOREIGN KEY (leader_id) REFERENCES membership.members (member_id);

CREATE TABLE
    membership.article_status (
        id text PRIMARY KEY,
        name text NOT NULL UNIQUE,
        comment text NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.articles (
        article_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        article text NOT NULL,
        subject text NOT NULL,
        summary text NOT NULL,
        image   text NULL,
        status_id text NOT NULL REFERENCES membership.article_status,
        created_by uuid NOT NULL REFERENCES membership.members,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.tags (
        tag_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        tag text NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.article_tags (
        row_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        article_id uuid NOT NULL REFERENCES membership.articles,
        tag_id uuid NOT NULL REFERENCES membership.tags,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

---
--- IOT data
---
CREATE TABLE
    membership.iot_device_types (
        name text PRIMARY KEY,
        comment text NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.iot_devices (
        device_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        device_type_id text REFERENCES membership.iot_device_types,
        member_id uuid REFERENCES membership.members,
        description text NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );

CREATE TABLE
    membership.iot_messages (
        message_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        device_id uuid REFERENCES membership.iot_devices,
        json_data JSONB NOT NULL,
        created_at timestamptz DEFAULT now() NOT NULL,
        updated_at timestamptz
    );
