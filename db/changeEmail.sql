CREATE OR REPLACE PROCEDURE change_email (
    IN currentEmail VARCHAR(100),
    IN newEmail VARCHAR(100),
    IN passwordHashIn VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    userId INT;
BEGIN
    -- Get user ID if email and password hash match
    SELECT user_id INTO userId FROM users WHERE email = currentEmail AND password_hash = passwordHashIn;

    IF newEmail IS NOT NULL AND EXISTS (
        SELECT 1 FROM users WHERE email = newEmail AND user_id != userId
    ) 
    THEN
        RAISE EXCEPTION 'Email is already connected to an account';
    END IF;

    UPDATE users SET email = newEmail WHERE user_id = userId;
END;
$$;



