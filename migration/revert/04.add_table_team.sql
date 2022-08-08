-- Revert ecoroads:04.add_table_team from pg

BEGIN;
DROP TABLE "team";
COMMIT;
