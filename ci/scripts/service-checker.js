#!/usr/bin/env node
/* eslint-disable no-await-in-loop */

/**

This script checks if the Chassis microservice's backend is ready.
The microservice's API is called on the given Ingress hostname, path and protocol, and compared with the
readiness status. Checks MAX_TRIES times, and waits WAIT_INTERVAL seconds in between.

Usage:
  ./service-checker.js <Ingress_hostname> <ingress_path> <ingress_protocol>

*/

import fetch from 'node-fetch';

const CHASSIS_TICKETS_PATH = 'api/tickets';
const CHASSIS_STATUS_PATH = 'status';
const MAX_TRIES = 20;
const WAIT_INTERVAL = 10;

const cliArgs = process.argv.slice(2);
const INGRESS_HOST = cliArgs[0];
const INGRESS_PATH = cliArgs[1];
const INGRESS_PROTOCOL = cliArgs[2];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const wait = (s) =>
  new Promise((resolve) => {
    setTimeout(resolve, s * 1000);
  });

async function fetchEndpoints() {
  const ticketsEndpoint = `${INGRESS_PROTOCOL}://${INGRESS_HOST}/${INGRESS_PATH}/${CHASSIS_TICKETS_PATH}`;
  const statusEndpoint = `${INGRESS_PROTOCOL}://${INGRESS_HOST}/${INGRESS_PATH}/${CHASSIS_STATUS_PATH}`;

  const getResponseStatus = async (url, defaultValue) => {
    try {
      const res = await fetch(url);
      return res.status;
    } catch (e) {
      console.log('Error', e);
      console.log('Error message', e.message);
      return defaultValue;
    }
  };

  return {
    tickets: await getResponseStatus(ticketsEndpoint, 404),
    status: await getResponseStatus(statusEndpoint, 404),
  };
}

async function checkDeployment() {
  const { tickets, status } = await fetchEndpoints();
  console.log(`Tickets ${tickets} Status ${status}`);
  return tickets === 200 && status === 200;
}

let tries = 0;
let deploymentReady = false;

while (tries < MAX_TRIES) {
  deploymentReady = await checkDeployment();
  console.log(`#${tries}. Fetching data from REST API...`);

  if (deploymentReady) {
    break;
  }

  tries += 1;
  console.log(
    `Discovery still in progress, sleeping for ${WAIT_INTERVAL} seconds. Elapsed time: ${
      tries * WAIT_INTERVAL
    }s.`,
  );
  await wait(WAIT_INTERVAL);
}

if (deploymentReady) {
  console.log('Deployment ready, tickets are available!');
  process.exit(0);
} else {
  console.log('Deployment did not succeed in time!');
  process.exit(1);
}
