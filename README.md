# NODEJS Library for  [Hot Recharge](https://ssl.hot.co.zw)

## Sign up for a merchant account at [Hot Recharge](https://ssl.hot.co.zw)

> You will need your email and your password to make successful requests

## Prerequisites

The library has a set of prerequisites that must be met for it to work

1. Node.js
2. NPM (Node Package Manager)

## Installation

Install the library using either npm or yarn

```sh
$ npm install --save hotrecharge
```

## Usage

#### Import the library
```javascript
const HotRecharge = require("hotrecharge").HotRecharge;
```

#### Declare and instantiate a new instance of HotRecharge
```javascript
const hotrecharge = new HotRecharge({
  email: 'email address',
  password: 'password',
  ref: 'your unique merchant reference'
}, false);
```

> The ref is optional but if it's present then the last parameter has to be set to false - so that auto generation of references is blocked

#### Make a pinless recharge transaction
```javascript
hotrecharge.pinlessRecharge(10, '0713700601').then(function (data) {
  console.log(data);
});
```


##### By Ngonidzashe Mangudya (Python Port from @donnC)