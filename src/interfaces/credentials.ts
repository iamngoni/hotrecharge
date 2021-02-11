import Email from "./email";

export default interface Credentials {
  email: string,
  password: string,
  reference?: string
}