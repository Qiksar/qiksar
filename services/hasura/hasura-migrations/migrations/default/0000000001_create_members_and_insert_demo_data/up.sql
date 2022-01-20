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
    membership.articles (
        article_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        article text NOT NULL,
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

----------------------------------------------------------------------------------------
-- TEST DATA
--
--
--
-- NOTE: Enumerations have an ID and a name column. In the platform, the name column can be translated for any locale/tenant requirement.
-- Therefore the ID is needed in order to track the record's ID, as the name column will be replaced in the translation process.
--
-- Having a human readable ID column also makes it easy to seed the data, where assigning enum ids to other records becomes trivial.
--
INSERT INTO
    membership.tenants ("id", "name", "comment")
VALUES ('admin', 'admin', 'Platform Administrator'), ('perth', 'perth', 'Hopping mad people'), (
        'arbroath',
        'arbroath',
        'Scotlands foremost clinic'
    );

INSERT INTO
    membership.roles ("id", "name", "comment")
VALUES ('admin', 'admin', 'Tenant administrator'), ('member', 'member', 'Member'), ('leader', 'leader', 'Membership Manager');

INSERT INTO
    membership.status ("id", "name", "comment")
VALUES ('active', 'active', 'Membership active'), ('cancelled', 'cancelled', 'Membership cancelled');

INSERT INTO
    membership.locales ("id", "name", "comment")
VALUES ('en-AU', 'en-AU', 'English - Australia'), ('en-UK', 'en-UK', 'English - United Kingdom');

--
-- AUSTRALIAN GROUPS and MEMBERS
--
INSERT INTO
    membership.groups (
        "tenant_id",
        "name",
        "state",
        "meeting_day",
        "group_news"
    )
VALUES (
        'perth',
        'Aussie Group 1',
        'WA',
        'Every Monday',
        'Please remember to keep your password safe'
    ), (
        'perth',
        'Aussie Group 2',
        'NSW',
        'Every Thursday',
        'Sheila is presenting on Friday about Quasar'
    );

INSERT INTO
    membership.members (
        "tenant_id",
        "group_id",
        "firstname",
        "lastname",
        "company",
        "email",
        "mobile",
        "status_id",
        "role_id",
        "locale_id"
    )
VALUES (
        'perth', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Aussie Group 1%'
        ),
        'Barry',
        'perth',
        'Megacorp',
        'am@ozemail.com.au',
        '0400 111 222',
        'active',
        'member',
        'en-AU'
    ), (
        'perth', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Aussie Group 1%'
        ),
        'Bob',
        'Sydney',
        'StartsUp',
        'bm@ozemail.com.au',
        '0400 211 222',
        'active',
        'member',
        'en-AU'
    ), (
        'perth', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Aussie Group 1%'
        ),
        'Helen',
        'Hobart',
        'Fast cars Inc',
        'cm@ozemail.com.au',
        '0400 311 222',
        'active',
        'member',
        'en-AU'
    ), (
        'perth', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Aussie Group 2%'
        ),
        'Sheila',
        'Melbourne',
        'Rest-a-while',
        'dm@ozemail.com.au',
        '0400 411 222',
        'active',
        'member',
        'en-AU'
    ), (
        'perth', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Aussie Group 2%'
        ),
        'Angela',
        'Adelaide',
        'Angies Plumbers',
        'em@ozemail.com.au',
        '0400 511 222',
        'active',
        'member',
        'en-AU'
    ), (
        'perth', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Aussie Group 2%'
        ),
        'Ben',
        'Darwin',
        'Finance Wizards',
        'fm@ozemail.com.au',
        '0400 611 222',
        'active',
        'member',
        'en-AU'
    );

UPDATE
    membership.groups
SET
    leader_id = (
        SELECT
            member_id
        FROM
            "membership"."members"
        WHERE
            firstname LIKE '%Barry%'
    )
WHERE
    name = 'Aussie Group 1';

UPDATE
    membership.groups
SET
    leader_id = (
        SELECT
            member_id
        FROM
            "membership"."members"
        WHERE
            firstname LIKE '%Sheila%'
    )
WHERE
    name = 'Aussie Group 2';

--
-- SCOTTISH GROUPS and MEMBERS
--
INSERT INTO
    membership.groups (
        "tenant_id",
        "name",
        "state",
        "meeting_day",
        "group_news"
    )
VALUES (
        'arbroath',
        'Scotland Group 1',
        'Angus',
        'Every Tuesday',
        'Welcome all members from Glencoe and surrounds'
    ), (
        'arbroath',
        'Scotland Group 2',
        'Cook',
        'Every Friday',
        'Sheila is giving a talk on Wednesday'
    );

INSERT INTO
    membership.members (
        "tenant_id",
        "group_id",
        "firstname",
        "lastname",
        "company",
        "email",
        "mobile",
        "status_id",
        "role_id",
        "locale_id"
    )
VALUES (
        'arbroath', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Scotland Group 1%'
        ),
        'Robert',
        'Bruce',
        'CaveCorp',
        'robert@scotmail.co.uk',
        '0500 111 222',
        'active',
        'member',
        'en-UK'
    ), (
        'arbroath', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Scotland Group 1%'
        ),
        'William',
        'Wallace',
        'Bottoms Up',
        'william@scotmail.co.uk',
        '0500 211 222',
        'active',
        'member',
        'en-UK'
    ), (
        'arbroath', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Scotland Group 1%'
        ),
        'Billy',
        'Connoly',
        'Jokes On You',
        'billy@scotmail.co.uk',
        '0500 311 222',
        'active',
        'member',
        'en-UK'
    ), (
        'arbroath', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Scotland Group 2%'
        ),
        'Mairi',
        'Chisholm',
        'Ambulance on Call',
        'mairi@scotmail.co.uk',
        '0500 411 222',
        'active',
        'member',
        'en-UK'
    ), (
        'arbroath', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Scotland Group 2%'
        ),
        'Alexander Graham',
        'Bell',
        'Dial a Pizza',
        'alex@scotmail.co.uk',
        '0500 511 222',
        'active',
        'member',
        'en-UK'
    ), (
        'arbroath', (
            SELECT
                group_id
            FROM
                "membership"."groups"
            WHERE
                name LIKE '%Scotland Group 2%'
        ),
        'Mary Queen',
        'Of Scots',
        'Royal Tea',
        'mary@scotmail.co.uk',
        '0500 611 222',
        'active',
        'member',
        'en-UK'
    );

UPDATE
    membership.groups
SET
    leader_id = (
        SELECT
            member_id
        FROM
            "membership"."members"
        WHERE
            firstname LIKE '%Robert%'
    )
WHERE
    name = 'Scotland Group 1';

UPDATE
    membership.groups
SET
    leader_id = (
        SELECT
            member_id
        FROM
            "membership"."members"
        WHERE
            firstname LIKE '%Mairi%'
    )
WHERE
    name = 'Scotland Group 2';

---
--- IOT sample data
---
INSERT INTO
    membership.iot_device_types ("name", "comment")
VALUES ('SMW', 'Smart Watch'), ('ENV', 'Environmental Monitor');

INSERT INTO
    membership.iot_devices ("member_id", "device_type_id", "description")
VALUES ( (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                firstname LIKE '%Robert%'
        ),
        'SMW',
        'Robert''s smart watch'
    ), ( (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                firstname LIKE '%Robert%'
        ),
        'ENV',
        'Robert''s Environmental Monitor'
    );

INSERT INTO
    membership.iot_messages ("device_id", "json_data")
VALUES ( (
            SELECT
                device_id
            FROM
                "membership"."iot_devices"
            WHERE
                device_type_id = 'SMW'
        ),
        '{ "temp": 25.1, "heart_rate": 80, "steps": 250, "oxygen": 100 }'
    ), ( (
            SELECT
                device_id
            FROM
                "membership"."iot_devices"
            WHERE
                device_type_id = 'SMW'
        ),
        '{ "temp": 26.8, "heart_rate": 120, "steps": 200, "oxygen": 96 }'
    ), ( (
            SELECT
                device_id
            FROM
                "membership"."iot_devices"
            WHERE
                device_type_id = 'SMW'
        ),
        '{ "temp": 27.3, "heart_rate": 110, "steps": 100, "oxygen": 97 }'
    ), ( (
            SELECT
                device_id
            FROM
                "membership"."iot_devices"
            WHERE
                device_type_id = 'SMW'
        ),
        '{ "temp": 28.5, "heart_rate": 90, "steps": 50, "oxygen": 96 }'
    ), ( (
            SELECT
                device_id
            FROM
                "membership"."iot_devices"
            WHERE
                device_type_id = 'SMW'
        ),
        '{ "temp": 31.2, "heart_rate": 80, "steps": 20, "oxygen": 100 }'
    ), ( (
            SELECT
                device_id
            FROM
                "membership"."iot_devices"
            WHERE
                device_type_id = 'ENV'
        ),
        '{ "temp": 28, "humidity": 60, "dust": 200 }'
    ), ( (
            SELECT
                device_id
            FROM
                "membership"."iot_devices"
            WHERE
                device_type_id = 'ENV'
        ),
        '{ "temp": 30, "humidity": 50, "dust": 200 }'
    ), ( (
            SELECT
                device_id
            FROM
                "membership"."iot_devices"
            WHERE
                device_type_id = 'ENV'
        ),
        '{ "temp": 29.5, "humidity": 55, "dust": 200 }'
    ), ( (
            SELECT
                device_id
            FROM
                "membership"."iot_devices"
            WHERE
                device_type_id = 'ENV'
        ),
        '{ "temp": 27.5, "humidity": 68, "dust": 200 }'
    );

INSERT INTO
    membership.tags ("tag")
VALUES ('technology'), ('business'), ('health'), ('innovation');

INSERT INTO
    membership.articles ("article", "created_by")
VALUES (
        'technology article', (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                firstname LIKE '%Robert%'
        )
    ), (
        'business article', (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                firstname LIKE '%Billy%'
        )
    ), (
        'health article', (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                firstname LIKE '%Helen%'
        )
    ), (
        'innovation article', (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                firstname LIKE '%Sheila%'
        )
    );

INSERT INTO
    membership.article_tags ("article_id", "tag_id")
VALUES ( (
            SELECT
                article_id
            FROM
                "membership"."articles"
            WHERE
                article = 'technology article'
        ), (
            SELECT
                tag_id
            FROM
                "membership"."tags"
            WHERE
                tag LIKE '%technology%'
        )
    ), ( (
            SELECT
                article_id
            FROM
                "membership"."articles"
            WHERE
                article = 'business article'
        ), (
            SELECT
                tag_id
            FROM
                "membership"."tags"
            WHERE
                tag LIKE '%business%'
        )
    ), ( (
            SELECT
                article_id
            FROM
                "membership"."articles"
            WHERE
                article = 'health article'
        ), (
            SELECT
                tag_id
            FROM
                "membership"."tags"
            WHERE
                tag LIKE '%health%'
        )
    ), ( (
            SELECT
                article_id
            FROM
                "membership"."articles"
            WHERE
                article = 'innovation article'
        ), (
            SELECT
                tag_id
            FROM
                "membership"."tags"
            WHERE
                tag LIKE '%innovation%'
        )
    );