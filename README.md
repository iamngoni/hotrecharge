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

```sh
$ yarn add hotrecharge
```

## Usage

#### Import the library

```typescript
const HotRecharge = require("hotrecharge").HotRecharge;
```

or

```typescript
const { HotRecharge, Currency } = require("hotrecharge");
```

#### Declare and instantiate a new instance of HotRecharge

```typescript
const recharge = new HotRecharge({
  email: 'email address',
  password: 'password',
});
```

#### Direct airtime recharge of user's mobile account

```typescript
import { Currency } from './constants';

let response = await recharge.pinlessRecharge('amount', 'targetMobile', 'BrandID', 'CustomerSMS', Currency.ZWL)
```

##### Sample Response
```typescript
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

```typescript
let response = await recharge.dataBundleRecharge('productcode', 'mobile number', 'custom message')
```

#### Get agent wallet balance

```typescript
let response = await recharge.walletBalance()
```

#### Get end user wallet balance

```typescript
let response = await recharge.customerWalletBalance('mobile number')
```

#### Get list of available data bundle options

```typescript
let response = await recharge.dataBundleOptions()
```

##### Sample Response
```typescript
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
```typescript
let response = recharge.queryTransactionReference('transaction reference')
```

##### Sample response
```typescript
{
  RawReply: '{"ReplyCode":2,"ReplyMsg":"Recharge to 0771111111 of $1 was successful. The initial balance was $0.05 final balance is $1.05","WalletBalance":25.0000,"Amount":1.0,"Discount":0.0000,"InitialBalance":0.0494,"FinalBalance":1.0494,"Window":"2021-05-15T18:33:23.7622021+02:00","Data":0.0,"SMS":0,"AgentReference":"xxxxxxx","RechargeID":0000000}',
  ReplyCode: '2',
  ReplyMsg: 'Recharge to 0771111111 of $1 was successful. The initial balance was $0.05 final balance is $1.05',
  OriginalAgentReference: 'xxxxxxx',
  AgentReference: 'yyyyyyy'
}
```

#### Purchase Zesa Tokens
```typescript
const response = await recharge.rechargeZesa(amount, mobileNumberToSendTokenTo, meterNumber)
```

##### Sample Response
```typescript
{
    ReplyCode: replyCode,
    ReplyMsg: replyMsg,
    WalletBalance: walletBalance,
    Amount: amount,
    Discount: discount,
    Meter: meter,
    AccountName: accountName,
    Address: address,
    Tokens: [
       {
            Token: token,
            Units: units,
            NetAmount: netAmount,
            Levy: levy,
            Arrears: arrears,
            TaxAmount: taxAmount,
            ZesaReference: zesaReference,
        }
    ],
    AgentReference: agentReference,
    RechargeID: rechargeID,
}
```

#### Check Zesa Agent Wallet Balance
```typescript
const response = await recharge.zesaWalletBalance()
```

##### Sample Response
```typescript
{
    ReplyCode: 2,
    ReplyMsg: 'Your HOT ZESA Balance is $ 0.00. You can sell approximately $ 0.00.', 
    WalletBalance: 0,
    AgentReference: '11d9f48c9c464e0f81268ee7cab8c90c'
}
```

#### Check Zesa Customer Details
```typescript
const response = await recharge.enquireZesaCustomer('meterNumber')
```

##### Sample Response
```typescript
{
      ReplyCode: 2,
      ReplyMsg: 'PRINCE JONATHAN T KUIPA\n9999 9999 MUTAMBARA MISSION',
      Meter: 'xxxxxxxx',
      CustomerInfo: {
          Reference: '',
          CustomerName: 'PRINCE JONATHAN T KUIPA\n9999 9999 MUTAMBARA MISSION',
          Address: '',
          MeterNumber: 'xxxxxxxxx'
      },
      AgentReference: null
}
```

##### By Ngonidzashe Mangudya (Python Port from [@donnC](https://github.com/DonnC/Hot-Recharge-ZW))
