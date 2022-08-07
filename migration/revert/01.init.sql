-- Revert ecoroads:01.init to pg

BEGIN;
ALTER TABLE "user" DROP CONSTRAINT "user_car_id";
ALTER TABLE "user" DROP CONSTRAINT "user_location_id";
DROP TABLE IF EXISTS "user_like_category", "road", 
                        "interesting_point", "charging_station", 
                            "category", "location", "car", "network",
                                "user";
DROP DOMAIN IF EXISTS "postal_code_fr", "EMAIL";
DROP EXTENSION IF EXISTS "uuid-ossp";
COMMIT;
