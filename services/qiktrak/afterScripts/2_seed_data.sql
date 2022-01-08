
----------------------------------------------------------------------------------------
-- TEST DATA
--
--
INSERT INTO membership.tenants ("name", "comment")
VALUES 
    ('admin', 'Platform Administrator'),
    ('perth', 'Hopping mad people'),
    ('arbroath', 'Scotlands foremost clinic');

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
        'perth',
        'Aussie Group 1',
        'WA',
        'Every Monday',
        'Please remember to keep your password safe'
    ),
    (
        'perth',
        'Aussie Group 2',
        'NSW',
        'Every Thursday',
        'Sheila is presenting on Friday about Quasar'
    );


INSERT INTO membership.members ("tenant_id", "group_id","firstname","lastname","company","email","mobile","status_id","role_id")
VALUES
(
'perth',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Aussie Group 1%'),
'Barry', 
'perth',     
'Megacorp',        
'am@ozemail.com.au', 
'0400 111 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')),

(
'perth',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Aussie Group 1%'),
'Bob',   
'Sydney',    
'StartsUp',        
'bm@ozemail.com.au', 
'0400 211 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')
),

(
'perth',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE 
'%Aussie Group 1%'),
'Helen', 
'Hobart',    
'Fast cars Inc',   
'cm@ozemail.com.au', 
'0400 311 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')
),

(
'perth',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Aussie Group 2%'),
'Sheila','Melbourne', 
'Rest-a-while',    
'dm@ozemail.com.au', 
'0400 411 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')),

(
'perth',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Aussie Group 2%'),
'Angela',
'Adelaide',  
'Angies Plumbers', 
'em@ozemail.com.au', 
'0400 511 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')
),

(
'perth',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Aussie Group 2%'),
'Ben',   
'Darwin',    
'Finance Wizards', 
'fm@ozemail.com.au', 
'0400 611 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')
);

UPDATE membership.groups SET leader_id=(SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Barry%') WHERE name = 'Aussie Group 1';
UPDATE membership.groups SET leader_id=(SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Sheila%') WHERE name = 'Aussie Group 2';


--
-- SCOTTISH GROUPS and MEMBERS
--

INSERT INTO membership.groups ("tenant_id", "name", "state", "meeting_day", "group_news")
VALUES 
    (
        'arbroath',
        'Scotland Group 1',
        'Angus',
        'Every Tuesday',
        'Welcome all members from Glencoe and surrounds'
    ),
    (
        'arbroath',
        'Scotland Group 2',
        'Cook',
        'Every Friday',
        'Sheila is giving a talk on Wednesday'
    );

INSERT INTO membership.members ("tenant_id", "group_id","firstname","lastname","company","email","mobile","status_id","role_id")
VALUES
(
'arbroath',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Scotland Group 1%'), 
'Robert',  
'Bruce',           
'CaveCorp',            
'robert@scotmail.co.uk',  
'0500 111 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')),

(
'arbroath',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Scotland Group 1%'),  
'William', 
'Wallace',         
'Bottoms Up',          
'william@scotmail.co.uk', 
'0500 211 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')),

(
'arbroath',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Scotland Group 1%'),  
'Billy',   
'Connoly',         
'Jokes On You',        
'billy@scotmail.co.uk',   
'0500 311 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')),


(
'arbroath',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Scotland Group 2%'), 
'Mairi',   
'Chisholm',        
'Ambulance on Call',   
'mairi@scotmail.co.uk',   
'0500 411 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')),


(
'arbroath',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Scotland Group 2%'),  
'Alexander Graham',   
'Bell', 
'Dial a Pizza',        
'alex@scotmail.co.uk',    
'0500 511 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%')),


(
'arbroath',
(SELECT group_id FROM "membership"."groups" WHERE name LIKE '%Scotland Group 2%'), 
'Mary Queen', 
'Of Scots',     
'Royal Tea',           
'mary@scotmail.co.uk',    
'0500 611 222',
(SELECT status_id FROM "membership"."status" WHERE name LIKE '%active%'), 
(SELECT role_id FROM "membership"."roles" WHERE name LIKE '%member%'));


UPDATE membership.groups SET leader_id=(SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Robert%') WHERE name = 'Scotland Group 1';
UPDATE membership.groups SET leader_id=(SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Mairi%') WHERE name = 'Scotland Group 2';


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
((SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Robert%'), 'SMW', 'Robert''s smart watch'),
((SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Robert%'), 'ENV', 'Robert''s Environmental Monitor')
;

INSERT INTO membership.iot_messages
("device_id", "json_data")
VALUES
((SELECT device_id FROM "membership"."iot_devices" WHERE device_type_id = 'SMW'), '{ "temp": 25.1, "heart_rate": 80, "steps": 250, "oxygen": 100 }'),
((SELECT device_id FROM "membership"."iot_devices" WHERE device_type_id = 'SMW'), '{ "temp": 26.8, "heart_rate": 120, "steps": 200, "oxygen": 96 }'),
((SELECT device_id FROM "membership"."iot_devices" WHERE device_type_id = 'SMW'), '{ "temp": 27.3, "heart_rate": 110, "steps": 100, "oxygen": 97 }'),
((SELECT device_id FROM "membership"."iot_devices" WHERE device_type_id = 'SMW'), '{ "temp": 28.5, "heart_rate": 90, "steps": 50, "oxygen": 96 }'),
((SELECT device_id FROM "membership"."iot_devices" WHERE device_type_id = 'SMW'), '{ "temp": 31.2, "heart_rate": 80, "steps": 20, "oxygen": 100 }'),
((SELECT device_id FROM "membership"."iot_devices" WHERE device_type_id = 'ENV'), '{ "temp": 28, "humidity": 60, "dust": 200 }'),
((SELECT device_id FROM "membership"."iot_devices" WHERE device_type_id = 'ENV'), '{ "temp": 30, "humidity": 50, "dust": 200 }'),
((SELECT device_id FROM "membership"."iot_devices" WHERE device_type_id = 'ENV'), '{ "temp": 29.5, "humidity": 55, "dust": 200 }'),
((SELECT device_id FROM "membership"."iot_devices" WHERE device_type_id = 'ENV'), '{ "temp": 27.5, "humidity": 68, "dust": 200 }')
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
('technology article', (SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Robert%')),
('business article', (SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Billy%')),
('health article', (SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Helen%')),
('innovation article', (SELECT member_id FROM "membership"."members" WHERE firstname LIKE '%Sheila%'));

INSERT INTO membership.article_tags
("article_id", "tag_id")
VALUES
((SELECT article_id FROM "membership"."articles" WHERE article = 'technology article'),
(SELECT tag_id FROM "membership"."tags" WHERE tag LIKE '%technology%')),

((SELECT article_id FROM "membership"."articles" WHERE article = 'business article'),
(SELECT tag_id FROM "membership"."tags" WHERE tag LIKE '%business%')),

((SELECT article_id FROM "membership"."articles" WHERE article = 'health article'),
(SELECT tag_id FROM "membership"."tags" WHERE tag LIKE '%health%')),

((SELECT article_id FROM "membership"."articles" WHERE article = 'innovation article'),
(SELECT tag_id FROM "membership"."tags" WHERE tag LIKE '%innovation%'));
