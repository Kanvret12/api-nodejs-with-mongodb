const {Visitor} = require('./model');
const cron = require('node-cron');
function resetReqDay() {
    Visitor.updateMany({}, { $set: { reqday: 0 } })
      .then(() => {
        console.log('ReqDay reset successful.');
      })
      .catch((error) => {
        console.error('ReqDay reset failed:', error);
      });
  }
  
  // Run resetReqDay() every day (24 hours)
cron.schedule('0 0 * * *', resetReqDay, { timezone: 'Asia/Jakarta' });