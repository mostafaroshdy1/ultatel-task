# Ultatel-task- Student-Manager


https://github.com/mostafaroshdy1/ultatel-task/assets/66712535/3db525db-1ce0-499a-bf38-311aaa483272



## Features
- Fully crud support for students
- protect website using access token
- maintainign session using refresh token
- email confimation built using Nestjs Queue with Redis to optimize response time
- applied repo/service design pattern with layered architecture in nestjs for clean code
- Utilized google ReCaptcha V2 to improve security against spams


## Setup
### Backend

0 - First thing you need to setup the ```.env``` as the provided ```.env-example```

1- Clone this repo and install dependencies
```sh
git clone https://github.com/mostafaroshdy1/ultatel-task.git
cd server
npm i
```
2- then you need start mariadb , and you MUST create a Database with the same name as the ```.env``` file
```sh
sudo systemctl start mariadb
```

3- now you need to start redis in order to get Confirmation Email work as it relies on queue which is implemented on redis
```sh
sudo systemctl start redis
```
4- start the backend
```
npm run start
```

### frontend
1- first install dependencies 
```
npm i --force
```
2- start angular
```
npm run start
```
### Note
Make sure your front end is hosted on port 4200 or just add the new one in CORS list in ```.env``` file