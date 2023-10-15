import cts from '../jsonpath-compliance-test-suite/cts.json';

import { isEqual } from 'lodash'
import { EngineRunner, engines } from './engines/engines';
const fs = require('fs');

const OUTPUT_FILE_NAME = 'compliance.json';
const IGNORE_INVALID_SELECTORS = process.argv?.includes('--ignore-invalid');
const DEBUG = process.argv?.includes('--debug');

type TestResult = {
  testName: string;
  engineCompliance: Array<boolean>;
};

type SummaryEntry = {
  testType: string | null;
  percentages: Array<number>;
};

type Compliance = {
  engines: Omit<EngineRunner, 'query'>[];
  results: TestResult[];
  summary: SummaryEntry[];
}

const compliance: Compliance = {
  engines: engines,
  results: [],
  summary: []
}

for (const test of cts.tests) {
  if (IGNORE_INVALID_SELECTORS && test.invalid_selector === true) { continue; }

  const result: TestResult = { testName: test.name, engineCompliance: [] };
  for (const engine of engines) {
    let testResult = false;
    try {
      const output = engine.query(test.document, test.selector);
      if (DEBUG && !isEqual(test.result, output)) {
        console.log(`-- ${test.name} --`)
        console.log('standard');
        console.log(test.result)
        console.log(`Not correct: ${engine.name}`)
        console.log(output);
      }
      testResult = isEqual(test.result, output)
    }
    catch (e) {
      if (DEBUG) console.log(e);
    }
    result.engineCompliance.push(testResult);
  }
  if (DEBUG) console.log();
  compliance.results.push(result);
}


const testTypes = cts.tests.reduce<string[]>((testTypes, test) => {
  const testType = test.name.split(',')[0];
  if (!testTypes.includes(testType)) {
    testTypes.push(testType);
  }
  return testTypes
}, [])
testTypes.unshift(null); //add "no testType" special case

for (const testType of testTypes) {
  const filteredResults = compliance.results.filter((result) => result.testName.startsWith(testType) || testType === null);
  const nrOfTests = filteredResults.length;
  const summary: SummaryEntry = { testType, percentages: [] };
  for (const engineIndex of engines.keys()) {
    const nrOfCompliantTests = filteredResults.reduce<number>((prev, cur) => cur.engineCompliance[engineIndex] ? prev + 1 : prev, 0);
    summary.percentages.push(nrOfCompliantTests / nrOfTests);
  }
  compliance.summary.push(summary);
}

fs.writeFileSync(
  OUTPUT_FILE_NAME,
  JSON.stringify(compliance)
);

console.log(compliance.summary);