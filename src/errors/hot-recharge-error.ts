//
//  hot-recharge-error.ts
//  hotrecharge
//
//  Created by Ngonidzashe Mangudya on 1/2/2023.

/**
 * HotRechargeError: base exception for api exceptions
 */
export default class HotRechargeError extends Error {
  private response: any;

  constructor(message: string, response=null) {
    super(message)
    this.response = response
  }
}

/**
 DuplicateReference Error: unique reference should be provided per each request
 */
export class DuplicateReferenceError extends HotRechargeError {}


/**
 * AuthorizationError:  password or access-code is wrong or failed to log in
 */
export class AuthorizationError extends HotRechargeError {}

/**
 * InvalidContactError: wrong number to recharge or invalid network
 */
export class InvalidContactError extends HotRechargeError {}


/**
 * PendingZesaTransactionError: indicates Pending Zesa Verification
 * Transactions in this state can result in successful transactions after a period of time once Zesa completes
 * transaction / verification.
 * If it happens, you can call the below method periodically to poll transaction status
 * Request should not exceed more than 4 requests / minute
 */
export class PendingZesaTransactionError extends HotRechargeError {}


/**
 * PrepaidPlatformFailError: Failed Recharge Network Prepaid Platform
 */
export class PrepaidPlatformFailError extends HotRechargeError {}

/**
 * RechargeAmountLimitError: Failed recharge amount limit, too little / too much
 */
export class RechargeAmountLimitError extends HotRechargeError {}

/**
 * ReferenceExceedLimitError: passed reference exceeds required limit
 */
export class ReferenceExceedLimitError extends HotRechargeError {}

/**
 * InsufficientBalanceError: not enough wallet balance
 */
export class InsufficientBalanceError extends  HotRechargeError {}


/**
 * ServiceError: recharge platform is down
 */
export class ServiceError extends HotRechargeError {}

/**
 * OutOfPinStockError: request received but provider does not have correct stock to process
 */
export class OutOfPinStockError extends HotRechargeError {}


export class WebServiceError extends HotRechargeError {}

/**
 * BalanceRequestError: possible cause: contract line or invalid number or invalid format
 */
export class BalanceRequestError extends HotRechargeError {}

/**
 * DuplicateRequestError: api already received the request and is being processed
 */
export class DuplicateRequestError extends HotRechargeError {}


/**
 * TransactionNotFoundError: the transaction could not be found, possibly failed to locate original transaction data
 * or query request performed way after threshold days (30 days)
 */
export class TransactionNotFoundError extends HotRechargeError {}