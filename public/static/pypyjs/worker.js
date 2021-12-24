importScripts('./FunctionPromise.js');
importScripts('./Promise.min.js');
importScripts('./pypyjs.js');

var inputText = "";

var consolePromResolve;

pypyjs.repl(function(ps1) {
  postMessage({
    type: "consoleEnable"
  });
  return new Promise(function(resolve, reject) {
    consolePromResolve = resolve;
  });
});

pypyjs.stdout = data => postMessage({
  type: "consoleOutput",
  data: data
});
pypyjs.stderr = data => postMessage({
  type: "consoleError",
  error: data
});

onmessage = function(e) {

  if (e.data.type == "consoleInput") {
    consolePromResolve(e.data.code);
  } else if (e.data.type == "execute") {

    pypyjs.exec(e.data.code).then(() => {
      postMessage({
        type: "consoleEnable"
      });
    }).catch((err) => {
      postMessage({
        type: "consoleError",
        error: err.trace
      });
      postMessage({
        type: "consoleEnable"
      });
    });

  } else if (e.data.type == "input") {
    inputText = e.data.text;
  }


}
