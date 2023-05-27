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
/* auth */
const { isAuthenticated } = require('./lib/auth');
const { connectMongoDb } = require('./database/connect');
const { getApikey, getDataByID } = require('./database/db');
connectMongoDb();

/* config */
app.set('json spaces', 4);
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.use(compression());
app.use(rateLimit({ windowMs: 1 * 60 * 1000,  max: 2000, message: 'Terlalu banyak requests' }));
app.use(expressLayout);
// app.use(express.static('assets'));
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
})

/* route */
const apiRouters = require('./routes/api');
const userRouters = require('./routes/users');
const ig = require('./routes/instagram');

app.use('/api', apiRouters);
app.use('/isntagram', ig);
app.use('/users', userRouters);

app.get('/', isAuthenticated, async(req, res) => {
  res.render('index', { layout: false })
})
app.get('/anime', isAuthenticated, async(req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, email } = getinfo
  res.render('anime', { layout: false, apikey: apikey, username: username, email: email })
})
app.get('/generator', isAuthenticated, async(req, res) => {
  let getinfo =  await getApikey(req.user.id)
  let { apikey, username, email } = getinfo
  res.render('generator', { layout: false, apikey: apikey, username: username, email: email })
})





app.use(function (req, res) {
  res.status(404).set("Content-Type", "text/html")
  .render('notFound', { layout: false, statusCode: res.statusCode });
});

app.listen(80, () => {
  console.log(`App listening at http://localhost:80`);
});
