import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
       
        after: "readonly",
        afterEach: "readonly",
        before: "readonly",
        beforeEach: "readonly",
        describe: "readonly",
        it: "readonly",
       
      },
    },
  },
  pluginJs.configs.recommended,
];
