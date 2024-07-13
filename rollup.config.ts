import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import { builtinModules } from 'node:module'
import { defineConfig } from 'rollup'
import pkg from './package.json' assert { type: 'json' }

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      compact: true
    },
    {
      file: 'dist/index.js',
      format: 'esm',
      compact: true
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    }),
    terser()
  ],
  external: Object.keys(pkg.dependencies ?? {}).concat(
    builtinModules,
    builtinModules.map(module => `node:${module}`)
  )
})
