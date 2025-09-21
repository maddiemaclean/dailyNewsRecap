CREATE OR REPLACE FUNCTION get_user_by_email(email_in TEXT)
RETURNS TABLE (
    user_id INT,
    email VARCHAR(255),        
    password_hash VARCHAR(255),
    is_verified BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.email, u.password_hash, u.is_verified
    FROM users u
    WHERE u.email = email_in;
END;
$$ LANGUAGE plpgsql;

