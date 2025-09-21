DELIMITER //
DROP PROCEDURE IF EXISTS checkVerification //
CREATE PROCEDURE checkVerification(IN user_id_in VARCHAR(50))
    BEGIN 
        IF EXISTS (SELECT userId FROM VerifiedUsers WHERE VerifiedUsers.userId = user_id_in) THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Account is already verified';
        ELSE
            SELECT * from verification WHERE verification.user_id = user_id_in; 
        END IF;
END //
DELIMITER ;