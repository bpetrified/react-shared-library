import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from "@rollup/plugin-replace";
import generatePackageJson from "rollup-plugin-generate-package-json";
import dts from "rollup-plugin-dts";
import postcss from 'rollup-plugin-postcss';

const packageJson = require("./package.json");
const fs = require('fs');
const path = require('path');

function getFolders(srcpath) {
  return fs.readdirSync(srcpath)
    .map(file => { return path.join(srcpath, file) })
    .filter(path => fs.statSync(path).isDirectory())
    .map((_p) => _p.replace('src/', ''));
}

const plugins = [
  peerDepsExternal(),
  resolve(),
  replace({
    __IS_DEV__: process.env.NODE_ENV === "development",
  }),
  commonjs(),
  typescript({ tsconfig: "./tsconfig.json" }),
  terser(),
  postcss({
    extract: false,
    modules: true,
    use: ['sass'],
  })
];

const subfolderPlugins = (folderName) => {
  const subFilderPlugins = [
    peerDepsExternal(),
    resolve(),
    replace({
      __IS_DEV__: process.env.NODE_ENV === "development",
    }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json", declaration: false }),
    terser(),
    postcss({
      extract: false,
      modules: true,
      use: ['sass'],
    }),
    generatePackageJson({
      baseContents: {
        name: `${packageJson.name}/${folderName}`,
        main: "../cjs/index.js", // --> points to cjs format entry point of whole library
        module: "./index.js", // --> points to esm format entry point of individual component
        types: "./index.d.ts", // --> points to types definition file of individual component
      },
    }),
  ]
  return subFilderPlugins;
};

const folderBuilds = getFolders('./src').map((folder) => {
  return {
    input: `src/${folder}/index.ts`,
    output: {
      file: `dist/${folder}/index.js`,
      sourcemap: true,
      exports: 'named',
      format: 'esm',
    },
    plugins: subfolderPlugins(folder),
    external: ['react', 'react-dom'],
  };
});

const folderDSTBuilds = getFolders('./src').map((folder) => {
  return {
    input: `dist/${folder}/index.d.ts`,
    output: [{ file: `dist/${folder}/index.d.ts`, format: "esm" }],
    plugins: [dts.default()],
  };
});

export default [
  {
    input: ["src/index.ts"],
    output: [
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
        exports: "named",
      },
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
        exports: "named",
      },
    ],
    plugins,
    external: ["react", "react-dom"],
  },
  ...folderBuilds,
  {
    input: "dist/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    plugins: [dts.default()],
  },
  ...folderDSTBuilds
];
