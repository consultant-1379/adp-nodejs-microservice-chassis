import * as fs from 'fs';
import yaml from 'js-yaml';

// arguments
const cliArgs = process.argv.slice(2);
const dependencyFile = cliArgs[0];
const outDependencyFileUnRegistered = cliArgs[1];
const dependencies = yaml.load(fs.readFileSync(dependencyFile, 'utf8'));

console.log(`
===============================================================================
Processing dependency file: ${dependencyFile}
`);

const isLinked = (dependency) => dependency.linking !== 'MANDATORY_FOR_MIMER';
const isUnLinked = (dependency) => dependency.linking === 'MANDATORY_FOR_MIMER';

const numberOfUnlinked = dependencies.dependencies.filter(isUnLinked).length;

dependencies.dependencies = dependencies.dependencies.filter(isLinked);
fs.writeFileSync(
  `${outDependencyFileUnRegistered}`,
  yaml.dump(dependencies, { noArrayIndent: true, lineWidth: 1000 }),
  'utf8',
);
console.log(`
Input file ${dependencyFile} is filtered to linked components ${outDependencyFileUnRegistered}
The number of removed, possible phantom 3pps: ${numberOfUnlinked}
===============================================================================
`);
