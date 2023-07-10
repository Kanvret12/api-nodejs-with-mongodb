const express = require('express');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressLayout = require('express-ejs-layouts');
const rateLimit = require("express-rate-limit");
const passport = require('passport');
const flash = require('connect-flash');
const MemoryStore = require('memorystore')(session);
const compression = require('compression');
const { isAuthenticated } = require('./lib/auth');
const { connectMongoDb } = require('./database/connect');
const { getApikey, getDataByID, cekTotalReq } = require('./database/db');
const http = require('http');
const os = require('os');
const socketIO = require('socket.io');
const { User } = require('./database/model');
const {resetReqDay} = require('./database/resetReq');
resetReqDay();

connectMongoDb();

/* Configurations */
app.set('json spaces', 4);
app.set('trust proxy', 8);
app.set('view engine', 'ejs');
app.use(compression());
app.use(rateLimit({ windowMs: 1 * 60 * 1000,  max: 2000, message: 'Terlalu banyak requests' }));
app.use(expressLayout);
app.use('/assets', express.static('assets'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'shieldid-key', resave: true, saveUninitialized: true, cookie: { maxAge: 86400000 }, store: new MemoryStore({ checkPeriod: 86400000 }) }));
app.use(passport.initialize());
app.use(passport.session());
require('./lib/config')(passport);
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

/* Routers */
const apiRouters = require('./routes/api');
const userRouters = require('./routes/users');
const ig = require('./routes/instagram');

app.use('/api', apiRouters);
app.use('/instagram', ig);
app.use('/users', userRouters);

app.get('/', isAuthenticated, async(req, res) => {
  const {count, reqday} = await cekTotalReq();
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  const userCount = await User.countDocuments()
  res.render('index', { layout: false, active: 'index', apikey: apikey, username: username, email: email , userCount: userCount, count: count,reqday: reqday});
});

app.get('/anime', isAuthenticated, async(req, res) => {
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('anime', { layout: false, active: 'anime',apikey: apikey, username: username, email: email });
});

app.get('/generator', isAuthenticated, async(req, res) => {
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('generator', { layout: false, active: 'generator', apikey: apikey, username: username, email: email });
});
app.get('/convert', isAuthenticated, async(req, res) => {
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('convert', { layout: false, active: 'convert', apikey: apikey, username: username, email: email });
});
app.get('/downloader', isAuthenticated, async(req, res) => {
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('downloader', { layout: false, active: 'downloader', apikey: apikey, username: username, email: email });
});
app.get('/webs', isAuthenticated, async(req, res) => {
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('webs', { layout: false, active: 'webs', apikey: apikey, username: username, email: email });
});
app.get('/settings', isAuthenticated, async(req, res) => {
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('settings', { layout: false, active: 'index',apikey: apikey, username: username, email: email });
});
app.use(function (req, res) {
  res.status(404).set("Content-Type", "text/html").render('notFound', { layout: false, statusCode: res.statusCode });
});

const server = http.createServer(app);
const io = socketIO(server);
const updateInterval = 100; 
setInterval(async () => {
  try {
    const userCount = await User.countDocuments();
    io.emit('userCountUpdate', userCount);
  } catch (error) {
    console.error('Error:', error);
  }
}, updateInterval);
io.on('connection', async socket => {
  // Send memory usage to the client
  socket.on('getMemoryUsage', () => {
    const memoryUsage = process.memoryUsage();
    const availableMemory = os.freemem();
    const totalMemoryMB = os.totalmem(); // Get the available system memory
     // Get the available system memory
    const memoryData = {
      heapUsed: memoryUsage.heapUsed,
      rss: memoryUsage.rss,
      available: availableMemory,
      total: totalMemoryMB,
    };
    socket.emit('memoryUsage', memoryData);
  });
});
server.listen(4000, () => {
  console.log(`App listening at http://localhost:80`);
});
