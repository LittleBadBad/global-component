import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import filesize from 'rollup-plugin-filesize';
import autoprefixer from 'autoprefixer';

import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';

const INPUT_FILE_PATH = 'src/index.tsx';
const OUTPUT_NAME = 'Example';

const GLOBALS = {
    "react": 'React',
    "react-dom": 'ReactDOM',
    "react-router": 'ReactRouter',
    "react-router-dom": 'ReactRouterDom',
};

const PLUGINS = [
    postcss({
        extract: true,
        plugins: [
            autoprefixer,
        ],
    }),
    babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
    }),
    resolve({
        browser: true,
        resolveOnly: [
            /^(?!react$)/,
            /^(?!react-dom$)/,
            /^(?!prop-types)/,
        ],
    }),
    commonjs(),
    filesize(),
    typescript({tsconfig: './tsconfig.json'}),
];

const EXTERNAL = [
    "react",
    "react-dom",
    "react-router",
    "react-router-dom"
];

// https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
const CJS_AND_ES_EXTERNALS = EXTERNAL.concat(/@babel\/runtime/);

const OUTPUT_DATA = [
    {
        file: pkg.browser,
        format: 'umd',
    },
    {
        file: pkg.main,
        format: 'cjs',
    },
    {
        file: pkg.module,
        format: 'es',
    },
];

const config = OUTPUT_DATA.map(({file, format}) => ({
    input: INPUT_FILE_PATH,
    output: {
        file,
        format,
        name: OUTPUT_NAME,
        globals: GLOBALS,
    },
    external: ['cjs', 'es'].includes(format) ? CJS_AND_ES_EXTERNALS : EXTERNAL,
    plugins: PLUGINS,
}));

export default config;
