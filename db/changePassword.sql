CREATE OR REPLACE PROCEDURE change_password(
    IN emailIn VARCHAR,
    IN newPasswordHash VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    userId INT;
BEGIN
    SELECT user_id INTO userId FROM users WHERE LOWER(email) = LOWER(emailIn);
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    UPDATE users SET password_hash = newPasswordHash WHERE user_id = userId;
END;
$$;
