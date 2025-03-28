# Insurance Backend API's

[![N|Solid](https://htstechsolutions.com/assets/images/HTS-white.webp)](https://nodesource.com/products/nsolid)

## Commands

To start the application, use the following command:

```sh
npm i
npm start
```

Development Mode.
```sh
npm i
npm run dev
```

Generate Swagger Documentation.
```sh
npm i
npm run create-swagger
```



Here are the appropriate HTTP status codes for the scenarios you mentioned:

Payload Incorrect:

400 Bad Request: This status code indicates that the request payload is malformed or doesn't meet the required criteria.
Access Denied. No Token Provided:

401 Unauthorized: This indicates that authentication is required and has either failed or not been provided.
Token is Expired:

401 Unauthorized: This status code is also appropriate for expired tokens. You can include a message in the response body to specify that the token has expired.
Access Denied Due to CORS:

403 Forbidden: This is used when the server understands the request but refuses to authorize it. However, CORS issues are usually handled by the browser before the request reaches the server, so this might not always be relevant.