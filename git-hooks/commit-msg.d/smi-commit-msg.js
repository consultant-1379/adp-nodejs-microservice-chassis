#!/usr/bin/env node

import * as fs from 'fs';

const MSG_PATTERNS = [
  '(?:Requirement:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?',
  '(?:Troublereport:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?',
  '(?:Deprecation:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?',
  '(?:Vulnerability:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?',
  '(?:Abrupt_NBC:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?',
  '(?:NUC:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?',
  '(?:Refactor:\\s*)((EEAEPP|ADPRS)-[0-9]+).*? ',
  '(?:Requirement:\\s*)(no-jira).*?',
];

const PATTERN = new RegExp(MSG_PATTERNS.join('|'), 'i');

function checkCommitMsg() {
  let message = '';
  if (process.argv[2] === '.git/COMMIT_EDITMSG') {
    message = fs.readFileSync(process.argv[2], 'utf8').trim();
  } else {
    [, , message] = process.argv;
  }
  if (!PATTERN.test(message)) {
    console.log('Commit message does not match any patterns');
    console.log('supported patterns:');
    console.log('(?:Requirement:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?');
    console.log('(?:Troublereport:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?');
    console.log('(?:Deprecation:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?');
    console.log('(?:Vulnerability:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?');
    console.log('(?:Abrupt_NBC:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?');
    console.log('(?:NUC:\\s*)((EEAEPP|ADPRS)-[0-9]+).*?');
    console.log('(?:Refactor:\\s*)((EEAEPP|ADPRS)-[0-9]+).*? ');
    console.log('(?:Requirement:\\s*)(no-jira).*?');
    process.exit(1);
  } else {
    process.exit(0);
  }
}

checkCommitMsg();
