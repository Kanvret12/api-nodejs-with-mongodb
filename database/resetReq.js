const {Visitor} = require('./model');
const cron = require('node-cron');
function reset() {
    Visitor.updateMany({}, { $set: { reqday: 0 } })
      .then(() => {
        console.log('ReqDay reset successful.');
      })
      .catch((error) => {
        console.error('ReqDay reset failed:', error);
      });
  }
function resetReqDay() {
    try {
        cron.schedule('0 0 * * *', reset, { timezone: 'Asia/Jakarta' });
    } catch (err) {
        console.log('RESET DAY ERROR:', err)
    }
}
  // Run resetReqDay() every day (24 hours)
module.exports.resetReqDay = resetReqDay;
