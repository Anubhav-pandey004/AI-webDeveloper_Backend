
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
    origin: 'http://localhost:5173',
    credentials: true
}))
// const io = require('socket.io')(server,{
//     cors: {
//         origin: 'http://localhost:5173',  // Allow frontend origin
//         methods: ['GET', 'POST'],
//         credentials: true  // Enable cookies to be sent with requests
//     }
// });

// io.use((socket, next) => {
//     console.log();
    
//     const token = socket.handshake.auth.token || socket.handshake.headers.authorization.split(' ')[1];
//     if (!token) {
//         return next(new Error("invalid user"));
//     }
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if(!decoded){
//         return next(new Error("invalid user"));
    
//     }
//     socket.user = decoded;
//     next();
// });
// io.on('connection', socket => {
//     console.log("a user connected");
    
//     socket.on('event', data => { /* … */ });
// });


app.use('/',router)

ConnectDB().then(()=>{
    server.listen(8080,()=>{
        console.log('server is running on 8080.');
    })
})