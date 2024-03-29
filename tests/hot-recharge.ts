//
//  hot-recharge.ts
//  hotrecharge
//
//  Created by Ngonidzashe Mangudya on 1/2/2023.

// tslint:disable-next-line:only-arrow-functions

import { Currency, HotRecharge } from '../src';
import * as dotenv from 'dotenv'


dotenv.config()

const email: string = `${process.env.TEST_EMAIL}`
const password: string = `${process.env.TEST_PASSWORD}`

// tslint:disable-next-line:only-arrow-functions
describe('testing hotrecharge service', function() {
  const hotRecharge = new HotRecharge({
    email,
    password,
  })

  // tslint:disable-next-line:only-arrow-functions
  test('walletBalance', async function() {
    const response = await hotRecharge.walletBalance();
    expect(response?.ReplyCode).toBe(2);
  })

  // tslint:disable-next-line:only-arrow-functions
  test('customerWalletBalance', async function() {
    const response = await hotRecharge.customerWalletBalance('0777213388');
    expect(response?.ReplyCode).toBe(2);
  })

  // tslint:disable-next-line:only-arrow-functions
  test('dataBundleOptions', async function() {
    const response = await hotRecharge.dataBundleOptions();
    expect(response?.ReplyCode).toBe(2);
  })

  // tslint:disable-next-line:only-arrow-functions
  test('enquireZesaCustomer', async function() {
    const response = await hotRecharge.enquireZesaCustomer('14108062218');
    expect(response?.ReplyCode).toBe(2);
  })

  // tslint:disable-next-line:only-arrow-functions
  test('zesaWalletBalance', async function() {
    const response = await hotRecharge.zesaWalletBalance();
    expect(response?.ReplyCode).toBe(2);
  })

  // tslint:disable-next-line:only-arrow-functions
  test('pinlessRecharge', async function() {
    const response = await hotRecharge.pinlessRecharge(0.1, '0777213388', 'ModestNerds','', Currency.USD);
    expect(response?.ReplyCode).toBe(2);
  })
})