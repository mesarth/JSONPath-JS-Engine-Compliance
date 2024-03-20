import cts from '../jsonpath-compliance-test-suite/cts.json';

import { isEqual } from 'lodash'
import { EngineRunner, engines } from './engines/engines';
const fs = require('fs');

const OUTPUT_FILE_NAME = 'compliance.json';
const TEST_INVALID_SELECTORS = process.argv?.includes('--test-invalid');
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

type TestCase = {
  document: any,
  selector: string,
  name: string,
  invalid_selector?: boolean,
  result?: any,
  results?: any[]
}

const resultEqualsTestCase = (result: any, test: TestCase): boolean => {
  if (test.result) {
    return isEqual(result, test.result);
  }
  else if (test.results) {
    for (const r of test.results) {
      if (isEqual(r, result)) {
        return true;
      }
    }
  }
  return false;
}

const runTestOnEngine = (engine: EngineRunner, test: TestCase): boolean => {
  try {
    const output = engine.query(test.document, test.selector);
    if (DEBUG && !resultEqualsTestCase(output, test)) {
      console.log(`-- ${test.name} --`)
      console.log('standard');
      console.log(test.result)
      console.log(`Not correct: ${engine.name}`)
      console.log(output);
    }
    return resultEqualsTestCase(output, test);
  }
  catch (e) {
    if (DEBUG) console.log(e);
    return false;
  }
}

const runTests = (): TestResult[] => {
  const results: TestResult[] = [];
  for (const test of cts.tests as TestCase[]) {
    if (!TEST_INVALID_SELECTORS && test.invalid_selector === true) { continue; }

    const result: TestResult = { testName: test.name, engineCompliance: [] };
    for (const engine of engines) {
      const testResult = runTestOnEngine(engine, test);
      result.engineCompliance.push(testResult);
    }
    if (DEBUG) console.log();
    results.push(result);
  }
  return results;
}

const testTypes = (): string[] => {
  const testTypes = cts.tests.reduce<string[]>((testTypes, test) => {
    const testType = test.name.split(',')[0];
    if (!testTypes.includes(testType)) {
      testTypes.push(testType);
    }
    return testTypes
  }, [])
  testTypes.unshift(null); //add "no testType" special case
  return testTypes;
}

const computeSummary = (results: TestResult[]): SummaryEntry[] => {
  const summary: SummaryEntry[] = [];
  for (const testType of testTypes()) {
    const filteredResults = results.filter((result) => result.testName.startsWith(testType) || testType === null);
    const nrOfTests = filteredResults.length;
    const summaryEntry: SummaryEntry = { testType, percentages: [] };
    for (const engineIndex of engines.keys()) {
      const nrOfCompliantTests = filteredResults.reduce<number>((prev, cur) => cur.engineCompliance[engineIndex] ? prev + 1 : prev, 0);
      summaryEntry.percentages.push(nrOfCompliantTests / nrOfTests);
    }
    summary.push(summaryEntry);
  }
  return summary;
}


const main = () => {
  const results = runTests();
  const summary = computeSummary(results);
  const compliance: Compliance = { engines, results, summary };

  fs.writeFileSync(
    OUTPUT_FILE_NAME,
    JSON.stringify(compliance)
  );
  console.log(compliance.summary);
}

main();