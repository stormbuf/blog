# Java module system

## 介绍
模块系统是自 JDK9 引入的新特性，该特性在 package 的基础上提供了对 package 如何使用、模块间依赖关系的约束。

**一个模块即为一个 jar 包。**

**模块可以由一个或多个 package 组成。**

![](https://raw.githubusercontent.com/stormbuf/blog/main/img/202204112325724.png)


### module-info. java
`module-info.java` 文件创建位置与 package 同级。
每个 jar 包会通过一个描述文件 `module-info.java` 来描述这个 jar 包的使用及依赖关系。
具体包含这些信息：

-   模块名称（全局唯一）
-   依赖哪些模块
-   导出模块内的哪些包（允许直接 `import` 使用）
-   开放模块内的哪些包（允许通过 Java 反射访问）
-   提供哪些服务
-   依赖哪些服务

![](https://raw.githubusercontent.com/stormbuf/blog/main/img/202204112326026.png)


### 对JDK使用者带来的好处
- **原生的依赖管理。** 通过声明模块间的依赖关系，当出现循环依赖时，将无法通过编译。同时，由于模块系统不允许不同模块导出相同的包（**即 `split package`，分裂包**），所以在查找包时，Java 可以精准的定位到一个模块，从而获得更好的性能。
- **精简 JRE。** JDK 被分为多个模块，使用时引入需要的模块。通过 JDK9 提供的新工具 `jlink` 裁剪掉无用的模块。通过自定义 jre 的方式得到体积更小的 jar 包。
- **面向使用者的访问隔离。** 在原本的可见性的基础上，引入优先级更高的模块可见性。通过 `exports` 关键词帮助 library 的开发者更精准的控制哪些类可以被使用，哪些类是内部使用。

## 语法

-   `[open] module <module>`: 声明一个模块，模块名称应全局唯一，不可重复。加上 `open` 关键词表示模块内的所有包都允许通过 Java 反射访问，模块声明体内不再允许使用 `opens` 语句。
-   `requires [transitive] <module>` : 声明模块依赖，一次只能声明一个依赖，如果依赖多个模块，需要多次声明。加上 `transitive` 关键词表示传递依赖，比如模块 A 依赖模块 B，模块 B 传递依赖模块 C，那么模块 A 就会自动依赖模块 C，类似于 Maven。
- `requires static [transitive] <module>`:声明静态模块依赖，模块系统在编译时以及运行时验证模块的依赖关系。 有时希望在编译时模块依赖性是必需的，但在运行时是可选的。
-   `exports <package> [to <module1>[, <module2>...]]`: 导出模块内的包（允许直接 `import` 使用），一次导出一个包，如果需要导出多个包，需要多次声明。如果需要定向导出（**仅允许指定模块`import`**），可以使用 `to` 关键词，后面加上模块列表（逗号分隔）。
-   `opens <package> [to <module>[, <module2>...]]` : 开放模块内的包（允许通过 Java 反射访问），一次开放一个包，如果需要开放多个包，需要多次声明。如果需要定向开放（**仅允许指定模块通过反射使用**），可以使用 `to` 关键词，后面加上模块列表（逗号分隔）。
-   `provides <interface | abstract class> with <class1>[, <class2> ...]`: 声明模块提供的 Java SPI 服务，一次可以声明多个服务实现类（逗号分隔）。
-   `uses <interface | abstract class>` : 声明模块依赖的 Java SPI 服务，加上之后模块内的代码就可以通过 `ServiceLoader.load(Class)` 一次性加载所声明的 SPI 服务的所有实现类。

## 类路径与模块路径
类路径是指 classpath 指定的路径。以往 Java 类加载器会在这个路径中寻找并加载用户的自定义类。

模块路径是指定的一个或多个包含模块的路径。在这些路径里，模块以文件夹或 jar 包的形式存在。Java 类加载器会从这些路径中加载类。模块路径避免了使用类路径时，由于 jar 包顺序问题，加载了不同版本的 jar 包导致的 `class not found` 这类异常。

## 未命名模块与自动模块
为兼容 Java8 的老应用，对于未经模块化改造的 jar 包，根据其位置是在类路径或模块路径，将其转为未命名模块或自动模块。
自动模块也属命名模块，模块名由 jar 包名去掉语义化版本所得。
多个未命名模块可以导出同名 package。

![](https://raw.githubusercontent.com/stormbuf/blog/main/img/202204112326654.png)

## 参考
[【JDK 11】关于 Java 模块系统，看这一篇就够了 - yuluoxingkong - 博客园](https://www.cnblogs.com/yuluoxingkong/p/14682431.html)

[jdk9模块化知识和规则入门 - 老K的Java博客](https://javakk.com/1383.html)

[Understanding Java 9 Modules](https://www.oracle.com/corporate/features/understanding-java-9-modules.html)

[Project Jigsaw: Quick Start Guide](https://openjdk.java.net/projects/jigsaw/quick-start)