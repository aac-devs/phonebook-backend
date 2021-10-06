import 'colors';

export default (tokens, req, res) => {
  let s = '{';
  if (req.body.name) {
    for (let prop in req.body) {
      s += ` ${prop.brightRed}: ${req.body[prop].brightGreen},`;
    }
    s += ' }';
  } else {
    s = '-o-'.brightMagenta;
  }

  let method = tokens.method(req, res);
  switch (method) {
    case 'GET':
      method = method.green.bold;
      break;
    case 'POST':
      method = method.brightBlue.bold;
      break;
    case 'PUT':
      method = method.brightMagenta.bold;
      break;
    case 'DELETE':
      method = method.red.bold;
      break;
    case 'PATCH':
      method = method.brightCyan.bold;
      break;
  }

  let status = +tokens.status(req, res);
  if (status >= 400) status = status.toString().red.bold;
  else status = status.toString().green.bold;

  return [
    `$- Method: ${method} -`,
    `Url: ${tokens.url(req, res).yellow} -`,
    `Status: ${status} -`,
    `Length: ${tokens.res(req, res, 'content-length')?.brightMagenta} -`,
    `Resp-Time: ${tokens['response-time'](req, res).brightBlue} ms -`,
    `Body: ${s}`,
  ].join(' ');
};
