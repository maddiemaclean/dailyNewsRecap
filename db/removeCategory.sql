CREATE OR REPLACE PROCEDURE remove_category(
    IN user_id_in INT,
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
    
    IF NOT EXISTS (
        SELECT 1 FROM user_categories WHERE user_id = user_id_in AND category_id = category_id_in
    ) THEN
        RAISE EXCEPTION 'User is not subscribed to this category';

    ELSIF (
        SELECT COUNT(*) FROM user_categories WHERE user_id = user_id_in
    ) = 1 THEN
        RAISE EXCEPTION 'User must be subscribed to at least one category';

    ELSE
        DELETE FROM user_categories
        WHERE user_id = user_id_in AND category_id = category_id_in;
    END IF;
END;
$$;
