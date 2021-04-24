import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import sourceMaps from 'rollup-plugin-sourcemaps'
import pkg from './package.json'

export default {
  input: './src/index.ts',

  // Specify here external modules which you don't want to include in your bundle (for instance: 'lodash', 'moment' etc.)
  // https://rollupjs.org/guide/en#external-e-external
  external: [],
  watch: {
    include: 'src/**'
  },
  plugins: [
    // Allows node_modules resolution
    // https://github.com/rollup/rollup-plugin-node-resolve#usage
    resolve(),

    // Allow bundling cjs modules. Rollup doesn't understand cjs
    commonjs({ extensions: ['.js', '.ts'] }),

    // Compile TypeScript/JavaScript files
    babel({ include: ['src/**/*'], runtimeHelpers: true }),

    // Resolve source maps to the original source
    sourceMaps()
  ],

  output: [
    { file: pkg.main, name: 'HappyHttp', format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true }
  ]
}
