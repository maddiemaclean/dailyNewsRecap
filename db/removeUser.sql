CREATE OR REPLACE PROCEDURE remove_user(
    IN emailIn VARCHAR(100)
)
LANGUAGE plpgsql
AS $$
DECLARE
    uid INT;
BEGIN
    SELECT user_id INTO uid FROM users WHERE email = emailIn;

    IF uid IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    DELETE FROM verification WHERE user_id = uid;
    DELETE FROM user_categories WHERE user_id = uid;
    DELETE FROM users WHERE user_id = uid;
END;
$$;

