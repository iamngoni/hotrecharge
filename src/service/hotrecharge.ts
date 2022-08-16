import axios from "axios";
import Credentials from "../interfaces/credentials";
import Headers from "../interfaces/headers";
import AuthorizationError from '../types/unauthorized';
import GeneralError from '../types/error';
import * as uuid from 'uuid';
import PinLessRecharge from '../interfaces/pinlessrecharge';
import DataBundle from '../interfaces/dataBundle';

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
  private headers: Headers = {"x-access-code": "", "x-access-password": "", "x-agent-reference": "", "content-type": "null", "cache-control": "null"};
  /** This is the url that will be accessed by the service */
  private url: string = '';

  /**
   * Hot Recharge Web Service
   * Author: Ngonidzashe Mangudya <imngonii@gmail.com>
   * @param agentDetails {Credentials} Agent details - Email Address, Password And|Or Merchant Reference
   * @constructor
   */
  constructor (agentDetails: Credentials) {
    this.headers["x-access-code"] =  agentDetails.email;
    this.headers["x-access-password"] = agentDetails.password;
    this.headers["x-agent-reference"] = HotRecharge.generateReference();
    this.headers["content-type"] = this.contentType;
    this.headers["cache-control"] = 'no-cache';
  }

  /**
   * Get agent wallet balance
   */
  public async getAgentWalletBalance () {
    // set url to point to wallet balance endpoint
    this.url = this.rootEndpoint + this.apiVersion + this.walletBalance;
    // process the request with axios
    return await this.processHttpsGetRequest();
  }

  /**
   * Get end user balance
   * @param mobileNumber End user mobile number
   */
  public async getEndUserBalance (mobileNumber: string) {
    this.url = this.rootEndpoint + this.apiVersion + this.endUserBalance + mobileNumber;
    return await this.processHttpsGetRequest();
  }

  /**
   *
   * @param amount Amount to recharge
   * @param mobileNumber Mobile number to recharge
   * @param brandId Optional
   * @param message Optional: Customer sms to send
   */
  public async pinLessRecharge (amount: number, mobileNumber: string, brandId: string = null, message: string = null) {
    const payload: PinLessRecharge = {
      "amount": amount,
      "targetMobile": mobileNumber,
      "BrandID": null,
      "CustomerSMS": null
    };

    if (brandId != null) {
      payload.BrandID = brandId;
    }

    if (message != null) {
      if (message.length > 135) {
        throw new Error('Message exceeds character limit of 135');
      }
      payload.CustomerSMS = message + ' - Airtime Recharge of $' + payload.amount + ' successful.';
    }

    this.url = this.rootEndpoint + this.apiVersion + this.rechargePinless;
    return await this.processHttpsPostRequest(payload);
  }

  /**
   *
   * @param productCode Bundle product code e.g. DWB15 for weekly data bundle - ECONET
   * @param mobileNumber Mobile number to recharge
   * @param message Optional: customer sms to send
   */
  public async dataBundleRecharge (productCode: string, mobileNumber: string, message: string = null) {
    const payload: DataBundle = {
      "productcode": productCode,
      "targetMobile": mobileNumber,
      "CustomerSMS": null
    };

    if (message != null) {
      if (message.length > 135) {
        throw new Error('Message exceeds character limit of 135');
      }
      payload.CustomerSMS = message;
    }

    this.url = this.rootEndpoint + this.apiVersion + this.rechargeData;
    return await this.processHttpsPostRequest(payload);
  }

  /**
   * Query transaction
   * @param agentReference Agent reference for the transaction
   */
  public async queryTransactionReference (agentReference: string) {
    this.updateReference();
    this.url = this.rootEndpoint + this.apiVersion + this.queryTransaction + agentReference;
    return await this.processHttpsGetRequest();
  }

  /**
   * Get list of available data bundle options
   */
  public async getDataBundleOptions () {
    this.url = this.rootEndpoint + this.apiVersion + this.getDataBundle;
    return await this.processHttpsGetRequest();
  }

  // private methods

  /**
   * Process Get Request With Axios
   * @private
   */
  private async processHttpsGetRequest () {
    this.updateReference();
    try {
      const response = await axios.get(this.url,{
        headers: this.headers,
        timeout: 45000,
        timeoutErrorMessage: 'Request timed out (45 seconds). Try again!'
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
  private async processHttpsPostRequest (data: object) {
    this.updateReference();
    try {
      const response = await axios.post(this.url, data, {
        headers: this.headers,
        timeout: 45000,
        timeoutErrorMessage: 'Request timed out (45 seconds). Try again!'
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
   * @param length Length of reference to be generated
   * @returns Unique merchant reference
   * @private
   */
  private static generateReference(): string {
    const randomUuid: string = uuid.v4();
    const result: string = randomUuid.split('-').join("");
    return result;
  }

  /**
   * Auto update merchant reference
   * @private
   */
  private updateReference () {
      this.headers["x-agent-reference"] = HotRecharge.generateReference();
  }
}
