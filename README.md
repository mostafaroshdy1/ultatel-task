# Ultatel-task- Student-Manager

https://github.com/mostafaroshdy1/ultatel-task/assets/66712535/b4a91fee-06ab-4880-9b75-6aa1463c1025

## Features

- Fully crud support for students
- Protect website using access token
- Maintaining session using refresh token
- Email confimation built using Nestjs Queue with Redis to optimize response time
- Applied repo/service design pattern with layered architecture in nestjs for clean code
- Implemented google ReCaptcha V2 to improve security against spams
- Password Reset feature

## Live Demo

- checkout API documentation here : https://ultatel-task-production.up.railway.app/api
- Fullu working deployment : https://ultatel-task.vercel.app

## Setup

### Backend

0 - First thing you need to setup the `.env` as the provided `.env.example`

1- Clone this repo and install dependencies

```sh
git clone https://github.com/mostafaroshdy1/ultatel-task.git
cd server
npm i
```

2- then you need start mariadb , and you MUST create a Database with the same name as the `.env` file

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

### Frontend

1- first install dependencies

```
npm i --force
```

2- start angular

```
npm run start
```

### Note

Make sure your front end is hosted on port 4200 or just add the new one in CORS list in `.env` file
