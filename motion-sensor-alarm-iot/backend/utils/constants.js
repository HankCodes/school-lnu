module.exports = constants = {
    WRONG_CREDENTIALS: 'Username and password did not match',
    INVALID_CREDENTIALS: 'Invalid credentials',
    
    EMAIL_TAKEN: 'Email is already taken',
    
    NO_PASSPHRASE: 'Passphrase is missing',
    NO_EMAIL: 'Email is missing',

    WRONG_FORMAT_PASSPHRASE: 'Passprase must be between 10 - 16 characters',
    WRONG_FORMAT_EMAIL: 'Must be a valid email format',
    WRONG_FORMAT_FIRSTNAME: 'First name wrong format, can only contain letters and must be between 0 - 20 characters',
    
    REGEXP_EMAIL: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
    REGEXP_FIRSTNAME: /^[a-z_-]{1,20}$/i,
}
