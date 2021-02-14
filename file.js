const {HotRecharge} = require('./dist');

const recharge = new HotRecharge({email: 'imngonii@gmail.com', password: 'Nickm@ng13'});

// recharge.pinLessRecharge(1, '0713700601', 'Inbilt Teknolog', 'Bringing airtime to you with ease.').then(function (response) {
//   console.log(response);
// });

recharge.queryTransactionReference('efe34794').then(function (response) {
  console.log(response);
});
