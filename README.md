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
$ npm install hotrecharge --save
```

## Usage

#### Import the library

```javascript
const HotRecharge = require("hotrecharge").HotRecharge;
```

or

```javascript
const { HotRecharge } = require("hotrecharge");
```

#### Declare and instantiate a new instance of HotRecharge

```javascript
const recharge = new HotRecharge({
  email: 'email address',
  password: 'password',
  reference: 'your unique merchant reference'
});
```

> The reference is optional but if it's present then the last parameter has to be set to false - so that auto generation of references is blocked

#### Manually updating the reference
``` javascript
recharge.updateReference('unique merchant reference');
```

> Using the same reference will result in request failure !

#### Direct airtime recharge of user's mobile account

```javascript
recharge.pinLessRecharge('amount', 'targetMobile', 'BrandID', 'CustomerSMS').then(function (response) {
  //handle response
});
```

> Sample Response
```
{
  ReplyCode: 2,
  ReplyMsg: 'Recharge to 077111111 of $1 was successful. The initial balance was $0.05 final balance is $1.05',
  WalletBalance: 25,
  Amount: 1,
  Discount: 0,
  InitialBalance: 0.0494,
  FinalBalance: 1.0494,
  Window: '2021-05-15T18:33:23.7622021+02:00',
  Data: 0,
  SMS: 0,
  AgentReference: 'xxxxxxx',
  RechargeID: 0000000
}
```

#### Direct data bundle recharge of user's mobile account

```javascript
recharge.dataBundleRecharge('productcode', 'mobile number', 'custom message').then(function (response) {
  //handle response
});
```

#### Get agent wallet balance

```javascript
recharge.getAgentWalletBalance().then(function (response) {
  //handle response
});
```

#### Get end user wallet balance

```javascript
recharge.getEndUserBalance('mobile number').then(function (response) {
  //handle response
});
```

#### Get list of available data bundle options

```javascript
recharge.getDataBundleOptions().then(function (response) {
  //handle response
});
```

> Sample Response
```
{
  ReplyCode: 2,
  Bundles: [
    {
      BundleId: 47,
      BrandId: 2,
      Network: 'Econet',
      ProductCode: 'SMSD5',
      Amount: 125,
      Name: 'SMS  - 5MB',
      Description: 'SMS Daily Bundle',
      ValidityPeriod: 1
    },
  ],
  AgentReference: 'xxxxxx'
}
```

#### Query a transaction
```javascript
recharge.queryTransactionReference('transaction reference').then(function (response) {
  //handle response
});
```

> Sample response
```
{
  RawReply: '{"ReplyCode":2,"ReplyMsg":"Recharge to 0771111111 of $1 was successful. The initial balance was $0.05 final balance is $1.05","WalletBalance":25.0000,"Amount":1.0,"Discount":0.0000,"InitialBalance":0.0494,"FinalBalance":1.0494,"Window":"2021-05-15T18:33:23.7622021+02:00","Data":0.0,"SMS":0,"AgentReference":"xxxxxxx","RechargeID":0000000}',
  ReplyCode: '2',
  ReplyMsg: 'Recharge to 0771111111 of $1 was successful. The initial balance was $0.05 final balance is $1.05',
  OriginalAgentReference: 'xxxxxxx',
  AgentReference: 'yyyyyyy'
}

```

##### By Ngonidzashe Mangudya (Python Port from [@donnC](https://github.com/DonnC/Hot-Recharge-ZW))
