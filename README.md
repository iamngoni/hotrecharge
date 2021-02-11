
# NODEJS Library for  [BulkSmsWeb Zimbabwe](https://bulksmsweb.com)

## Sign up and sign in to [BulkSmsWeb Portal](https://portal.bulksmsweb.com) to get your web service token

> You cannot make successful requests without the web service name and web service token / key

## Prerequisites

This library has a set of prerequisites that must be met for it to work

1.  Node.js installed
2.  NPM (node's package manager, used to install the node library)

## Installation

Install the library using NPM

```sh
$ npm install --save bulksmszw
```

## Usage example

### Importing library

```javascript
const BulkSmsZw = require("bulksmszw").BulkSmsZw;
```

Create an instance of the BulkSmsZw class and setting the bulkSmsWebKey and bulkSmsWebName

```javascript
const api = new BulkSmsZw({
  bulkSmsWebKey: 'key',
  bulkSmsWebName: 'name'
});
```

Try sending a message or messages

```javascript
api.send({
  message: 'Hi Ngonidzashe',
  credits: false,
  recipients: ['0777777777']
}).then(function (response) {
  console.log(response);
});
```

Or this way (using async/await functions)

```javascript
let response = await api.send({
  message: 'Hi Ngonidzashe',
  credits: false,
  recipients: ['0777777777']
});
```

Api Response
* For Authentication Failure

```javascript
ApiResponse {
  statusresponse: 'api_error',
  api_response: ApiError {
    status: 'ERR',
    error: '100',
    error_string: 'authentication failed',
    timestamp: 1609336803
  },
  message: 'authentication failed'
}
```

* For Success

```javascript
ApiResponse {
  statusresponse: 'success',
  api_response: ApiSuccess {
    data: {
      status: 'OK',
      error: '0',
      smslog_id: '00000000',
      queue: '03cc1e906ff9d762c9bd6ba92b9a1494',
      to: '263777777777'
    },
    error_string: null,
    timestamp: 1609513652
  },
  message: 'success'
}
```
