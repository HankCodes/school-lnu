<?php

namespace Auther;

class Constants
{
    public static $WRONG_NAME_OR_PASSWORD = "Wrong name or password";
    public static $USERNAME_TOO_SHORT = "Username has too few characters, at least 3 characters.";
    public static $INVALID_USERNAME_FORMAT = "Username contains invalid characters.";
    public static $NO_USERNAME = "Username is missing";
    public static $USERNAME_MIN_LENGTH = 3;
    public static $VALID_USERNAME_FORMAT = "/[\'^£$%&*()}{@#~?><>,|]/";

    public static $NO_PASSWORD = "Password is missing";
    public static $PASSWORDS_DO_NOT_MATCH = "Passwords do not match";
    public static $PASSWORD_TOO_SHORT = "Password has too few characters, at least 6 characters.";
    public static $PASSWORD_MIN_LENGTH = 6;
    public static $USER_ALREADY_EXIST = "User exists, pick another username.";

    public static $DATABASE_TABLE_COOKIE = "autherCookie";
    public static $DATABASE_TABLE_USER = "autherUser";
    public static $DATABASE_TABLE_FAILED_TO_CREATE = "could not create TABLE";

    public static $DATABASE_COL_COOKIE_USERNAME = "username";
    public static $DATABASE_COL_COOKIE_PASSWORD = "cookiePassword";
    public static $DATABASE_COL_COOKIE_EXPDATE = "expdate";
    public static $DATABASE_COL_USER_USERNAME = "username";
    public static $DATABASE_COL_USER_PASSWORD = "password";
    public static $DATABASE_COL_PRESISTLOGIN = "presistLogin";

    public static $DATABASE_DUPLICATE_ENTRY = "Duplicate entry";
    public static $DATABASE_QUERY_ERROR = "error on query";
    public static $DATABASE_CONNECTION_DENIED = "connection to database denied";

    public static $COOKIE_NOT_CREATED = "could not create cookie";
    public static $COOKIE_NOT_FOUND = "no cookie found";
    public static $COOKIE_EXPIRED = "cookie has expired";
    public static $USERNAMES_NOT_MATCH = "usernames did not match";
    public static $COOKIE_EXP_TIME = "now +20 hours";
    public static $COOKIE_DATE_FORMAT = "Y-m-d H:i:s";

    public static $AUTHER_FAIL_FATAL = "An error caused Auther not to proceed. An error log can be found in the directory specified in auther.settings.json";
    public static $AUTHER_FAIL_WRONG_SETTINGS = "An error caused Auther not to proceed. auther.settings.json file is not complete";
}
