const { User, Visitor, Token } = require('./model');

    async function addUser(email, username, password, apikey) {
        let obj = { email, username, password, apikey };
        var users = {};
        User.find({}, function (err, user) {
            users[user._id] = user;
        });
        console.log(users)
        User.create(obj);
    }
    module.exports.addUser = addUser
    async function VisitorCreate(visitor) {
        let obj = {visitor};
        var users = {};
        Visitor.find({}, function (err, user) {
            users[user._id] = user;
        });
        console.log(users)
        Visitor.create(obj);
    }
    module.exports.VisitorCreate = VisitorCreate

    async function NotVer(email, username, password, token) {
        let obj = { email, username, password, token};
        var users = {};
        Token.find({}, function (err, user) {
            users[user._id] = user;
        });
        console.log(users)
        Token.create(obj);
    }
    module.exports.NotVer = NotVer

    async function checkEmail(email) {
        let users = await User.findOne({email: email});
        if(users !== null) {
            return users.email;
        } else {
            return false;
        }
    }
    module.exports.checkEmail = checkEmail;

    async function getApikey(id) {
        let users = await User.findOne({_id: id});
        return {apikey: users.apikey, email: users.email, username: users.username};
    }
    module.exports.getApikey = getApikey;

    async function getDataByID(id) {
        let users = await User.findOne({_id: id});
        return users;
    }
    module.exports.getDataByID = getDataByID;

    async function cekKey(apikey) {
        let db = await User.findOne({apikey: apikey});
        if(db === null) {
            return false;
        } else {
            return db.apikey;
        }
    }
    module.exports.cekKey = cekKey;
    async function cekTotalReq() {
        let visitor = await Visitor.findOne();
        return {count: visitor.count, reqday: visitor.reqday} ;
      }
    module.exports.cekTotalReq = cekTotalReq