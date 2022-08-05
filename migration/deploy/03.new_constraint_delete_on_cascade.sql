-- Deploy ecoroads:03.new_constraint_delete_on_cascade to pg


ALTER TABLE "user_like_category"
drop CONSTRAINT "user_like_category_user_id_fkey";
ALTER TABLE "user_like_category"
ADD FOREIGN KEY ("user_id")
    REFERENCES "user"
        ("id")
    ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "user_like_category"
drop CONSTRAINT "user_like_category_category_id_fkey";

ALTER TABLE "user_like_category"
ADD FOREIGN KEY ("category_id")
    REFERENCES "category"
        ("id")
    ON DELETE CASCADE ON UPDATE NO ACTION;