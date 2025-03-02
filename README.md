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
`$ npm watch`   

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
```
And the following .env file for your Flask backend:
```
GOOGLE_API_KEY=<KEY>
CLIENT_ID=<ID>
CLIENT_SECRET=<KEY>
NEWS_API_KEY=<KEY>

BACKEND_HOST=<HOST_NAME>
PORT=<PORT_NUMBER>
```

## Credits
- Logo and Icon for the chrome extension are generate from the logo.com website

### ToDo
#### Winter 2025
- Finish implementing the videos fact-check articles
  - Fix the backend code to remove all inference errors [Done for now]
  - Fix frontend extension code so that it runs on local host [Done]
    - Display fact checked websites using the extension [Done]
    - Potentially always add it as a pop up when clicking a new youtube video [Done -> users are free to click the extension for fack check articles]
    - Need to add caching at the frontend [Done]
    - Add logo to extension [Done]
    - Create .env file [Done]
  - Create pipelines to host website
    - Create docker container [Done for Flask]
    - Host on remoter server (Heroku, Azure, ...)
  - Need to update fact-check algo and add anti-siloing algo
    - Update fact-check algo to better match words
    - Add anti-siloing algo

- If time permits, start implementing the carbon emission tracker

### Known Issues
- YoutTube videos accessed through the chrome recent history tab will not update fetch fact-checked articles for the video
