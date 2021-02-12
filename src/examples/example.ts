import HotRecharge from "../service/hotrecharge";

const hotrecharge = new HotRecharge({email: "email address", password: 'password'},);

hotrecharge.pinlessRecharge(10, '0713700601').then(function (data) {
  console.log(data);
});
