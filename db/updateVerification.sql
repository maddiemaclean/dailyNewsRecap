CREATE OR REPLACE PROCEDURE update_verification(
    IN email_in VARCHAR(100), 
    IN verification_code_in VARCHAR(255),
    IN time_in TIMESTAMP
)
LANGUAGE plpgsql
AS $$
DECLARE
    user_id_found INT;
BEGIN
    SELECT user_id INTO user_id_found FROM users WHERE email = email_in;
    UPDATE verification SET verification_code = verification_code_in, created_at = time_in WHERE user_id = user_id_found;
END;
$$;
