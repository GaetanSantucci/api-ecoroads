-- Verify ecoroads:03.new_constraint_delete_on_cascade on pg

BEGIN;
DELETE FROM "user" WHERE id = '1552b1ce-06f8-465a-b4a1-fc5b293938e0';
ROLLBACK;
