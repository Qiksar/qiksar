CREATE VIEW "membership"."iot_environment" AS

 SELECT message_id, membership.iot_messages.created_at
 ,CAST(iot_messages.json_data ->> 'temp' AS FLOAT) AS "temperature",CAST(iot_messages.json_data ->> 'humidity' AS INTEGER) AS "humidity_percentage",CAST(iot_messages.json_data ->> 'dust' AS INTEGER) AS "dust_ppm"
 FROM membership.iot_messages
 INNER JOIN membership.iot_devices ON membership.iot_devices.device_id = membership.iot_messages.device_id INNER JOIN membership.iot_device_types ON membership.iot_device_types.name = membership.iot_devices.device_type_id
 WHERE device_type_id = 'ENV'
 ORDER BY membership.iot_messages.created_at;
 
COMMENT ON VIEW "membership"."iot_environment" IS 'Convert environmental monitoring JSON data into SQL columns';
;

CREATE VIEW "membership"."iot_smart_watch" AS

 SELECT message_id, membership.iot_messages.created_at
 ,CAST(iot_messages.json_data ->> 'temp' AS FLOAT) AS "temperature",CAST(iot_messages.json_data ->> 'heart_rate' AS INTEGER) AS "heart_bpm",CAST(iot_messages.json_data ->> 'steps' AS INTEGER) AS "step_count",CAST(iot_messages.json_data ->> 'oxygen' AS INTEGER) AS "O2Sat"
 FROM membership.iot_messages
 INNER JOIN membership.iot_devices ON membership.iot_devices.device_id = membership.iot_messages.device_id INNER JOIN membership.iot_device_types ON membership.iot_device_types.name = membership.iot_devices.device_type_id
 WHERE device_type_id = 'SMW'
 ORDER BY membership.iot_messages.created_at;
 
COMMENT ON VIEW "membership"."iot_smart_watch" IS 'Convert smart watch JSON data into SQL columns';
;