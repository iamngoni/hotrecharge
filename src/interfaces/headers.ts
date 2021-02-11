import Email from "./email";

export default interface Headers {
  'x-access-code': string,
  'x-access-password': string,
  'x-agent-reference': string,
  'content-type': string,
  'cache-control': string
}