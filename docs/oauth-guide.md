
OAuth Guide
=======================

Our OAuth service is based on the OAuth 2.0 Industry-standard protocol. You can read more here:
https://oauth.net/2/

Domains:
--------
- Test environment: https://test.auth.golfbox.io/
- Production environment: https://auth.golfbox.io/
- Discovery endpoint: `{domain}/.well-known/openid-configuration`

The Discovery endpoint contains information about endpoints, available scopes, key material, and features of the OAuth service.

Before You Start:
-----------------
Before you can use the OAuth service, you need:
- A Client ID issued by Dansk Golf Union (DGU)
- Redirect URI(s) registered with DGU. Where you want the users to return to on your site/app once logged in. This could be www.yoursite.com/loggedin or anything that suits your setup.
- Scopes (API access levels) you need (this will be supplied by DGU)
- Grant type: `authorization_code`

OAuth 2.0 Flow:
---------------

The uri for this call is `{domain}/connect/authorize`. Below you will find all of the required
parameters for this request. A full list of all available parameters can be found here:
https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest

• client_id: Identifier of the client.
• scope: One or more registered scopes.
• response_type: Determines the authorization processing flow. When using the Authorization Code Flow, this value is code.
• redirect_uri: Redirection URI to which the response will be sent. Note that this must match a uri saved on our server.
• code_challenge: Used for PKCE protection, see OAuth’s official documentation here:
https://www.oauth.com/oauth2-servers/pkce/authorization-request

PKCE secures OAuth by sending a hashed code challenge during auth and later verifying it with the original code verifier.
Generate like this:

Code verifier: '''openssl rand -base64 32'''
Code challenge (S256): '''echo -n "your_code_verifier" | openssl dgst -sha256 -binary | openssl base64 | tr -d '=' | tr '/+' '_-''''
Or use a tool like: https://tonyxu-io.github.io/pkce-generator/


• code_challenge_method: Used for PKCE protection. In almost all cases, this value is S256.
• country_iso (DK)

1. Redirect the user to the authorization endpoint:

   ```
   GET {domain}/connect/authorize?
     client_id=YOUR_CLIENT_ID&
     scope=get_player.information none union&
     response_type=code&
     redirect_uri=YOUR_CALLBACK_URL&
     code_challenge=CODE_CHALLENGE&
     code_challenge_method=S256&
     country_iso_code=DK&
     prompt=login
   ```

3. After successfully authorizing, the user will be presented with a login page. Here the user needs to
login with a valid GolfBox member account. After a successful login, he/she will be greeted by our
consent page, with an option to either allow or disallow the sharing of user information. If the user
agrees to share his/hers information, the page will be redirected to the supplied Redirect Uri with
2 query parameters attached. For some clients the consent page will not be shown, in this case the
redirect will happen after a successful login. 

The following will be returned to your redirect URL
• code: This is the authorization_code.
• scope: The accepted scopes.


4. Exchange the `code` for an access token. 

The uri for this call is `{domain}/connect/token`. Below you will find all of the required parameters
for this request. A full list of all available parameters can be found here:
https://openid.net/specs/openid-connect-core-1_0.html#TokenRequest

• client_id: Identifier of the client
• grant_type: This value is authorization_code.
• redirect_uri: Redirection URI to which the response will be sent. Note that this must match
a uri saved on our server.
• code: The authorization code received from the authorize request
• code_verifier: Used for PKCE protection, PKCE proof key.

   ```
   POST {domain}/connect/token?
   client_id=YOUR_CLIENT_ID&
   grant_type=authorization_code&
   redirect_uri=YOUR_CALLBACK_URL&
   code=AUTHORIZATION_CODE&
   code_verifier=ORIGINAL_CODE_VERIFIER
   ```
   Content-Type: application/x-www-form-urlencoded

5. Receive a response like:

   ```json
   {
     "access_token": "ACCESS_TOKEN",
     "expires_in": 31556926,
     "token_type": "Bearer",
     "scope": "Scopes",
     "sub": "USER_ID",
     "sub_country_iso_code": "DK"
   }
   ```


6. Use the access token to call a protected API:

   ```
   https://<domain>/<apiset>/clubs/Golfer_ByAccessToken
   ```
All requests to the API must include the following headers:

```
Content-Type: application/json
Accept: application/json
Authorization: Basic <username:password>
Token: <OAuth token>
```

Support:
--------
If you have questions or need help, contact Dansk Golf Union:
📧 it@dgu.org
