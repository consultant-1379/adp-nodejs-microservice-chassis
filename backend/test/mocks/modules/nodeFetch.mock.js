export default () =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status: 200, body: {} }),
  });
