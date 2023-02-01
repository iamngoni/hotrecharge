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

export default class HotRechargeErrorHandler {
  private response: any;
  private is429_401: number;

  constructor(response, is429_401: number = null) {
    this.response = response
    this.is429_401 = is429_401
    this.processResponse()
  }

  /**
   * process api response for errors
   * @private
   * @throws HotRechargeError
   */
  private processResponse() {
    const message = this.messageRetriever()

    if (this.response.hasOwnProperty('ReplyCode')) {
      if (Number(this.response.ReplyCode) != 2) {
        let error = this.switcher(message)[Number(this.response.ReplyCode)]
        if (error == null) {
          error = new HotRechargeError(message, this.response)
        }

        return error
      }
    }

    if (this.is429_401){
      let error = this.switcher(message)[Number(this.is429_401)]
      if (error == null) {
        error = new HotRechargeError(message, this.response)
      }

      return error
    }

    return new HotRechargeError(message, this.response)
  }

  private switcher(message) {
    const api_error_map = {
      4: new PendingZesaTransactionError(message, this.response),
      206: new PrepaidPlatformFailError(message, this.response),
      208: new InsufficientBalanceError(message, this.response),
      209: new OutOfPinStockError(message, this.response),
      210: new PrepaidPlatformFailError(message, this.response),
      216: new DuplicateRequestError(message, this.response),
      217: new InvalidContactError(message, this.response),
      218: new AuthorizationError(message, this.response),
      219: new WebServiceError(message, this.response),
      220: new AuthorizationError(message, this.response),
      221: new BalanceRequestError(message, this.response),
      222: new RechargeAmountLimitError(message, this.response),
      // -------- http status code -----------
      401: new AuthorizationError(message, this.response),
      429: new DuplicateReferenceError(message, this.response),
      // -------------------------------------
      800: new TransactionNotFoundError(message, this.response),
    }

    return api_error_map
  }

  private messageRetriever() {
    if (this.response.data.hasOwnProperty('Message')) {
      return this.response.data.Message
    }

    if (this.response.data.hasOwnProperty('ReplyMessage')) {
      return this.response.data.ReplyMessage
    }

    if (this.response.data.hasOwnProperty('ReplyMsg')) {
      return this.response.data.ReplyMsg
    } else {
      return JSON.stringify(this.response?.data).toString()
    }
  }
}
