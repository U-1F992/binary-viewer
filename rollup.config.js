import typescript from "@rollup/plugin-typescript";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";

export default [
    {
        input: "src/index.ts",
        output: {
            file: "dist/index.js",
            format: 'es'
        },
        plugins: [
            // Transpile *.ts
            typescript(),

            // Transpile to ES3
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.ts'],
            }),

            // Process CommonJS modules provided by core-js.
            commonjs()
        ]
    }
];
