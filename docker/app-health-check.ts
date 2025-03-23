#!/usr/bin/env bun
const urls: string[] = process.argv.slice(2);

if (urls.length === 0) {
  console.error('No URLs provided');
  process.exit(1);
}

Promise.all(
  urls.map((url) => fetch(url).then((response) => ({ url, response })))
)
  .then((results) => {
    results.forEach(({ url, response }) => {
      console.log(`${url}: ${response.status} ${response.statusText}`);
    });
    const allOk = results.every(({ response }) => response.ok);
    process.exit(allOk ? 0 : 1);
  })
  .catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
