<h1>Google authentication using passport js</h1>
<h2>App run on <em>https://localhost:3000</em></h2>

## file/folder structure
<img src="/utils/google.png" />
---------------------------------

### server configuration is present in server.js file
### to generate self signed certificate run the command in /utils/genSsl.txt
## configuring google developers console

* create new web application
* fill the Oauth consent
    <img src="/utils/Oauthconsent.png" />
* set the user type to external
    <img src="/utils/user_type.png" />
* set the redirect urls
    <img src="/utils/urls.png" />
* set the scopes
    <img src="/utils/scopes.png" />
* obtain the clientID and clientSECRET
-------------------------
## configuring passport js
<p>
    in app.js see line( 55- 65)
</p>

## configuring passport google strategy
<p>

1. The verify function in app.js at line (69-104) which gets access to the google profile of the current logging in user handles the registration of the new user signing into the app .
2. The returned value is a function cb(null,user)  , The null parameter is error . 
3. The value passed in the cb() is stored in the req.session.passport
4. app.locals are available accross all the templates
5. see app.js line(106-101)
</p>

## configuring express-sessions and express-session-mongodb
<p>
    for express session see line(42-53) in app.js
    sessions are stored using connect-mongodb-session npm pkg
</p>

## registering user

<p>
    This functionality is handled using verify function in app.js at line(76-97)
</p>

## authenticatng user using google (Logging in user)

<p>

1. This functionality is handled in app.js at line(117-124)
2. after successfull login req.user = req.session.passport.user
3. for protecting the routes from unauthorised access a function named protect is used see app.js at line(23-39)
</p>



## logging out user
    see app.js at line(135-145)