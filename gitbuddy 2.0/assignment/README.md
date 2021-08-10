# GitBuddy API

This is the repository for the GitBuddy backend api.
The backend will be run with a microservice architecture. It will consist of small self contained services.

This repository contains three different backend api's that will help building the backend.
These API's is ment to run as separate processes. This is to better separate the different parts of the application.

## The API's 

**Application API**  
This is the staring point of the backend and will handle the communication with the front end service as well as the other two API's

**Auth API**  
The auth API will help to abstract different authentication services. It will act as a layer between the Application API and the potentially different authentcation services used by the application. This is done to make sure that the Application API does not get affected if authentication services is swapped, added or removed.

**Webhook API**  
Like the Auth API this service will abstract different webhook services. It will handle requests from the difefrent services and forward them to the Application API making sure that the format recieved by the Application API is the same regardless of the webhook service being used. 
