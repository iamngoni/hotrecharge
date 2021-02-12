export default class GeneralError {
  /** Error message */
  public message: string;

  /**
   * @constructor
   * @param message Error message
   */
  constructor (message: string) {
    this.message = message;
  }
}