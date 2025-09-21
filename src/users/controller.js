const pool = require('./db_access');
const bcrypt = require('bcrypt');
const { generateValidationCode, isVerificationCodeValid, getCurrentTimestamp } = require('./utils');


const getUsers = (req, res) => {
    pool.query("SELECT * FROM users", (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    });
};

const addUser = async(req, res) => {
    const { email, password, passwordVerify} = req.body
    if (!email || !password){
        return res.status(400).json({error: 'Missing required fields: email, password'});
    }

    if (password.length <6 ){
        return res.status(400).json({error: 'Password length must be greater than 6'});
    }

    if ( password != passwordVerify){
        return res.status(400).json({error: 'Passwords have to match'});
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    try{
        let verificationCode = generateValidationCode();
        await pool.query('CALL add_user($1, $2, $3)', [email, passwordHash, verificationCode]);
        return res.status(201).json({message: 'User succesfully created. Verification pending'});
    }
    catch (err){
        if (err.message.includes('Email already in use')){
            return res.status(400).json({error: 'Email already in use'});
        }

        console.error('Internal server error', err);
        return res.status(500).json({error: 'Internal server error'});
    }
};

const verifyUser = async (req, res) =>{
    const {email, verificationCode, } = req.body;
    if (!email || !verificationCode ){
        return res.status(400).json({error: 'Missing required fields: email, verification code'});
    }
    try{
        const result = await pool.query('SELECT * FROM get_user_by_email($1)', [email]);
        if (result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }

        const verficationInfo = await pool.query('SELECT * FROM get_verification_info($1)', [email]);
        if (verficationInfo.rows.length === 0){
            return res.status(400).json({error: 'User not registered or already verified.'});
        }

        if ( verificationCode != verficationInfo.rows[0].verification_code){
            return res.status(400).json({error: 'Verfication code is incorrect'});
        }

        const currentTime = getCurrentTimestamp();
        const verificationCodeValid = isVerificationCodeValid(currentTime, verficationInfo.rows[0].created_at);

        if (verificationCodeValid === false){
            const newVerificationCode = generateValidationCode();
            await pool.query('CALL update_verification($1, $2, $3)', [email, newVerificationCode, currentTime]);
            return res.status(400).json({error: 'Verfication code expired. A new code has been sent to your email.'});
        }
        else{
            await pool.query('CALL verify_user($1)', [email]);
            return res.status(201).json({message: 'User succesfully verified!'});
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal server error'});        
    }
}

const login = async(req, res) =>{
    const {email, password} = req.body;
    if (!email || !password){
        return res.status(400).json({error: 'Missing required fields: email and/or password'});
    }
    try{
        const result = await pool.query('SELECT * FROM get_user_by_email($1)', [email]);
        if (result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }
        
        const user = result.rows[0];
        const isMatched = await bcrypt.compare(password, user.password_hash);
        if (!isMatched){
            return res.status(401).json({error: 'Incorrect password'});
        }

        if (!user.is_verified){
            return res.status(403).json({error: 'Please verify your email before logging in'});
        }
        return res.status(201).json({message: 'Successfully logged in!'});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal server error'});        
    }
}

const removeUser = async (req, res) =>{
    const { email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Missing required fields: email and password' });
    }

    try{
        const result = await pool.query('SELECT * FROM get_user_by_email($1)', [email]);
        if (result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }

        const user = result.rows[0];
        const isMatched = await bcrypt.compare(password, user.password_hash);
        if (!isMatched){
            return res.status(401).json({error: 'Incorrect password'});
        }

        await pool.query('DELETE FROM users WHERE email =$1', [email]);
        return res.status(200).json({message: 'User successfully removed'});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal server error'});
    }
};

const getUser = async(req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Missing required query parameter: email' });
    }

    try {
        const result = await pool.query('SELECT * FROM get_user_by_email($1)', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ user: result.rows[0] });
    } 
    catch (err) {
        console.error('Internal server error', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const changeEmail = async(req, res) => {
    const { currentEmail, newEmail, password } = req.body;
    console.log("BODY:", req.body); 


    if (!currentEmail || !password) {
        return res.status(400).json({ error: 'Missing required fields: email and password' });
    }

    try{
        const result = await pool.query('SELECT * FROM get_user_by_email($1)', [currentEmail]);
        if (result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }
        
        const user = result.rows[0];

        const isMatched = await bcrypt.compare(password, user.password_hash);
        if (!isMatched){
            return res.status(401).json({error: 'Incorrect password'});
        }

        await pool.query('CALL change_email($1, $2, $3)', [ currentEmail, newEmail, user.password_hash ]);
        return res.status(201).json({message: 'Email successfully changed!'});
    }
    catch (err) {
        if (err.message.includes('Email is already connected to an account')){
            return res.status(400).json({error: 'Email is already connected to an account'});
        }
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const changePassword = async(req, res) =>{
    const { email, currentPassword, newPassword, newPasswordVerify} = req.body;

    if (!email || !currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Missing required fields: email, old password and new passwords' });
    }

    if ( newPassword != newPasswordVerify){
        return res.status(400).json({error: 'Passwords have to match'});
    }

    try{
        const result = await pool.query('SELECT * FROM get_user_by_email($1)', [email]);
        if (result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }
        
        const user = result.rows[0];
        const isMatched = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatched){
            return res.status(401).json({error: 'Incorrect password'});
        }

        const salt = await bcrypt.genSalt();
        const newPasswordHashed = await bcrypt.hash(newPassword, salt);

        await pool.query('CALL change_password($1, $2)', [email, newPasswordHashed]);
        return res.status(201).json({message: 'Password successfully changed!'});
    }
    catch (err){
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const addCategory = async(req, res) => {
    const { email, category_id} = req.body;

    if (!email || !category_id) {
        return res.status(400).json({ error: 'Missing required fields: email and category id' });
    }

    try{
        const result = await pool.query('SELECT * FROM get_user_by_email($1)', [email]);
        if (result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }

        const user_id = result.rows[0].user_id;
        await pool.query('CALL add_category($1, $2)', [user_id, category_id]);
        return res.status(201).json({message: 'Category succesfully added'});
    }
    catch(err){
        if (err.message.includes('User is already subscribed to this category')){
            return res.status(400).json({error: 'User is already subscribed to this category'});
        }

        if (err.message.includes('Category not found')){
            return res.status(404).json({error: 'Category not found'});
        }

        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const removeCategory = async(req, res) => {
    const { email, category_id} = req.body;

    if (!email || !category_id) {
        return res.status(400).json({ error: 'Missing required fields: email and category id' });
    }

    try{
        const result = await pool.query('SELECT * FROM get_user_by_email($1)', [email]);
        if (result.rows.length === 0){
            return res.status(404).json({error: 'User not found'});
        }

        const user_id = result.rows[0].user_id;
        await pool.query('CALL remove_category($1, $2)', [user_id, category_id]);
        return res.status(201).json({message: 'Category succesfully removed'});
    }
    catch(err){
        if (err.message.includes('User is not subscribed to this category')){
            return res.status(400).json({error: 'User is not subscribed to this category'});
        }

        if (err.message.includes('Category not found')){
            return res.status(404).json({error: 'Category not found'});
        }

        if (err.message.includes('User must be subscribed to at least one category')){
            return res.status(400).json({error: 'User must be subscribed to at least one category'});
        }

        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getStories = async(req, res) =>{
    const { date, category } = req.body;
    if (!date || !category) {
        return res.status(400).json({ error: 'Missing required fields: date and/or category' });
    }
    try{
    }

    catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }

};

const getUsersCategories = async(req, res) =>{
    const {email} = req.query;
    if (!email ) {
        return res.status(400).json({ error: 'Missing required field: email' });
    }
    try{
        const result = await pool.query('SELECT * FROM get_user_categories($1)', [email]);

        if (result.rows.length === 0) {
            const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

            if (userCheck.rows.length === 0) {
                return res.status(404).json({ error: 'User not found' });
            } 
            else {
                return res.status(400).json({ error: 'User is not subscribed to any categories' });
            }
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUsers,
    addUser,
    getUser,
    removeUser,
    changeEmail,
    changePassword,
    addCategory,
    removeCategory,
    getUsersCategories,
    verifyUser,
    login,
    getStories
}