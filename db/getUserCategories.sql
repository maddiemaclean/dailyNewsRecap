DROP FUNCTION IF EXISTS get_user_categories(VARCHAR);

CREATE OR REPLACE FUNCTION get_user_categories(email_in VARCHAR)
RETURNS TABLE (
    user_id INT,
    email VARCHAR,
    category_id INT,
    category_name VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    user_id_val INT;
BEGIN
    SELECT u.user_id INTO user_id_val
    FROM users u
    WHERE u.email = email_in;

    IF user_id_val IS NULL THEN
        RAISE EXCEPTION 'User with this email does not exist';
    END IF;

    RETURN QUERY
    SELECT u.user_id, u.email, c.category_id, c.name
    FROM users u
    JOIN user_categories uc ON u.user_id = uc.user_id
    JOIN categories c ON uc.category_id = c.category_id
    WHERE u.user_id = user_id_val;
END;
$$;

