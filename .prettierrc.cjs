module.exports = {
  tabWidth: 2, // 缩进的空格数量
  printWidth: 120, // 换行字符，当代码字符达到多少时换行，80 / 120是官方推荐
  semi: true, // 是否在代码块结尾加上分号
  quoteProps: "consistent", // 对象属性是否加引号（"as-needed" | "consistent" | "preserve"）
  singleQuote: false, // 是否使用单引号替代双引号
  jsxSingleQuote: false, // jsx中是否使用单引号替代双引号
  trailingComma: "all", // 对象或数组最后一个元素后是否加逗号（"none" | "es5" | "all"）
  bracketSameLine: true, // 闭合括号是放在最后一行的末尾还是单独占一行。
  arrowParens: "always", // 当箭头函数只有一个参数是否加括号 ("always" | "avoid")
  endOfLine: "lf", // 文件结束符
  useEditorConfig: false, // 是否使用根目录下的EditorConfig配置文件
};
