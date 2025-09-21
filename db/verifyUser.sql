CREATE OR REPLACE PROCEDURE verify_user(
    IN emailIn VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    user_id_found INT;
BEGIN
    SELECT user_id INTO user_id_found FROM users WHERE email = emailIn;
    UPDATE users SET is_verified = TRUE WHERE email = emailIn;
    DELETE FROM verification WHERE user_id = user_id_found;
END;
$$;