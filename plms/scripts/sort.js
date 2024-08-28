import * as fs from 'fs';
import yaml from 'js-yaml';

// arguments
const cliArgs = process.argv.slice(2);
const dependencyFile = cliArgs[0];
const dependencies = yaml.load(fs.readFileSync(dependencyFile, 'utf8'));

console.log(`Processing dependency file: ${dependencyFile}`);

// map name
dependencies.dependencies.sort((dep1, dep2) => dep1.ID.localeCompare(dep2.ID));

fs.writeFileSync(
  `${dependencyFile}`,
  yaml.dump(dependencies, { noArrayIndent: true, lineWidth: 1000 }),
  'utf8',
);
console.log(`Input file ${dependencyFile} is processed, dependencies are sorted`);
