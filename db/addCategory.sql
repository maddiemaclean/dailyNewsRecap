CREATE OR REPLACE PROCEDURE add_category (
    IN email_in VARCHAR(255),
    IN category_id_in INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM categories WHERE category_id = category_id_in
    ) THEN
        RAISE EXCEPTION 'Category not found';
    END IF;

    IF EXISTS (
        SELECT 1 FROM user_categories WHERE email = email_in AND category_id = category_id_in
    ) THEN
        RAISE EXCEPTION 'User is already subscribed to this category';
    ELSE
        INSERT INTO user_categories (user_id, category_id)
        VALUES (user_id_in, category_id_in);
    END IF;
END;
$$;

