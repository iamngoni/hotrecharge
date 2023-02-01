import HotRecharge from "../service/hot-recharge";

const hotrecharge = new HotRecharge({email: "email address", password: 'password'},);

hotrecharge.pinLessRecharge(10, '0713700601').then(function (data) {
  console.log(data);
});
