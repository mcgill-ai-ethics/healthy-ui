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

#### 1. create the venv 
`$ python -m venv .venv`

#### 2. activate it 
`$ source .venv/bin/activate`

#### 3. install reqs via pip 
`pip install -r requirements.txt`

#### 4. If the library.dll file is not present in the flask_app directory
```
cd go
go build -o library.dll -buildmode=c-shared main.go library.go c_youtube.go c_newsapi.go c_factcheck.go
rm library.h
mv library.dll ../flask_app
```
#### via docker 


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

### ToDo
#### Winter 2025
- Finish implementing the videos fact-check articles
  - Fix the backend code to remove all inference errors
  - Fix frontend extension code so that it runs on local host
  - Create pipelines to host website

- If time permits, start implementing the carbon emission tracker
