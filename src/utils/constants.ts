//
//  constants.ts
//  hotrecharge
//
//  Created by Ngonidzashe Mangudya on 1/2/2023.

export enum Constants {
  RECHARGE_PINLESS = 'agents/recharge-pinless',
  RECHARGE_PINLESS_USD = 'agents/recharge-pinless-usd',
  RECHARGE_DATA = 'agents/recharge-data',
  WALLET_BALANCE = 'agents/wallet-balance',
  DATA_BUNDLES = 'agents/get-data-bundles',
  USER_BALANCE = 'agents/enduser-balance?targetmobile=',
  TRANSACTION_QUERY = 'agents/query-transaction?agentReference=',
  RECHARGE_ZESA = 'agents/recharge-zesa',
  QUERY_ZESA = 'agents/query-zesa-transaction',
  ZESA_CUSTOMER = 'agents/check-customer-zesa',
  ZESA_BALANCE = 'agents/wallet-balance-zesa'
}

export enum Currency {
  ZWL = 'ZWL',
  USD = 'USD'
}