
const app = require('./app.js');
require('dotenv').config();
// const server = http.createServer(app);
const ConnectDB = require('./db/config')
const router = require('./router/index.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { server, io } = require('./socket.js'); 

app.use(cookieParser());
app.use(cors({
    origin: 'https://ai-webdeveloper-frontend.onrender.com',
    credentials: true
}))

app.use('/',router)

ConnectDB().then(()=>{
    server.listen(8080,()=>{
        console.log('server is running on 8080.');
    })
})
