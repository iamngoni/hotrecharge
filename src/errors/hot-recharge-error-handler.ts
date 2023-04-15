//
//  hot-recharge-error-handler.ts
//  hotrecharge
//
//  Created by Ngonidzashe Mangudya on 1/2/2023.

import HotRechargeError, {
  AuthorizationError, BalanceRequestError, DuplicateReferenceError, DuplicateRequestError,
  InsufficientBalanceError, InvalidContactError,
  OutOfPinStockError,
  PendingZesaTransactionError,
  PrepaidPlatformFailError, RechargeAmountLimitError, TransactionNotFoundError, WebServiceError,
} from './hot-recharge-error';

export default function hotRechargeErrorHandler(response, statusCode: number = null): HotRechargeError {
  return processResponse(response, statusCode)
}

/**
 * process api response for errors
 * @private
 * @throws HotRechargeError
 */
function processResponse(response = null, statusCode: number): HotRechargeError {
  const message = messageRetriever(response)

  if (response?.data.hasOwnProperty('ReplyCode')) {
    if (Number(response.data.ReplyCode) != 2) {
      let error = switcher(message, response)[Number(response.data.ReplyCode)]
      if (error == null) {
        error = new HotRechargeError(message, response)
      }

      return error
    }
  }

  if (statusCode) {
    let error = switcher(message, response)[Number(statusCode)]
    if (error == null) {
      error = new HotRechargeError(message, response)
    }

    return error
  }

  return new HotRechargeError(message, response)
}

function switcher(message, response) {
  const api_error_map = {
    4: new PendingZesaTransactionError(message, response),
    206: new PrepaidPlatformFailError(message, response),
    208: new InsufficientBalanceError(message, response),
    209: new OutOfPinStockError(message, response),
    210: new PrepaidPlatformFailError(message, response),
    216: new DuplicateRequestError(message, response),
    217: new InvalidContactError(message, response),
    218: new AuthorizationError(message, response),
    219: new WebServiceError(message, response),
    220: new AuthorizationError(message, response),
    221: new BalanceRequestError(message, response),
    222: new RechargeAmountLimitError(message, response),
    // -------- http status code -----------
    401: new AuthorizationError(message, response),
    429: new DuplicateReferenceError(message, response),
    // -------------------------------------
    800: new TransactionNotFoundError(message, response),
  }

  return api_error_map
}

function messageRetriever(response): string {
  if (response?.data.hasOwnProperty('Message')) {
    return response.data.Message
  }

  if (response?.data.hasOwnProperty('ReplyMessage')) {
    return response.data.ReplyMessage
  }

  if (response?.data.hasOwnProperty('ReplyMsg')) {
    return response.data.ReplyMsg
  } else {
    return 'Unknown error occurred. Probably network related, please check your internet connection!'
  }
}
