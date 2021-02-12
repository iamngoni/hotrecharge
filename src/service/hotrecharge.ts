import axios from "axios";
import Credentials from "../interfaces/credentials";
import Headers from "../interfaces/headers";
import AuthorizationError from '../types/unauthorized';

export default class HotRecharge {
  private root_endpoint: string = 'https://ssl.hot.co.zw';
  private api_version: string = '/api/v1/';
  private content_type: string = 'application/json';

  // Endpoints
  /** The endpoint for airtime recharge */
  private recharge_pinless = 'agents/recharge-pinless';
  /** The endpoint for data recharge */
  private recharge_data = 'agents/recharge-data';
  /** The endpoint checking agent wallet balance */
  private wallet_balance = 'agents/wallet-balance';
  /** The endpoint for getting agent data balance */
  private get_data_bundle = 'agents/get-data-bundles';
  /** The endpoint for getting end user balance */
  private end_user_balance = 'agents/enduser-balance?targetmobile=';
  /** Headers to be passed to the https request */
  private headers: Headers = {"x-access-code": null, "x-access-password": null, "x-agent-reference": null, "content-type": null, "cache-control": null};
  /** This is the url that will be accessed by the service */
  private url: string = '';

  /**
   * Hot Recharge Web Service Library (Node.js)
   * Ngonidzashe Mangudya
   * 
   * @constructor
   * @param agent_details [Credentials]
   */
  constructor (agent_details: Credentials, use_random_reference: Boolean = true) {
    if (agent_details.reference && agent_details.reference.length > 50) {
      throw new Error('Agent Reference Must Not Exceed 50 Characters');
    }
    this.headers["x-access-code"] =  agent_details.email;
    this.headers["x-access-password"] = agent_details.password;
    this.headers["x-agent-reference"] = use_random_reference ? this.generateReference(5) : agent_details.reference;
    this.headers["content-type"] = this.content_type;
    this.headers['cache-control'] = 'no-cache';
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
    this.url = this.root_endpoint + this.api_version + this.wallet_balance;
    // process the request with axios
    return await this.processHttpsGetRequest();
  }

  /**
   * Get end user balance
   * @param mobile_number End user mobile number
   */
  async getEndUserBalance (mobile_number: string) {
    this.url = this.root_endpoint + this.api_version + this.end_user_balance + mobile_number;
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

    this.url = this.root_endpoint + this.api_version + this.recharge_pinless;
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

    this.url = this.root_endpoint + this.api_version + this.recharge_data;
    return await this.processHttpsPostRequest(payload);
  }

  async getDataBundlesBalance () {
    this.url = this.root_endpoint + this.api_version + this.get_data_bundle;
    return await this.processHttpsGetRequest();
  }

  // private methods

  /**
 * Process the GET request
 */
  private async processHttpsGetRequest () {
    this.autoUpdateReference();
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

      return error.response.data;
    }
  }

  /**
   * Process the POST request
   * @param data Data to post with the request
   */
  private async processHttpsPostRequest (data: Object) {
    this.autoUpdateReference();
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
  
      return new GeneralError();
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
      // result += characters.charAt(Math.floor(Math.random() * charactersLength));
      result += Math.floor(Math.random() * 10);
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