alter table "membership"."members" 
add column "user_tenant" 
varchar(30) 
DEFAULT 'app'
null;
