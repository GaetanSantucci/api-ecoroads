-- Verify ecoroads:01.init on pg

BEGIN;
SELECT * FROM "user";
SELECT * FROM "car";
SELECT * FROM "network";
SELECT * FROM "location";
SELECT * FROM "category";
SELECT * FROM "charging_station";
SELECT * FROM "interesting_point";
SELECT * FROM "user_like_category";
SELECT * FROM "road"
ROLLBACK;
