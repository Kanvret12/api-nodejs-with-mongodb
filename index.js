const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressLayout = require('express-ejs-layouts');
const rateLimit = require("express-rate-limit");
const passport = require('passport');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');
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
app.use(session({ secret: 'shieldid-key', resave: true, saveUninitialized: true, cookie: { maxAge: 86400000 }}));
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
function readPluginFiles(directory) {
  const pluginFiles = fs.readdirSync(directory);
  const plugins = [];
  for (const file of pluginFiles) {
    const pluginPath = path.join(directory, file);
    const plugin = require(pluginPath);
    plugins.push(plugin);
  }
  return plugins;
}
const navigationLinks = require('./views/Plugins/sidebar');
app.get('/', isAuthenticated, async(req, res) => {
  const {count, reqday} = await cekTotalReq();
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  const userCount = await User.countDocuments()
  const token = jwt.sign({ userId: req.user.id }, 'shieldid-key', { expiresIn: '1h' });
  res.render('index', { layout: false, active: 'index', apikey, token, username, email, userCount: userCount, count: count,reqday: reqday, navigationLinks});
});

app.get('/anime', isAuthenticated, async(req, res) => {
  const pluginsDirectory = path.join(__dirname,'views', 'Plugins', 'Anime');
  const plugins = readPluginFiles(pluginsDirectory);
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('table', { layout: false, active: 'anime',plugins, apikey, username, email,navigationLinks });
});

app.get('/generator', isAuthenticated, async(req, res) => {
  const pluginsDirectory = path.join(__dirname,'views', 'Plugins', 'Generator');
  const plugins = readPluginFiles(pluginsDirectory);
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('table', { layout: false, active: 'generator',plugins, apikey, username, email, navigationLinks });
});
app.get('/convert', isAuthenticated, async(req, res) => {
  const pluginsDirectory = path.join(__dirname,'views', 'Plugins', 'Convert');
  const plugins = readPluginFiles(pluginsDirectory);
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('table', { layout: false, active: 'convert',plugins, apikey: apikey, username, email, navigationLinks });
});
app.get('/downloader', isAuthenticated, async(req, res) => {
  const pluginsDirectory = path.join(__dirname,'views', 'Plugins', 'Downloader');
  const plugins = readPluginFiles(pluginsDirectory);
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('table', { layout: false, active: 'downloader',plugins, apikey, username, email, navigationLinks });
});
app.get('/webs', isAuthenticated, async(req, res) => {
  const pluginsDirectory = path.join(__dirname,'views', 'Plugins', 'Webs');
  const plugins = readPluginFiles(pluginsDirectory);
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('table', { layout: false, active: 'webs',plugins, apikey: apikey, username, email, navigationLinks });
});
app.get('/settings', isAuthenticated, async(req, res) => {
  let getinfo =  await getApikey(req.user.id);
  let { apikey, username, email } = getinfo;
  res.render('settings', { layout: false, active: 'index',apikey: apikey, username, email, navigationLinks });
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
