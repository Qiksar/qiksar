
----------------------------------------------------------------------------------------
-- TEST DATA
--
--
INSERT INTO membership.tenants ("name", "comment")
VALUES 
    ('admin', 'Tenant administrator'),
    ('Perth Kangaroo Society', 'Hopping mad people'),
    ('Arbroath Cathedral Builders', 'Scotlands foremost clinic');

INSERT INTO membership.roles ("name", "comment")
VALUES 
    ('admin', 'Tenant administrator'),
    ('member', 'Member'),
    ('leader', 'Membership Manager');

INSERT INTO membership.status ("name", "comment")
VALUES 
    ('active', 'Membership active'),
    ('cancelled', 'Membership cancelled');



--
-- AUSTRALIAN GROUPS and MEMBERS
--

INSERT INTO membership.groups ("tenant_id", "name", "state", "meeting_day", "group_news")
VALUES 
    (
        2,
        'Aussie Group 1',
        'WA',
        'Every Monday',
        'Please remember to keep your password safe'
    ),
    (
        2,
        'Aussie Group 2',
        'NSW',
        'Every Thursday',
        'Sheila is presenting on Friday about Quasar'
    );


INSERT INTO membership.members ("tenant_id", "group_id","firstname","lastname","company","email","mobile","status_id","role_id")
VALUES
(2, '1','Barry', 'Perth',     'Megacorp',        'am@ozemail.com.au', '0400 111 222','1','2'),
(2, '1','Bob',   'Sydney',    'StartsUp',        'bm@ozemail.com.au', '0400 211 222','1','2'),
(2, '1','Helen', 'Hobart',    'Fast cars Inc',   'cm@ozemail.com.au', '0400 311 222','1','2'),
(2, '2','Sheila','Melbourne', 'Rest-a-while',    'dm@ozemail.com.au', '0400 411 222','1','2'),
(2, '2','Angela','Adelaide',  'Angies Plumbers', 'em@ozemail.com.au', '0400 511 222','1','2'),
(2, '2','Ben',   'Darwin',    'Finance Wizards', 'fm@ozemail.com.au', '0400 611 222','1','2');

UPDATE membership.groups SET leader_id=1 WHERE group_id = 1;
UPDATE membership.groups SET leader_id=4 WHERE group_id = 2;


--
-- SCOTTISH GROUPS and MEMBERS
--

INSERT INTO membership.groups ("tenant_id", "name", "state", "meeting_day", "group_news")
VALUES 
    (
        3,
        'Scotland Group 1',
        'Angus',
        'Every Tuesday',
        'Welcome all members from Glencoe and surrounds'
    ),
    (
        3,
        'Scotland Group 2',
        'Cook',
        'Every Friday',
        'Sheila is giving a talk on Wednesday'
    );

INSERT INTO membership.members ("tenant_id", "group_id","firstname","lastname","company","email","mobile","status_id","role_id")
VALUES
(3, '3','Robert',  'Bruce',           'CaveCorp',            'robert@scotmail.com.au',  '0500 111 222','1','2'),
(3, '3','William', 'Wallace',         'Bottoms Up',          'william@scotmail.com.au', '0500 211 222','1','2'),
(3, '3','Billy',   'Connoly',         'Jokes On You',        'billy@scotmail.com.au',   '0500 311 222','1','2'),
(3, '4','Mairi',   'Chisholm',        'Ambulance on Call',   'mairi@scotmail.com.au',   '0500 411 222','1','2'),
(3, '4','Alexander Graham',   'Bell', 'Dial a Pizza',        'alex@scotmail.com.au',    '0500 511 222','1','2'),
(3, '4','Mary Queen', 'Of Scots',     'Royal Tea',           'mary@scotmail.com.au',    '0500 611 222','1','2');

UPDATE membership.groups SET leader_id=7 WHERE group_id = 3;
UPDATE membership.groups SET leader_id=10 WHERE group_id = 4;


---
--- IOT sample data
---

INSERT INTO membership.iot_device_types
("name", "comment")
VALUES
('SMW', 'Smart Watch'),
('ENV', 'Environmental Monitor')
;

INSERT INTO membership.iot_devices
("member_id","device_type_id", "description")
VALUES
(1, 'SMW', 'Jack''s smart watch'),
(1, 'ENV', 'Jack''s Environmental Monitor')
;

INSERT INTO membership.iot_messages
("device_id", "json_data")
VALUES
(1, '{ "temp": 25.1, "heart_rate": 80, "steps": 250, "oxygen": 100 }'),
(1, '{ "temp": 26.8, "heart_rate": 120, "steps": 200, "oxygen": 96 }'),
(1, '{ "temp": 27.3, "heart_rate": 110, "steps": 100, "oxygen": 97 }'),
(1, '{ "temp": 28.5, "heart_rate": 90, "steps": 50, "oxygen": 96 }'),
(1, '{ "temp": 31.2, "heart_rate": 80, "steps": 20, "oxygen": 100 }'),
(2, '{ "temp": 28, "humidity": 60, "dust": 200 }'),
(2, '{ "temp": 30, "humidity": 50, "dust": 200 }'),
(2, '{ "temp": 29.5, "humidity": 55, "dust": 200 }'),
(2, '{ "temp": 27.5, "humidity": 68, "dust": 200 }')
;

INSERT INTO membership.tags
("tag")
VALUES
('technology'),
('business'),
('health'),
('innovation');

INSERT INTO membership.articles
("article", "created_by")
VALUES
('technology article', 1),
('business article', 1),
('health article', 2),
('innovation article', 3);

INSERT INTO membership.article_tags
("article_id", "tag_id")
VALUES
(1,1),
(1,2),
(1,3),
(2,2),
(3,2),
(3,3);