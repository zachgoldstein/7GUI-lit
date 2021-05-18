// /**
//  * @license
//  * Copyright 2018 Google LLC
//  * SPDX-License-Identifier: BSD-3-Clause
//  */

// import summary from 'rollup-plugin-summary';
// import {terser} from 'rollup-plugin-terser';
// import resolve from '@rollup/plugin-node-resolve';
// import replace from '@rollup/plugin-replace';

// export default {
//   input: 'my-element.js',
//   output: {
//     file: 'my-element.bundled.js',
//     format: 'esm',
//   },
//   onwarn(warning) {
//     if (warning.code !== 'THIS_IS_UNDEFINED') {
//       console.error(`(!) ${warning.message}`);
//     }
//   },
//   plugins: [
//     replace({'Reflect.decorate': 'undefined'}),
//     resolve(),
//     terser({
//       ecma: 2017,
//       module: true,
//       warnings: true,
//       mangle: {
//         properties: {
//           regex: /^__/,
//         },
//       },
//     }),
//     summary(),
//   ],
// };


// Import rollup plugins
import html from '@web/rollup-plugin-html';
import resolve from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import summary from 'rollup-plugin-summary';

export default {
  plugins: [
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    html({
      input: './dev/index.html',
    }),
    // Resolve bare module specifiers to relative paths
    resolve(),
    // Minify HTML template literals
    minifyHTML(),
    // Minify JS
    terser({
      ecma: 2020,
      module: true,
      warnings: true,
    }),
    // Print bundle summary
    summary(),
  ],
  output: {
    dir: 'dist',
  },
  preserveEntrySignatures: 'strict',
};