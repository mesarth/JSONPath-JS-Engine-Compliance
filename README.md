# JSONPath JavaScript Engine Compliance

This project evaluates how well different JavaScript JSONPath engines comply with the [JSONPath standard (RFC 9535)](https://datatracker.ietf.org/doc/rfc9535/). The compliance tests are provided by [https://github.com/jsonpath-standard/jsonpath-compliance-test-suite](https://github.com/jsonpath-standard/jsonpath-compliance-test-suite). 


The project is inspired by [cburgmer's JSONPath comparison](https://cburgmer.github.io/json-path-comparison/) which uses consensus among the engines instead of compliance with the standard.

## Results

The results are published at [https://mesarth.github.io/JSONPath-JS-Engine-Compliance/](https://mesarth.github.io/JSONPath-JS-Engine-Compliance/)

## Run comparison locally

Install Node.js

### Clone Repo with Submodules (!)

```bash
git clone --recurse-submodules https://github.com/mesarth/JSONPath-JS-Engine-Compliance.git
```

### Install Dependencies

```bash
npm install
```

### Generate compliance.json file

```bash
npm run build
```

or with debug output

```bash
npm run build -- --debug
```

and/or test queries with invalid selectors (results are not accurate due to the different approaches to error handling between engines)

```bash
npm run build -- --test-invalid
```

### Run jekyll site locally

Install [Jekyll](https://jekyllrb.com/docs/installation/)

```bash
npm run serve
```
