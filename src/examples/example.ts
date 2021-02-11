import HotRecharge from "../service/hotrecharge";

const hotrecharge = new HotRecharge({email: "imngonii@gmail.com", password: 'Nickm@ng13'},);

//post
// hotrecharge.pinlessRecharge(10, '0713700601').then(function (data) {
//   console.log(data);
// });

hotrecharge.dataBundleRecharge('SMSD5', '0713700601').then(function (data) {
  console.log(data);
});

//get
// hotrecharge.getDataBundlesBalance().then(function (response) {
//   console.log(response);
// });

//get
// hotrecharge.getEndUserBalance('0713700601').then(function (response) {
//   console.log(response);
// });

//get
// hotrecharge.getAgentWalletBalance().then(function(response) {
//   console.log(response);
// });