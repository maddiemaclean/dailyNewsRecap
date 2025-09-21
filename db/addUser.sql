CREATE OR REPLACE PROCEDURE add_user(
    IN emailIn VARCHAR(100), 
    IN passwordHashIn VARCHAR(255), 
    IN verificationCodeIn VARCHAR(255)
)
LANGUAGE plpgsql
AS $$
DECLARE
    new_user_id INT;
BEGIN
    IF EXISTS (SELECT 1 FROM users WHERE email = emailIn) THEN
        RAISE EXCEPTION 'Email already in use';
    ELSE
        INSERT INTO users (email, password_hash, is_verified)
        VALUES (emailIn, passwordHashIn, FALSE)
        RETURNING user_id INTO new_user_id;

        INSERT INTO verification (user_id, verification_code)
        VALUES (new_user_id, verificationCodeIn);

        RAISE NOTICE 'New user ID: %', new_user_id;
    END IF;
END;
$$;
