import { isBrowser } from '../functions/is-browser';

if (isBrowser()) {
  window.parent?.postMessage(
    {
      type: 'builder.sdkInfo',
      data: {
        // TODO: compile these in
        type: process.env.SDK_TYPE,
        version: process.env.SDK_VERSION,
      },
    },
    '*'
  );

  window.addEventListener('message', ({ data }) => {
    if (data) {
      switch (data.type) {
        case 'builder.evaluate': {
          const text = data.data.text;
          const args = data.data.arguments || [];
          const id = data.data.id;
          // tslint:disable-next-line:no-function-constructor-with-string-args
          const fn = new Function(text);
          let result: any;
          let error: Error | null = null;
          try {
            result = fn.apply(null, args);
          } catch (err) {
            error = err;
          }

          if (error) {
            window.parent?.postMessage(
              {
                type: 'builder.evaluateError',
                data: { id, error: error.message },
              },
              '*'
            );
          } else {
            if (result && typeof result.then === 'function') {
              (result as Promise<any>)
                .then(finalResult => {
                  window.parent?.postMessage(
                    {
                      type: 'builder.evaluateResult',
                      data: { id, result: finalResult },
                    },
                    '*'
                  );
                })
                .catch(console.error);
            } else {
              window.parent?.postMessage(
                {
                  type: 'builder.evaluateResult',
                  data: { result, id },
                },
                '*'
              );
            }
          }
          break;
        }
      }
    }
  });
}
