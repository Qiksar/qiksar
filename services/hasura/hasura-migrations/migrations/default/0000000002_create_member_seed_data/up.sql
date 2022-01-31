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
INSERT INTO membership.tenants ("id", "name", "comment")
VALUES 
('default',  'default',  'B2B Platform'), 
('perth',    'perth',    'Hopping mad people'), 
('arbroath', 'arbroath', 'Scotlands foremost clinic');

INSERT INTO
    membership.roles ("id", "name", "comment")
VALUES ('admin', 'admin', 'Tenant administrator'), ('member', 'member', 'Member'), ('leader', 'leader', 'Membership Manager');

INSERT INTO
    membership.status ("id", "name", "comment")
VALUES ('active', 'active', 'Membership active'), ('cancelled', 'cancelled', 'Membership cancelled');

INSERT INTO
    membership.locales ("id", "name", "comment")
VALUES ('en-AU', 'en-AU', 'English - Australia'), ('en-UK', 'en-UK', 'English - United Kingdom');

INSERT INTO
    membership.article_status ("id", "name", "comment")
VALUES ('draft', 'draft', 'Not approved or published'), ('review', 'review', 'Ready to review'), (
        'declined',
        'declined',
        'Article was declined after review'
    ), (
        'approved',
        'approved',
        'Article is approved for publishing'
    ), ('published', 'published', 'Article is published');



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
        'Bruce',
        'Cobber',
        'Megacorp',
        'bruce@ozapp.com',
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
        'angela@ozemail.com.au',
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



--
-- Assign the keycloak user IDs to the member records, updating the ID so the member ID is the Keycloak user ID
--
UPDATE
    membership.members AS MEMBER
SET
    member_id = CAST(id AS uuid)
FROM
    keycloak.user_entity
WHERE
    keycloak.user_entity.email = MEMBER.email;

--
-- Assign a leader to each group
--
-- 
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
    membership.articles (
        "status_id",
        "article",
        "subject",
        "summary",
        "image",
        "created_by"
    )
VALUES (
        'draft',
        'technology article',
        'Technology update for this year',
        'In this article we talk about technology and use lots of technology words',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=', (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                lastname LIKE '%Bell%'
        )
    ), (
        'draft',
        'business article',
        'Business forecast for next year',
        'In this article we gaze into the crystal ball to discover what is going to make our business successful',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=', (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                lastname LIKE '%Bell%'
        )
    ), (
        'draft',
        'health article',
        'How to stay healthy',
        'Have you ever wondered how to stay healthy? This is the article you are looking for!',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=', (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                firstname LIKE '%Bruce%'
        )
    ), (
        'draft',
        'innovation article{%0A}{%0A}# Governing Law{%0A}{{ GOV_LAW_AU_WA }}{%0A}{%0A}{%0A}# Approval Process{%0A}```mermaid Christmas Shopping Process{%0A}graph TD{%0A}A[Christmas] -->|Get money| B(Go shopping){%0A}B --> C{Let me think}{%0A}C -->|One| D[Laptop]{%0A}C -->|Two| E[iPhone]{%0A}C -->|Three| F[Car]{%0A}```{%0A}{%0A}{{ ISO27001_S12 }}{%0D}{%0A}',
        'Innovation is one of the most innovative things you can do!',
        'How can you use the innovation process to do things which are innovative and that help you to innovate?',
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=', (
            SELECT
                member_id
            FROM
                "membership"."members"
            WHERE
                firstname LIKE '%Bruce%'
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
