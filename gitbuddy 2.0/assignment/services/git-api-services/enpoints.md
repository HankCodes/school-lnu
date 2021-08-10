# Gitlab enpoints

Slutade vid att hämta project from gitlab

## User related
To Collect information from the Gitlab API  about a user the request to this service needs the following:

* Access token
* User id
* email address

### User information
Get the users information

    https://gitlab.lnu.se/api/v4/users/:id

### Users projects
    Get a list of all users projects. This will only list the projects that the user has created. not all the projects that the user has access to

    https://gitlab.lnu.se/api/v4/users/:id/projects

These can be ordered by providing the "ordered_by" query




    
### User events
Returns the last activity for the user that provided the access token.

    https://gitlab.example.com/api/v4/events

Can be combined with different sorting parameters.
For more information please visit [Github events](https://docs.gitlab.com/ee/api/events.html)

### Global notifications
Use this endpoint to see global notification settngs like notification level and what email to sedn notifications.

Get global settings

    https://gitlab.example.com/api/v4/notification_settings

This is 