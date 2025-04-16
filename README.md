#  Healthy UI

### Getting started 

### React via CRA
##### 1. get nvm 
`https://github.com/nvm-sh/nvm`

##### 2. install the right node / npm version with nvm   

`$ cd react-app && nvm use `

##### 3. install node modules  

`$ npm install`

##### 4. start the webpack dev server 

`$ npm run start`


### Python / Flask

#### via venv 
```
cd flask_app
python3 -m venv .venv
source .venv./bin/activate
```

#### If the library.dll file is not present in the flask_app directory
```
cd go
go build -o library.dll -buildmode=c-shared main.go library.go c_youtube.go c_newsapi.go c_factcheck.go
rm library.h
mv library.dll ../flask_app
```

#### Run Flask backend via docker (Recommended)
```
docker compose up --build
```

### EXTENSION

the extension needs to be loaded into chrome: 

extension workflow: 

`$ cd extension-react`  
`$ npm install`   
`$ npm run build`   

open chrome browser  
navigate to [chrome extensions page](chrome://extensions/)

select 'developer mode on' 
select 'load unpacked'
navigate to the extension-react folder 
choose the 'dist' directory 

### Environment Variables
Add the following .env file to your frontend/extension:
```
BACKEND_HOST=<HOST_NAME>
PORT=<PORT_NUMBER>
PROD_BACKEND_HOST=<BACKEND_HOST>

ENV=<PROD | DEV>
```
And the following .env file for your Flask backend (i.e. create a .env file in your flask_app directory):
```
GOOGLE_API_KEY=<KEY>
CLIENT_ID=<ID>
CLIENT_SECRET=<KEY>
NEWS_API_KEY=<KEY>

HOST=<HOST_NAME>
PORT=<PORT_NUMBER>

DATABASE_NAME=<NAME>
DATABSE_HOST=<HOST>
DATABASE_PORT=<PORT>
DATABASE_URI=<URI>
```

### Notes for dev vs prod
- To work in locally, you need to make sure the .env file is not ignored in .dockerignore
- You can push a subtree to heorku for the frontend and the backend

## Credits
- Logo and Icon for the chrome extension are generate from the logo.com website
