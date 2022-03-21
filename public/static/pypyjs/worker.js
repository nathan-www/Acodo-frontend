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

    test_feedback = {};
    e.data.tests.forEach((test) => {
      test_feedback[test.test_id] = {
        passed: false,
        error: false,
        test_id: test.test_id
      };
    });

    (async () => {

        await pypyjs.exec('globals().clear()');

        pypyjs.exec(e.data.code).then(() => { //Execute user's code

            postMessage({
              type: "consoleEnable"
            });

            pypyjs.exec(e.data.test_code).then(() => { //Execute the test code initialiser

                (async () => {

                    let test_error = false;

                    for (var i = 0; i < e.data.tests.length; i++) { //Loop through each test function and run it

                      let test = e.data.tests[i];

                      if (test_error) {
                        //Do not repeat further tests if previous test threw an error
                        test_feedback[test.test_id].error = true;

                      } else {

                        try {
                          res = await pypyjs.eval(test.func + "()");
                          test_feedback[test.test_id].passed = (res == true);
                        } catch (err) {

                          test_feedback[test.test_id].error = true; //Test function threw an error
                          test_error = true;

                          postMessage({
                            type: "consoleError",
                            error: err.trace
                          });

                        }
                    }
                  }

                  postMessage({ //Return test results
                    type: "test_feedback",
                    feedback: test_feedback,
                    error: false
                  });


                })();

            }).catch((err) => { //Initial execution of test code produced an error

            postMessage({
              type: "test_feedback",
              feedback: test_feedback,
              error: true
            });

            postMessage({
              type: "consoleError",
              error: err.trace
            });

          });

        }).catch((err) => { //Execution of user's code produced an error


        postMessage({
          type: "test_feedback",
          feedback: test_feedback,
          error: true
        });

        postMessage({
          type: "consoleError",
          error: err.trace
        });

        postMessage({
          type: "consoleEnable"
        });

      });

    })();

} else if (e.data.type == "input") {
  inputText = e.data.text;
}


}
