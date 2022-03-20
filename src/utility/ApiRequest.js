export async function api_request(method, endpoint, json = {}, delay = 0) {

  let existing_cookie = document.cookie.match(/acodo_csrf_token=(.*?)(;|$)/);

  if (existing_cookie !== null) {
    var csrf_token = existing_cookie[1];
  } else {
    var csrf_token = Math.random().toString(16).substr(2, 10) + Math.random().toString(16).substr(2, 10);
    let d = new Date();
    d.setTime(d.getTime() + (3 * 60 * 1000));
    document.cookie = "acodo_csrf_token="+csrf_token+";expires="+d.toUTCString()+";path=/";
  }

  let api_url = "/api";

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
