export async function api_request(method, endpoint, json = {}, delay = 0) {

  let csrf_token = Math.random().toString(16).substr(2, 10);
  let api_url = "/api";
  document.cookie = 'acodo_csrf_token = ' + csrf_token;

  let request_object = {
    credentials: 'include',
    headers: {
      'X-CSRF': csrf_token
    }
  };

  if (method == "POST") {
    request_object['method'] = 'POST';
    request_object['body'] = JSON.stringify(json);
  }

  var resp = await fetch(api_url + endpoint, request_object);

  if (delay > 0) {
    await (new Promise(function(resolve, reject) {
      setInterval(() => {
        resolve();
      }, delay)
    }));
  }

  return await resp.json();

}
