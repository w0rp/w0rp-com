#!/usr/bin/env bash

# A script for running all tests for JavaScript code.

# Check JS code with ESLint
node_modules/.bin/eslint .

# Check for type errors with TypeScript
node_modules/.bin/tsc --noEmit
