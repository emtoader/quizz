# quizz
A quick project that implements Node ( Express ), React + Redux, Docker, JOI, SuperTest, Custom Form Repeater

In Node and React folders use:
npm install 

Then in both folders use:
docker compose up

If you wish to use projects without docker ( npm start ), please check node/app/config/db.config.js and use:
```javascript
 const db = new Sequelize('toptal_quizz', 'root', '', {
     host: "localhost", //this changes without docker
     dialect: "mysql",
 });
 ```
