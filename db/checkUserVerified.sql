DELIMITER //
DROP PROCEDURE IF EXISTS checkUserVerified //
CREATE PROCEDURE checkUserVerified(IN user_id_in VARCHAR(50))
    BEGIN 
        IF NOT EXISTS (SELECT user_id FROM VerifiedUsers WHERE VerifiedUsers.userId = userIdIn) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account is not verified. Please verify using your email.'; 
        END IF;
END //
DELIMITER ;