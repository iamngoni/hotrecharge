import HotRecharge from "../service/hotrecharge";

const hotrecharge = new HotRecharge({email: "email@gmail.com", password: 'emailp@55w0rd'},);

hotrecharge.pinlessRecharge(10, '0713700601').then(function (data) {
  console.log(data);
});
