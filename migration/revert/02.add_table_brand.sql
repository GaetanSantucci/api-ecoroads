-- Revert ecoroads:02.add_table_brand to pg

BEGIN;
ALTER TABLE "car" DROP CONSTRAINT "car_brand_id";
DROP TABLE "brand";
COMMIT;
