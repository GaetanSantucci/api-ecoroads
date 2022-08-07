-- Revert ecoroads:03.new_constraint_delete_on_cascade to pg

BEGIN;
ALTER TABLE "user_like_category" DROP CONSTRAINT "user_id";
ALTER TABLE "user_like_category" DROP CONSTRAINT "user_like_category_category_id";
COMMIT;
