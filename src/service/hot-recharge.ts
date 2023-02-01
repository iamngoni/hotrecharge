import axios from 'axios';
import Credential from '../interfaces/credential';
import AuthorizationError from '../types/unauthorized';
import GeneralError from '../types/error';
import * as uuid from 'uuid';
import PinLessRecharge from '../interfaces/pinless-recharge';
import DataBundle from '../interfaces/data-bundle';
import { Logger } from "tslog";

const logger = new Logger();

export default class HotRecharge {
  /** HotRecharge server endpoint */
  private rootEndpoint: string = 'https://ssl.hot.co.zw';
  /** Api version */
  private apiVersion: string = '/api/v1/';
  /** Content-type for Https requests */
  private contentType: string = 'application/json';

  // Endpoints
  /** The endpoint for airtime recharge */
  private rechargePinless = 'agents/recharge-pinless';
  /** The endpoint for data recharge */
  private rechargeData = 'agents/recharge-data';
  /** The endpoint checking agent wallet balance */
  private walletBalance = 'agents/wallet-balance';
  /** The endpoint for getting agent data balance */
  private getDataBundle = 'agents/get-data-bundles';
  /** The endpoint for getting end user balance */
  private endUserBalance = 'agents/enduser-balance?targetmobile=';
  /** The end for querying a transaction */
  private queryTransaction = 'agents/query-transaction?agentReference=';
  /** Headers to be passed to the https request */
  private headers: Record<string, string> = {
    'x-access-code': '',
    'x-access-password': '',
    'x-agent-reference': '',
    'content-type': 'null',
    'cache-control': 'null',
  };
  /** This is the url that will be accessed by the service */
  private url: string = '';

  /**
   * Hot Recharge Web Service
   * Author: Ngonidzashe Mangudya <iamngoni@modestnerd.co>
   * @param agentDetails {Credential} Agent details - Email Address, Password And|Or Merchant Reference
   * @constructor
   */
  constructor(agentDetails: Credential) {
    this.headers['x-access-code'] = agentDetails.email;
    this.headers['x-access-password'] = agentDetails.password;
    this.headers['x-agent-reference'] = HotRecharge.generateReference();
    this.headers['content-type'] = this.contentType;
    this.headers['cache-control'] = 'no-cache';
    logger.info('HotRecharge initialized ...')
  }

  /**
   * Get agent wallet balance
   */
  public async getAgentWalletBalance() {
    // set url to point to wallet balance endpoint
    this.url = this.rootEndpoint + this.apiVersion + this.walletBalance;
    // process the request with axios
    return await this.get();
  }

  /**
   * Get end user balance
   * @param mobileNumber End user mobile number
   */
  public async getEndUserBalance(mobileNumber: string) {
    this.url = this.rootEndpoint + this.apiVersion + this.endUserBalance + mobileNumber;
    return await this.get();
  }

  /**
   *
   * @param amount Amount to recharge
   * @param mobileNumber Mobile number to recharge
   * @param brandId Optional
   * @param message Optional: Customer sms to send
   */
  public async pinLessRecharge(amount: number, mobileNumber: string, brandId: string = null, message: string = null) {
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

    this.url = this.rootEndpoint + this.apiVersion + this.rechargePinless;
    return await this.post(payload);
  }

  /**
   *
   * @param productCode Bundle product code e.g. DWB15 for weekly data bundle - ECONET
   * @param mobileNumber Mobile number to recharge
   * @param message Optional: customer sms to send
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


    this.url = this.rootEndpoint + this.apiVersion + this.rechargeData;
    return await this.post(payload);
  }

  /**
   * Query transaction
   * @param agentReference Agent reference for the transaction
   */
  public async queryTransactionReference(agentReference: string) {
    this.updateRequestReference();
    logger.info('Checking transaction reference');
    this.url = this.rootEndpoint + this.apiVersion + this.queryTransaction + agentReference;
    return await this.get();
  }

  /**
   * Get list of available data bundle options
   */
  public async getDataBundleOptions() {
    logger.info('Checking data bundle options')
    this.url = this.rootEndpoint + this.apiVersion + this.getDataBundle;
    return await this.get();
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
    this.headers['x-agent-reference'] = HotRecharge.generateReference();
  }
}
