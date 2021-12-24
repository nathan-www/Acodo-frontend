export async function api_request(method, endpoint, json = {}, delay = 0) {

  let api_url = "http://localhost:8888";

  if (method == "POST") {
    var resp = await fetch(api_url + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      credentials: 'include',
      body: JSON.stringify(json)
    });
  } else {
    var resp = await fetch(api_url + endpoint, {
        credentials: 'include'
    });
  }

  if (delay > 0) {
    await (new Promise(function(resolve, reject) {
      setInterval(() => {
        resolve();
      }, delay)
    }));
  }

  return await resp.json();

}
