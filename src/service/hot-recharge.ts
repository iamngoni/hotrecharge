import axios from 'axios';
import Credential from '../interfaces/credential';
import AuthorizationError from '../errors/unauthorized';
import GeneralError from '../errors/error';
import * as uuid from 'uuid';
import PinLessRecharge from '../interfaces/pinless-recharge';
import DataBundle from '../interfaces/data-bundle';
import { logger } from '../utils/logger';
import ZesaRecharge from '../interfaces/zesa-recharge';
import { Constants } from '../utils/constants'


export default class HotRecharge {
  /** HotRecharge server endpoint */
  private rootEndpoint: string = 'https://ssl.hot.co.zw';
  /** Api version */
  private apiVersion: string = '/api/v1/';

  /** Headers to be passed to the https request */
  private headers: Record<string, string> = {
    'x-access-code': '',
    'x-access-password': '',
    'x-agent-reference': '',
    'content-type': 'application/json',
    'cache-control': 'no-cache',
  };
  /** This is the url that will be accessed by the service */
  private url: string = '';

  /**
   * Hot Recharge Web Service
   * Author: Ngonidzashe Mangudya <iamngoni@modestnerd.co>
   * @param config {Credential} Agent details - Email Address, Password And|Or Merchant Reference
   * @constructor
   */
  constructor(config: Credential) {
    this.headers['x-access-code'] = config.email;
    this.headers['x-access-password'] = config.password;
    this.headers['x-agent-reference'] = HotRecharge.generateReference();
    logger.info('HotRecharge initialized ...')
  }

  /**
   * Get agent wallet balance
   *
   * Response:
   * ```ts
   * {
   *     AgentReference: agentReference,
   *     ReplyCode: replyCode,
   *     ReplyMsg: replyMsg,
   *     WalletBalance: walletBalance,
   * }
   * ```
   */
  public async walletBalance() {
    // set url to point to wallet balance endpoint
    this.url = this.rootEndpoint + this.apiVersion + Constants.WALLET_BALANCE;
    // process the request with axios
    return await this.get();
  }

  /**
   * Get wallet balance
   * @param mobileNumber End user mobile number
   *
   * Response:
   * ```ts
   * {
   *    AgentReference: agentReference,
   *    ReplyCode: replyCode,
   *    ReplyMsg: replyMsg,
   *    WalletBalance: walletBalance,
   * }
   * ```
   */
  public async customerWalletBalance(mobileNumber: string) {
    this.url = this.rootEndpoint + this.apiVersion + Constants.USER_BALANCE + mobileNumber;
    return await this.get();
  }

  /**
   *
   * @param amount Amount to recharge
   * @param mobileNumber Mobile number to recharge
   * @param brandId Optional
   * @param message Optional: Customer sms to send
   *
   * Response:
   * ```ts
   * {
   *    AgentReference: agentReference,
   *    Amount: amount,
   *    Data: data,
   *    Discount: discount,
   *    FinalBalance: finalBalance,
   *    InitialBalance: initialBalance,
   *    RechargeID: rechargeID,
   *    ReplyCode: replyCode,
   *    ReplyMsg: replyMsg,
   *    SMS: sms,
   *    WalletBalance: walletBalance,
   *    Window: window,
   * }
   * ```
   */
  public async pinlessRecharge(amount: number, mobileNumber: string, brandId: string = null, message: string = null) {
    const payload: PinLessRecharge = {
      amount,
      targetMobile: mobileNumber,
      BrandID: brandId,
      CustomerSMS: message,
    };

    if (brandId == null) {
      payload.BrandID = 'ModestNerds, Co';
    }

    if (message != null) {
      if (message.length > 135) {
        throw new Error('Message exceeds character limit of 135');
      }
      payload.CustomerSMS = message + ' - Airtime Recharge of $' + payload.amount + 'through HotRecharge (ModestNerds, Co) successful.';
    } else {
      payload.CustomerSMS = 'Airtime Recharge of $' + payload.amount + 'through HotRecharge (ModestNerds, Co) successful.';
    }

    logger.info(`Pinless Recharge(Amount: $${payload.amount}, Target Mobile: ${payload.targetMobile}, Brand ID: ${payload.BrandID}, CustomerSMS: ${payload.CustomerSMS})`);

    this.url = this.rootEndpoint + this.apiVersion + Constants.RECHARGE_PINLESS;
    return await this.post(payload);
  }

  /**
   *
   * @param productCode Bundle product code e.g. DWB15 for weekly data bundle - ECONET
   * @param mobileNumber Mobile number to recharge
   * @param message Optional: customer sms to send
   *
   * Response:
   * ```ts
   * {
   *    AgentReference: agentReference,
   *    Amount: amount,
   *    Data: data,
   *    Discount: discount,
   *    FinalBalance: finalBalance,
   *    InitialBalance: initialBalance,
   *    RechargeID: rechargeID,
   *    ReplyCode: replyCode,
   *    ReplyMsg: replyMsg,
   *    SMS: sms,
   *    WalletBalance: walletBalance,
   *    Window: window,
   * }
   * ```
   */
  public async dataBundleRecharge(productCode: string, mobileNumber: string, message: string = null) {
    const payload: DataBundle = {
      productcode: productCode,
      targetMobile: mobileNumber,
      CustomerSMS: message,
    };

    if (message != null) {
      if (message.length > 135) {
        throw new Error('Message exceeds character limit of 135');
      }
      payload.CustomerSMS = message + ' - Data Bundle Recharge through HotRecharge (ModestNerds, Co) successful.';
    } else {
      payload.CustomerSMS = 'Data Bundle Recharge through HotRecharge (ModestNerds, Co) successful.';
    }

    logger.info(`Data Bundle Recharge(Product Code: $${payload.productcode}, Target Mobile: ${payload.targetMobile}, CustomerSMS: ${payload.CustomerSMS})`);


    this.url = this.rootEndpoint + this.apiVersion + Constants.RECHARGE_DATA;
    return await this.post(payload);
  }

  /**
   * Query transaction
   * @param agentReference Agent reference for the transaction
   *
   * Response:
   * ```ts
   * {
   *    ReplyCode: replyCode,
   *    ReplyMsg: replyMsg,
   *    OriginalAgentReference: originalAgentReference,
   *    RawReply: rawReply,
   *    AgentReference: agentReference,
   * }
   * ```
   */
  public async queryTransactionReference(agentReference: string) {
    this.updateRequestReference();
    logger.info('Checking transaction reference');
    this.url = this.rootEndpoint + this.apiVersion + Constants.TRANSACTION_QUERY + agentReference;
    return await this.get();
  }

  /**
   * Get list of available data bundle options
   *
   * Response:
   *
   * ```ts
   * {
   *    ReplyCode: 2,
   *    Bundles: [
   *        {
   *            BundleId: 59,
   *            BrandId: 20,
   *            Network: 'Econet WhatsApp',
   *            ProductCode: 'WPD1',
   *            Amount: 2515,
   *            Name: 'WhatsApp (4MB)+ Pinterest 2MB',
   *            Description: 'WhatsApp (4MB)+ Pinterest 2MB',
   *            ValidityPeriod: 1
   *        }
   *    ],
   *    AgentReference: '44d76e1d608444df93e9a1a3bfc8d8d3'
   * }
   * ```
   */
  public async dataBundleOptions() {
    logger.info('Checking data bundle options')
    this.url = this.rootEndpoint + this.apiVersion + Constants.DATA_BUNDLES;
    return await this.get();
  }

  /**
   *
   * @param amount Amount to recharge
   * @param notifyMobileNumber Mobile number to receive the recharge token
   * @param meterNumber Meter number to be recharged
   * @param message Optional: Customer sms to send
   *
   * Response:
   * ```ts
   * {
   *     ReplyCode: replyCode,
   *     ReplyMsg: replyMsg,
   *     WalletBalance: walletBalance,
   *     Amount: amount,
   *     Discount: discount,
   *     Meter: meter,
   *     AccountName: accountName,
   *     Address: address,
   *     Tokens: [
   *        {
   *             Token: token,
   *             Units: units,
   *             NetAmount: netAmount,
   *             Levy: levy,
   *             Arrears: arrears,
   *             TaxAmount: taxAmount,
   *             ZesaReference: zesaReference,
   *         }
   *     ],
   *     AgentReference: agentReference,
   *     RechargeID: rechargeID,
   * }
   * ```
   */
  public async rechargeZesa(amount: number, notifyMobileNumber: string, meterNumber: string, message: string = null) {
    const payload: ZesaRecharge = {
      Amount: amount,
      TargetNumber: notifyMobileNumber,
      meterNumber,
      CustomerSMS: message,
    };

    if (message != null) {
      if (message.length > 135) {
        throw new Error('Message exceeds character limit of 135');
      }
      payload.CustomerSMS = message + ' - Zesa Recharge of $' + payload.Amount + 'through HotRecharge (ModestNerds, Co) successful.';
    } else {
      payload.CustomerSMS = 'Zesa Recharge of $' + payload.Amount + 'through HotRecharge (ModestNerds, Co) successful.';
    }

    logger.info(`Zesa Recharge(Amount: $${payload.Amount}, Notify Mobile Number: ${payload.TargetNumber}, Meter Number: ${payload.meterNumber}, CustomerSMS: ${payload.CustomerSMS})`);

    this.url = this.rootEndpoint + this.apiVersion + Constants.RECHARGE_ZESA;
    return await this.post(payload);
  }

  /**
   * check zesa customer. please note! You are advised to first check zesa customer before performing
   * zesa recharge, i.e prompt the user to confirm their details first before proceeding
   * meter_number: the 11 digit meter number of suer
   * @param meterNumber
   *
   * Response:
   * ```ts
   * {
   *    ReplyCode: replyCode,
   *    ReplyMsg: replyMsg,
   *    Meter: meter,
   *    AgentReference: agentReference,
   *    CustomerInfo: {
   *       CustomerName: customerName,
   *       Address: address,
   *       MeterNumber: meterNumber,
   *       Reference: reference,
   *    },
   * }
   * ```
   */
  public async enquireZesaCustomer(meterNumber: string) {
    const payload: Record<string, string> = {
      'MeterNumber': meterNumber,
    };
    logger.info(`Checking zesa customer details for ${meterNumber}`)
    this.url = this.rootEndpoint + this.apiVersion + Constants.ZESA_CUSTOMER;
    return await this.post(payload);
  }

  /**
   * Get agent zesa wallet balance
   *
   * Response:
   * ```ts
   * {
   *    AgentReference: agentReference,
   *    ReplyCode: replyCode,
   *    ReplyMsg: replyMsg,
   *    WalletBalance: walletBalance,
   * }
   * ```
   */
  public async zesaWalletBalance() {
    logger.info('Checking agent zesa wallet balance')
    this.url = this.rootEndpoint + this.apiVersion + Constants.ZESA_BALANCE;
    return await this.get();
  }

  /**
   * Query a zesa transaction for reconciliation: reccommended is to query within the last 30 days of the transaction
   * @param rechargeId
   *
   * Response:
   * ```ts
   * {
   *    ReplyCode: replyCode,
   *    ReplyMsg: replyMsg,
   *    WalletBalance: walletBalance,
   *    Amount: amount,
   *    Discount: discount,
   *    Meter: meter,
   *    AccountName: accountName,
   *    Address: address,
   *    Tokens: [
   *        {
   *             Token: token,
   *             Units: units,
   *             NetAmount: netAmount,
   *             Levy: levy,
   *             Arrears: arrears,
   *             TaxAmount: taxAmount,
   *             ZesaReference: zesaReference,
   *         }
   *    ],
   *    AgentReference: agentReference,
   *    RechargeID: rechargeID,
   *    CustomerInfo: {
   *       CustomerName: customerName,
   *       Address: address,
   *       MeterNumber: meterNumber,
   *       Reference: reference,
   *    },
   * }
   * ```
   */
  public async QueryZesaTransaction(rechargeId: string) {
    const payload: Record<string, string> = {
      "RechargeId": rechargeId
    }
    logger.info(`Querying ZesaTransaction(RechargeId: ${payload.RechargeId})`)
    this.url = this.rootEndpoint + this.apiVersion + Constants.QUERY_ZESA;
    return await this.post(payload);
  }

  /**
   * Process Get Request With Axios
   * @private
   */
  private async get() {
    this.updateRequestReference();
    try {
      const response = await axios.get(this.url, {
        headers: this.headers,
        timeout: 45000,
        timeoutErrorMessage: 'Request timed out (45 seconds). Try again!',
      });
      logger.info('Response Data');
      this.logObject(response.data)
      return response.data;
    } catch (error) {
      logger.error(error)
      // Check if request has been timed out
      if (error.code === 'ECONNABORTED') {
        return new GeneralError('Request timed out (45 seconds).');
      }

      // Check if error is caused by network
      if (error.code === 'EAI_AGAIN') {
        return new GeneralError('Network error.');
      }

      // Check if response is a request authorization error
      if (error.response?.status === 401) {
        return new AuthorizationError(error.response.data.Message);
      }

      return new GeneralError(error.response?.data);
    }
  }

  /**
   * Process Post Request With Axios
   * @param data Data to post with request
   * @private
   */
  private async post(data: object) {
    this.updateRequestReference();
    try {
      const response = await axios.post(this.url, data, {
        headers: this.headers,
        timeout: 45000,
        timeoutErrorMessage: 'Request timed out (45 seconds). Try again!',
      });
      logger.info('Response Data');
      this.logObject(response.data)

      return response.data;
    } catch (error) {
      // Check if request has been timed out
      if (error.code === 'ECONNABORTED') {
        return new GeneralError('Request timed out (45 seconds).');
      }

      // Check if error is caused by network
      if (error.code === 'EAI_AGAIN') {
        return new GeneralError('Network error.');
      }

      // Check if response is a request authorization error
      if (error.response.status === 401) {
        return new AuthorizationError(error.response.data.Message);
      }

      return new GeneralError(error.response.data);
    }
  }

  private logObject(object) {
    logger.info(JSON.parse(JSON.stringify(object)))
  }

  /**
   * Generate random merchant reference
   * @returns Unique merchant reference
   * @private
   */
  private static generateReference(): string {
    const randomUuid: string = uuid.v4();
    return randomUuid.split('-').join('');
  }

  /**
   * Auto update merchant reference
   * @private
   */
  private updateRequestReference() {
    logger.info('Updating request reference')
    const reference = HotRecharge.generateReference();
    logger.info(`Reference: ${reference}`);
    this.headers['x-agent-reference'] = reference;
  }
}
