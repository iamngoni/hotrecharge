import HotRecharge from "../service/hotrecharge";

const hotrecharge = new HotRecharge({email: "imngonii@gmail.com", password: 'Nickm@ng13'},);
hotrecharge.pinlessRecharge(10, '0713700601').then(function (data) {
  console.log(data);
});