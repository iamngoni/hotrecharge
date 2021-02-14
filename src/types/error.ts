export default class GeneralError {
  /** Error message */
  public error: string;

  /**
   * @constructor
   * @param error Error message
   */
  constructor (error: string) {
    this.error = error;
  }
}