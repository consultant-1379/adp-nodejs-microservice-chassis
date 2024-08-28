import * as path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const commandArgs = process.argv.slice(2);
const shouldValidate = commandArgs.includes('--validate-schema-examples');
const shouldGenerate = commandArgs.includes('--generate');

const SCHEMAS = [
  {
    schemaPath: path.join(__dirname, '..', 'ui-internal/specs/ui.internal.spec.yaml'),
    outputFile: path.join(__dirname, '..', 'markdown/ui.internal.md'),
  },
  {
    schemaPath: path.join(__dirname, '..', 'ui-backend/specs/ui.backend.spec.yaml'),
    outputFile: path.join(__dirname, '..', 'markdown/ui.backend.md'),
  },
];

const validateExamples = ({ schemaPath }) => {
  const command = `${path.join(
    'node_modules',
    '.bin',
    'openapi-examples-validator',
  )} ${schemaPath}`;

  console.log(`Executing command: ${command}`);

  execSync(command, { stdio: 'inherit' });
};

const generateMarkdown = ({ schemaPath, outputFile }) => {
  const command =
    `${path.join('node_modules', '.bin', 'widdershins')}` +
    ` --search false` +
    ` --resolve true` +
    ` --theme 'darkula'` +
    ` --code true` +
    ` --language_tabs 'javascript:JavaScript'` +
    ` -o ${outputFile}` +
    ` ${schemaPath}`;

  console.log(`Executing command: ${command}`);

  execSync(command, { stdio: 'inherit' });
};

SCHEMAS.forEach((schemaData) => {
  if (shouldValidate) {
    validateExamples(schemaData);
  }
  if (shouldGenerate) {
    generateMarkdown(schemaData);
  }
});
