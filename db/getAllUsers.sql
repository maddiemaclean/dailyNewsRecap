CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (email VARCHAR)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.email FROM users u;
END;
$$;

