function generateValidationCode(){
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i=0; i < 6; i++){
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function isVerificationCodeValid(currentTimeIn, verificationTimeIn){
    const currentTime = new Date(currentTimeIn);
    const verificationTime = new Date(verificationTimeIn);
    const diffMs = Math.abs(verificationTime - currentTime);
    const diffHours = diffMs / (1000 * 60 * 60);
    if (diffHours > 1){
        return false;
    }
    else{
        return true;
    }
}

function getCurrentTimestamp() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); 
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}



module.exports = { 
    generateValidationCode,
    isVerificationCodeValid,
    getCurrentTimestamp,
};