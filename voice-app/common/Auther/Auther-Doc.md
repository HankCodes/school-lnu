# Auther
Quick and easy way to create and authenticate users in your application. Works well across multiple applications running on the same server.
It's written in PHP and uses MySQL as database.

## Use Auther
Auther is implemented by including the Auther-folder into you project directory. If Auther will be used over multiple applications on the same server it is best placed in a convenient and common location easy to reach from all your applications (is usually placed in a folder called vendor or common on the server). Import the Auther.php file (found in the root of the Auther folder) into you project and instantiate an Auther-object. You can now create new users, authenticate existing users, log out users and more. Auther uses session so make sure to start your sessions before you instantiate an object from the Auther-class.

### Configure Auther  
Auther uses a josn-file to configure itself. It needs this to be able to connect to your MySQL-database and separate the session from other applications on your server. You can read more on how to configure Auther under *"Auther settings"* further down.


**Step by step user guide**  

1. Create a .json file called auther.settings.json and configure with your settings. More on that under *"Auther settings"*.
2. Include the Auther.php file in your php project.
  
        require_once("path/to/directory/Auther/Auther.php");  
   
3. Instantiate an Auther-object from the Auther-class.  

        $auther = new \Auther\Auther($PathToSettingsFile);  

4. Use Auther methods for creating new users or authenticate existing users.  
   
    Create a user:  

        Auther->createUser($username, $password, $passwordRepeat);  
    or authenticate a user:  

        Auther->authUser($username, $password);*

Full API documentation can be found further down.

## Auther settings
Auther will not work without its settings-file. This file is needed to tell Auther what database to connect to but also how Auther should behave.  
For instance, if a faulty database connection is provided Auther will terminate your application (this behaviour can be turned off if needed).

The json-file for configure Auther is short and looks like this:  

    {  
        "app_name": "your_app_name",  
        "error_log": "path/to/errors.txt", 
        "db_name_env": "env_name_for_database_name",  
        "db_password_env": "envname_for_database_password",  
        "db_username_env": "envname_for_database_username",  
        "db_host_env": "env_name_for_database_host",  
        "db_port_env": "env_name_for_database_port",  
        "terminate_on_db_error": true  
    }

**Connect Auther to database**  
The hostname, username, password, port and database name to your MySQL database must be added as environment variables on your server. When the environment variables is set, include the name of the environment variables in the auther.settings.json file.
**Disclaimer** Do only provide the name of the environment variable to the connection credentials. Do not provide the actual username and password to your database. 

*Example:*  
    
    {
        ...
        "db_name_env": "envname_for_database_name",  
        "db_password_env": "envname_for_database_password",  
        "db_username_env": "envname_for_database_username",  
        "db_host_env": "envname_for_database_host",  
        "db_port_env": "envname_for_database_port"  
        ...
    }  


### Settings propertis rundown  


    "app_name": "your_app_name"
Specify the name of your app. Is uesd to separate sessions if Auther is used on multiple applications on the same server.

    "error_log": "path/to/errors.txt"
The path to the .txt file in which Auther will write errors to. If no such file exist in your project a new one has to be created. This .txt-file can be placed anywhere on your server as long as the path specified in auther.settings.json is correct. 

    "terminate_on_db_error": true
As default the Auther module will terminate the application if wrong database connection information is given or if the auther.settings.json is malformed. It is recomended to keep this as true in order to be notified if the database is not able to connect. This can be set to "false" if this behaviour is unwanted. **Disclaimer:** Your application can behave unpredictable if this setting is set to "false".

    "db_name_env": "env_name_for_database_name"
Provide the name of the environmen variable where the database name is stored.
    
    "db_username_env": "env_name_for_database_username"
Provide the name of the environmen variable where the database username is stored.

    "db_password_env": "env_name_for_database_password"
Provide the name of the environmen variable where the database password is stored.


    "db_host_env": "env_name_for_database_host"
Provide the name of the environmen variable where the database host is stored.

    "db_port_env": "env_name_for_database_port"
Provide the name of the environmen variable where the database port is stored. This property is optional and if omitted the default port is 3306

## API documentation
### Auther::Constructor
    new Auther($path): void
The Auther constructor takes one argument and that is a string containing the path to the auther.settings.json file.
The auther.settings.json is crucial to get Auther to work.

#### Parameters
**path**  
the path to the auther.settings.json file as a string.

### Auther::createUser
    Auther->createUser(string $username, string $password, string $passwordRepeat): void

Creates a new user and stores the user in the database.

#### Parameters
**username**  
The username of the user to be created.
If username is shorter than 3 characters, contains any of the following characters:  
' ^ £ $ % & * ( ) } { @ # ~ ? > < > , |  
a user will not be created.  

**password**  
The password of the user to be created.
If the provided password is shorter than 6 characters a user will nor be created. 

**passwordRepeat**  
Is used to let the user enter the password twice upon registratio to prevent user from enterering wrong password. If **password** and **passwordRepeat** does not match a user will not be created.

### Auther::isUserRegistered
    Auther->isUserRegistered(): bool
Used to ckeck wether the registration of the user was successful.

#### Returns
A boolean that is true if the user registration was successful and false if not.


### Auther::authUser
    Auther->authUser(string $username, string $password): void
Authenticates a user. Will check the database for username and password. If there is a match the user will be authenticated. If not, the user will remain unauthenticated. *To check if a user is authenticated use Auther::isLoggedIn-method*

#### Parameters
**username**  
The username to check

**password**  
The password to ckeck

### Auther::authWithCookies
    Auther->authWithCookies(): void
Authenticates the user using the cookies set when the user wants to presist the login. If the session is not present and the cookies are set this method will check the validity of the cookies and authenticate the user if it turns out vaid.

### Auher::isLoggedIn
    Auther->isLoggedIn(): bool
Used to ckeck if the user is authenticated or not.

#### Returns
A boolean that is true if the user is authenticated or false if not.
### Auther::logOutUser
    Auther->logOutUser(): void
 Logs out the user. Clears the session but does not delete the session cookie.

### Auther::getLastEnteredUsername
    Auther->getLastEnteredUsername(): string
Returns the latest username given to either the Auther::authUser-method or the Auther::createUser-method.

#### Returns
The username as a string.

### Auther::getMessage
    Auther->getMessage(): void
Returns the latest messgae set during a call to some of the Auther functions.

#### Returns
The message as a string.

### Auther::cleanUp
    Auther->cleanUp(): void
Cleans up any session variables that should not presist over more than one page refresh. This method is ideally called in the end of your application to ensure that a cleanup does not occur before all output is set and thus prevent lost information (e.g messages that should have been shown in the UI)