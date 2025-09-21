CREATE OR REPLACE FUNCTION get_verification_info(email_in TEXT)
RETURNS TABLE (
    verification_code VARCHAR(6),
    created_at TIMESTAMP
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY SELECT v.verification_code, v.created_at FROM users u 
    JOIN verification v ON u.user_id = v.user_id WHERE u.email = email_in;
END;
$$;
