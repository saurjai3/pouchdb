'use strict';

var nodeResolve = require('rollup-plugin-node-resolve');
var replace = require('rollup-plugin-replace');
var inject = require('rollup-plugin-inject');
var removeGuardedConsole = require('./rollupPluginRemoveGuardedConsole');

function rollupPlugins(nodeResolveConfig, liteMode) {
  return [
    nodeResolve(nodeResolveConfig),
    replace({
      // we have switches for coverage; don't ship this to consumers
      'process.env.COVERAGE': JSON.stringify(!!process.env.COVERAGE),
      // test for fetch vs xhr
      'process.env.FETCH': JSON.stringify(!!process.env.FETCH)
    }),
    !liteMode && inject({
      exclude: [
        '**/pouchdb-utils/src/assign.js',
        '**/pouchdb-promise/src/index.js',
        '**/pouchdb-collections/src/**'
      ],
      Map: ['pouchdb-collections', 'Map'],
      Set: ['pouchdb-collections', 'Set'],
      'Object.assign': ['pouchdb-utils', 'assign'],
      Promise: 'pouchdb-promise'
    }),
    liteMode && removeGuardedConsole()
  ];
}

module.exports = rollupPlugins;