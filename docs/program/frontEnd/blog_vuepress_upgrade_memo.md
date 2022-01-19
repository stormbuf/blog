# blog vuepress 升级备忘录

## 动机

编程语言只是工具。

学习一门编程语言捷径，需求驱动开发。

作为一名后端程序员，让非专业人员用上自己开发的成果，前端是必不可少的。

此时，学习前端就是自然而然的事情，同时也需要一个需求驱动。

## 背景

前端的生态重复造轮子情况比较多，而且更新换代非常快，所以干脆从主流比较新的技术栈开始入手学习。

目前我的blog使用的是vuepress 框架，底层使用的vue 2、js、webpack。

恰好该框架开发了vuepress 2版本，该版本采用了 vue 3、ts、vite，所以我决定通过升级blog框架来入门前端。

## 前置知识点学习来源

js:

- [https://wangdoc.com/javascript/index.html](https://wangdoc.com/javascript/index.html)
- [https://wangdoc.com/es6/](https://wangdoc.com/es6/)

ts:

- [https://www.typescriptlang.org/zh/docs/](https://www.typescriptlang.org/zh/docs/)
- [https://www.tslang.cn/docs/home.html](https://www.tslang.cn/docs/home.html)
- [https://typescript.bootcss.com/](https://typescript.bootcss.com/)

vue3:

- [https://v3.cn.vuejs.org/guide/introduction.html](https://v3.cn.vuejs.org/guide/introduction.html)

## 升级

从 `main` 分支切出一个升级分支`feat/vuepress_upgrade`。升级完成再切换回去。

### 升级vuepress  依赖

由于vuepress 1.x 与 vuepress 2.x 有许多不兼容的地方，一个一个踩坑替换过于麻烦 ，所以我记录下使用的插件。然后卸载 vuepress 1.x 的依赖，再重新安装vuepress 2.x 依赖。

```bash
yarn add -D vuepress@next
```


vuepress 2.x 新增了一个默认的临时目录和缓存目录，所以需要添加到 `.gitignore` 文件中。

```bash
echo '.temp' >> .gitignore
echo '.cache' >> .gitignore
```


### js 替换成 ts

1. 安装 ts : `yarn global add typescript`
2. cd 到项目根目录
3. 执行命令初始化为ts 项目：`tsc --init`，生成的`tsconfig.json`可以按需修改
4. 所有js文件后缀改为ts
5. 安装类型依赖。js 有大量的库是使用js写的，通过ts使用时会报类型缺失的错误。不错主流的库都提供了一份类型声明依赖，可以通过 `@types/xxx` 获取。比如：`@types/node`。如果你使用的js库没有提供类型声明，则需要你自己根据import 使用的内容来提供一份类型声明文件 `.d.ts`

具体的迁移可以参考：

[https://jkchao.github.io/typescript-book-chinese/typings/migrating.html](https://jkchao.github.io/typescript-book-chinese/typings/migrating.html)

下面是我使用的`tsconfig.json`

```json
{
  "compilerOptions": {
    // "incremental": true,                   /* 增量编译 提高编译速度*/
    "target": "ES2020",                       /* 编译目标ES版本*/
    "module": "commonjs",                     /* 编译目标模块系统*/
    // "lib": [],                             /* 编译过程中需要引入的库文件列表*/
    "outDir": "dist",                         /* ts编译输出目录 */
    "rootDir": "docs",                         /* ts编译根目录. */
    // "importHelpers": true,                 /* 从tslib导入辅助工具函数(如__importDefault)*/
    "checkJs": true, // 报告 javascript 文件中的错误
    "strict": true,
    /* Enable all strict type-checking options. */
    "noImplicitAny": false, // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true, // 启用严格的 null 检查
    "noImplicitThis": false, // 当 this 表达式值为 any 类型的时候，生成一个错误
    /* 额外的检查 */
    "noUnusedLocals": true, // 有未使用的变量时，抛出错误
    "noUnusedParameters": false, // 有未使用的参数时，抛出错误
    "noImplicitReturns": true, // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true, // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）
    "declaration": true, // 生成相应的 '.d.ts' 文件
    "sourceMap": true, // 生成相应的 '.map' 文件
    "moduleResolution": "node",               /* 模块解析策略 */
    "baseUrl": "./", // 用于解析非相对模块名称的基目录
    "types": [ /* 要包含的类型声明文件路径列表*/
      "./typings",
      "node_modules/@types"
    ],                     
    "esModuleInterop": true                  /* 允许编译生成文件时，在代码中注入工具类(__importDefault、__importStar)对ESM与commonjs混用情况做兼容处理*/

  },
  "include": [                                /* 需要编译的文件 */
    "docs/**/*.ts",
    "typings/**/*.ts"
  ],
  "exclude": [                                /* 编译需要排除的文件 */
    "node_modules/**"
  ],
}
```


### 插件还原

1. @vuepress/back-to-top
2. @vuepress/nprogress
3. @vuepress/medium-zoom
4. @vuepress/plugin-search
5. @vuepress/plugin-shiki

这些插件依然提供，按官方文档正常使用就行



原插件feed 因为vuepress 插件api的变动无法正常使用，作者也很久没有维护了。

作为替代，基于官方插件`@vuepress/plugin-git`提供的页面更新时间数据，我自己实现了一个生成RSS的插件 `@stormbuf/vuepress-plugin-rss`。

具体可以在 [https://github.com/stormbuf/vuepress-plugin-rss](https://github.com/stormbuf/vuepress-plugin-rss) 了解。

### 添加网站统计

#### 谷歌统计

使用插件 `@vuepress/plugin-google-analytics`，

#### 百度统计

在config.ts head 配置中添加百度统计提供的脚本。

```javascript
head: [
    [
      'link', // 设置 favicon.ico，注意图片放在 public 文件夹下
      {
        rel: 'icon',
        href: '/img/logo.png'
      }
    ],
    ['link', {
      rel: 'manifest',
      href: '/manifest.json'
    }],
    // 百度统计脚本
    ['script', {async: true},
      "js 脚本"
    ],
  ]
```


### config.ts 添加类型支持

import 相关依赖：

```javascript
import { defineUserConfig } from 'vuepress'

import type { DefaultThemeOptions } from 'vuepress'
```




导出的config 放入`defineUserConfig `函数中

```javascript
export default defineUserConfig<DefaultThemeOptions>({})
```


### 归档组件改造

原归档组件由于vuepress升级后，插件api和主题api的不兼容导致无法使用。

原归档组件可以通过组件实例 this 直接获取到所有页面的信息。但是在vuepress 2.x 中就没这么方便了，最终我通过另一个方式迂回解决数据源的问题。

**实现思路：**

1. 基于官方插件`@vuepress/plugin-git`提供的页面更新时间数据
2. 继承默认主题，通过 开发Hook `extendsPage`收集页面的信息和更新时间
3. 在生命周期 Hook `onPrepared`中，使用Node API `writeTemp`将页面数据写入临时文件`storeData.ts`
4. 归档组件通过命令：`import {archivesPageData} from '@temp/storeData'`获取页面数据

其余实现和原实现差不多，另外还删除了多余的代码。



归档组件写法也向vue3靠拢。添加了 ts 支持，添加了类型识别。不过暂时并未用vue3 的组合式api写法重写组件。



## 后续

评论功能由于Vssue 不支持vuepress 2.x 暂时恢复不了。

后续打算封装 Ant Design of Vue Comment 组件，并整合vssue 里与 git 托管网站 issue 交互的功能实现自己的评论组件。

同时还打算继续添加 **newsletter**、**sitemap**功能。

