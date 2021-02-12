import axios from "axios";
import Credentials from "../interfaces/credentials";
import Headers from "../interfaces/headers";
import AuthorizationError from '../types/unauthorized';
import GeneralError from '../types/error';

export default class HotRecharge {
  private rootEndpoint: string = 'https://ssl.hot.co.zw';
  private apiVersion: string = '/api/v1/';
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
  /** Headers to be passed to the https request */
  private headers: Headers = {"x-access-code": "", "x-access-password": "", "x-agent-reference": "", "content-type": "null", "cache-control": "null"};
  /** This is the url that will be accessed by the service */
  private url: string = '';
  private useRandomReference: Boolean = true;

  /**
   * Hot Recharge Web Service Library (Node.js)
   * Ngonidzashe Mangudya
   * 
   * @constructor
   * @param agentDetails [Credentials]
   */
  constructor (agentDetails: Credentials, useRandomReference: boolean = true) {
    if (agentDetails.reference && agentDetails.reference.length > 50) {
      throw new Error('Agent Reference Must Not Exceed 50 Characters');
    }
    this.useRandomReference = useRandomReference;
    this.headers["x-access-code"] =  agentDetails.email;
    this.headers["x-access-password"] = agentDetails.password;
    this.headers["x-agent-reference"] = useRandomReference ? this.generateReference(5) : agentDetails.reference;
    this.headers["content-type"] = this.contentType;
    this.headers["cache-control"] = 'no-cache';
  }

  /**
   * Update the merchant reference
   * @param reference New merchant reference
   */
  updateReference (reference: string) {
    this.headers["x-agent-reference"] = reference;
  }

  /**
   * Get agent wallet balance 
   */
  async getAgentWalletBalance () {
    // set url to point to wallet balance endpoint
    this.url = this.root_endpoint + this.apiVersion + this.walletBalance;
    // process the request with axios
    return await this.processHttpsGetRequest();
  }

  /**
   * Get end user balance
   * @param mobile_number End user mobile number
   */
  async getEndUserBalance (mobile_number: string) {
    this.url = this.root_endpoint + this.apiVersion + this.endUserBalance + mobile_number;
    return await this.processHttpsGetRequest();
  }

  /**
   * 
   * @param amount Amount to recharge
   * @param mobile_number Mobile number to recharge
   * @param brandId Optional
   * @param message Optional: Customer sms to send
   */
  async pinlessRecharge (amount: Number, mobile_number: string, brandId: string = null, message: Object = null) {
    let payload: Object = {
      "amount": amount,
      "targetMobile": mobile_number
    };
    
    //TODO: Verify on brandId and message with Donald

    this.url = this.root_endpoint + this.apiVersion + this.rechargePinless;
    return await this.processHttpsPostRequest(payload);
  }

  /**
   * 
   * @param product_code Bundle product code e.g. DWB15 for weekly data bundle - ECONET
   * @param mobile_number Mobile number to recharge
   * @param message Optional: customer sms to send
   */
  async dataBundleRecharge (product_code: string, mobile_number: string, message: Object = null) {
    let payload = {
      "productcode": product_code,
      "targetMobile": mobile_number
    };

    this.url = this.root_endpoint + this.apiVersion + this.rechargeData;
    return await this.processHttpsPostRequest(payload);
  }

  async getDataBundlesBalance () {
    this.url = this.root_endpoint + this.apiVersion + this.getDataBundle;
    return await this.processHttpsGetRequest();
  }

  // private methods

  /**
 * Process the GET request
 */
  private async processHttpsGetRequest () {
    // check if user wants reference to be updated automatically
    if (this.useRandomReference) {
      this.autoUpdateReference();
    }
    try {
      let response = await axios.get(this.url,{
        headers: this.headers,
        timeout: 45000,
        timeoutErrorMessage: 'Request timed out (45 seconds). Try again!'
      });
      return response.data;
    } catch (error) {
      // Check if response is a request authorization error
      if (error.response.status === 401) {
        return new AuthorizationError(error.response.data.Message);
      }

      return new GeneralError(error.response.data);
    }
  }

  /**
   * Process the POST request
   * @param data Data to post with the request
   */
  private async processHttpsPostRequest (data: Object) {
    // check if user wants reference to be updated automatically
    if (this.useRandomReference) {
      this.autoUpdateReference();
    }
    try {
      let response = await axios.post(this.url, data, {
        headers: this.headers,
        timeout: 45000,
        timeoutErrorMessage: 'Request timed out (45 seconds). Try again!'
      });
      return response.data;
    } catch (error) {
      // Check if response is a request authorization error
      if (error.response.status === 401) {
        return new AuthorizationError(error.response.data.Message);
      }
  
      return new GeneralError(error.response.data);
    }
  }

  /**
   * 
   * @param length Length of the random string to be generated
   * @returns Returns random string of specified length
   */
  private generateReference(length: Number): string {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      // result += Math.floor(Math.random() * 10);
    }
    return result;
  }

  /**
   * Auto update the merchant reference
   */
  private autoUpdateReference () {
    this.headers["x-agent-reference"] = this.generateReference(5);
  }
}