import webTestRunner from '@snowpack/web-test-runner-plugin';
import { defaultReporter } from '@web/test-runner';
import { junitReporter } from '@web/test-runner-junit-reporter';
import reporter from './test/test-utils/reporter.js';

process.env.NODE_ENV = 'test';

export default {
  coverage: true,
  coverageConfig: {
    exclude: [
      'libs/**',
      '**/node_modules/**/*',
      '**/web_modules/**/*',
      '**/npm/**/*',
    ],
  },
  nodeResolve: true,
  plugins: [webTestRunner()],
  files: 'test/**/*.test.js',
  reporters: [
    defaultReporter({ reportTestResults: true, reportTestProgress: true }),
    junitReporter({
      outputPath: './coverage/junit/test-results.xml',
      reportLogs: true,
    }),
    reporter(),
  ],
};
