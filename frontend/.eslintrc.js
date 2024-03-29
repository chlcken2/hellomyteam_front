module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  env: {
    browser: true,
    node: true,
    jasmine: true,
  },
  extends: [
    "airbnb", // or airbnb-base
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended", // 설치 한경우
    "plugin:import/errors", // 설치한 경우
    "plugin:import/warnings", // 설치한 경우
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/typescript",
  ],
  rules: {
    "no-param-reassign": 0,
    "jsx-a11y/label-has-associated-control": [
      2,
      {
        labelAttributes: ["htmlFor"],
      },
    ],
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
        mjs: "never",
      },
    ],
    "no-alert": "off",
    "import/namespace": "off",
    "import/default": "off",
    "no-return-await": "off",
    "linebreak-style": 0,
    "import/prefer-default-export": 0,
    "no-use-before-define": 0,
    "import/no-unresolved": 0,
    "react/react-in-jsx-scope": "off",
    "import/no-extraneous-dependencies": 0, // 테스트 또는 개발환경을 구성하는 파일에서는 devDependency 사용을 허용
    "no-shadow": 0,
    "react/prop-types": 0,
    "react/no-array-index-key": 0,
    "react/jsx-filename-extension": [2, { extensions: [".js", ".jsx", ".ts", ".tsx"] }],
    "jsx-a11y/no-noninteractive-element-interactions": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "react/function-component-definition": [2, { namedComponents: "arrow-function" }],
    "react/button-has-type": 0,
    "no-extra-boolean-cast": 0,
    "react/require-default-props": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "consistent-return": "off",
    "no-plusplus": "off",
    "array-callback-return": "off",
    "no-lonely-if": "off",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
};
