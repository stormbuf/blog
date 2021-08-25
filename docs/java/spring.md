# spring
# BeanFactory

## BeanFactoryPostProcessor 接口

`BeanFactoryPostProcessor`是一个函数式接口，里面只有一个方法：

```java
@FunctionalInterface
public interface BeanFactoryPostProcessor {

  /**
   * Modify the application context's internal bean factory after its standard
   * initialization. All bean definitions will have been loaded, but no beans
   * will have been instantiated yet. This allows for overriding or adding
   * properties even to eager-initializing beans.
   * @param beanFactory the bean factory used by the application context
   * @throws org.springframework.beans.BeansException in case of errors
   */
  void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException;

}
```

我们可以通过实现`BeanFactoryPostProcessor`接口，获取`BeanFactory`，操作`BeanFactory`对象，修改`BeanDefinition`，但不要去实例化bean。

**todo**：

1. springboot `ApplicationContext` 类继承结构，各接口和抽象模板类作用

2. `BeanDefinition` 如何被自动装配？

3. ioc 容器初始化流程



# IOC容器的创建

## BeanFactory解析

BeanFactory 接口的继承关系：

![](http://img.stormbuf.top/20210720115542.png)

简单描述这些接口：

- `org.springframework.beans.factory.BeanFactory`，Spring IoC 容器最基础的接口，提供依赖查找**单个** Bean 的功能

-  `org.springframework.beans.factory.ListableBeanFactory`，继承 BeanFactory 接口，提供依赖查找**多个** Bean 的功能

- `org.springframework.beans.factory.HierarchicalBeanFactory`，继承 BeanFactory 接口，提供获取父 BeanFactory 的功能，具有**层次性**

- `org.springframework.beans.factory.config.ConfigurableBeanFactory`，继承 HierarchicalBeanFactory 接口，提供可操作内部相关组件的功能，具有**可配置性**

- `org.springframework.beans.factory.config.AutowireCapableBeanFactory`，继承 BeanFactory 接口，提供可注入的功能，支持**依赖注入**

- `org.springframework.beans.factory.config.ConfigurableListableBeanFactory`，继承上面所有接口，综合所有特性，还提供可提前初始化所有单例 Bean 的功能
通过这些接口的名称可以大致了解其用意，接下来我们来看看它们的实现类的继承关系

![](http://img.stormbuf.top/DefaultListableBeanFactory.png)

简单描述这些实现类：

- `org.springframework.beans.factory.support.AbstractBeanFactory` 抽象类，实现 ConfigurableBeanFactory 接口，基础实现类，Bean 的创建过程交由子类实现

-  `org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory` 抽象类，继承 AbstractBeanFactory，实现 AutowireCapableBeanFactory 接口，完成 Bean 的创建

-  `org.springframework.beans.factory.support.DefaultListableBeanFactory`，Spring 底层 IoC 容器，依赖注入的底层实现
其他的接口和类和 BeanDefinition 注册中心，别名注册中心，单例 Bean 注册中心相关；右下角的 ApplicationContext 与 Spring 应用上下文有关。



## ApplicationContext 解析

ApplicationContext 就是 Spring 应用上下文，它不仅继承了 BeanFactory 体系，还提供更加高级的功能，更加适用于我们的正式应用环境。如以下几个功能：

- 继承 MessageSource，提供国际化的标准访问策略

- 继承 ApplicationEventPublisher ，提供强大的事件机制

- 扩展 ResourceLoader，可以用来加载多个 Resource，可以灵活访问不同的资源

- 对 Web 应用的支持

### ApplicationContext 体系结构

先来看看 ApplicationContext 接口的继承关系

![](http://img.stormbuf.top/20210720174450.png)

可以看到 ApplicationContext 除了继承 BeanFactory 接口以外，还继承了 MessageSource、ApplicationEventPublisher、ResourceLoader 等接口

简单描述几个接口：

- `org.springframework.core.io.ResourceLoader`，资源加载接口，用于访问不同的资源

- `org.springframework.context.ApplicationEventPublisher`，事件发布器接口，支持发布事件

- `org.springframework.context.MessageSource`，消息资源接口，提供国际化的标准访问策略

- `org.springframework.core.env.EnvironmentCapable`，环境暴露接口，Spring 应用上下文支持多环境的配置

- `org.springframework.context.ApplicationContext`，Spring 应用上下文，仅可读

- `org.springframework.context.ConfigurableApplicationContext`，Spring 应用上下文，支持配置相关属性

接下来我们来看看它们的实现类的继承关系（部分）

![](http://img.stormbuf.top/20210720174620.png)

简单描述上面几个关键的类：

- `org.springframework.context.support.AbstractApplicationContext`，Spring 应用上下文的抽象类，实现了大部分功能，提供骨架方法交由子类去实现

- `org.springframework.web.context.ConfigurableWebApplicationContext`，可配置的 Spring 应用上下文接口，支持 Web 应用

- `org.springframework.context.support.AbstractRefreshableConfigApplicationContext`，支持设置 XML 文件

- `org.springframework.web.context.support.AbstractRefreshableWebApplicationContext`，支持 Web 应用

- `org.springframework.web.context.support.AnnotationConfigWebApplicationContext`，支持 Web 应用，可以设置 XML 文件，并可以扫描注解下面的 Bean

- `org.springframework.context.annotation.AnnotationConfigApplicationContext`，支持扫描注解下面的 Bean

- `org.springframework.web.context.support.ClassPathXmlApplicationContext`，支持设置 XML 文件，也可以从 classpath 下面扫描相关资源

ApplicationContext 的子类比较多，主要根据支持 Web、支持注解、支持 XML 文件三个功能进行区分，我们大致了解每个实现类的作用即可。其中基本的实现都是在 **AbstractApplicationContext** 这个抽象类中完成的，在它的 `refresh()` 方法体现了 Spring 应用上下文的生命周期。`AbstractApplicationContext#refresh()` 这个方法可以说是 Spring 应用上下文的准备阶段，在使用 Spring 时该方法会被调用。

## 【核心】refresh 方法

```java
@Override
  public void refresh() throws BeansException, IllegalStateException {
    // <1> 来个锁，不然 refresh() 还没结束，你又来个启动或销毁容器的操作，那不就乱套了嘛
    synchronized (this.startupShutdownMonitor) {
      
      // <2> 刷新上下文环境的准备工作，记录下容器的启动时间、标记'已启动'状态、对上下文环境属性进行校验
      prepareRefresh();

      // <3> 创建并初始化一个 BeanFactory 对象 `beanFactory`，会加载出对应的 BeanDefinition 元信息们
      ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

      // <4> 为 `beanFactory` 进行一些准备工作，例如添加几个 BeanPostProcessor，手动注册几个特殊的 Bean
      prepareBeanFactory(beanFactory);

      try {
        // <5> 对 `beanFactory` 在进行一些后期的加工，交由子类进行扩展
        postProcessBeanFactory(beanFactory);

        // <6> 执行 BeanFactoryPostProcessor 处理器，包含 BeanDefinitionRegistryPostProcessor 处理器
        invokeBeanFactoryPostProcessors(beanFactory);

        // <7> 对 BeanPostProcessor 处理器进行初始化，并添加至 BeanFactory 中
        registerBeanPostProcessors(beanFactory);

        // <8> 设置上下文的 MessageSource 对象
        initMessageSource();

        // <9> 设置上下文的 ApplicationEventMulticaster 对象，上下文事件广播器
        initApplicationEventMulticaster();

        // <10> 刷新上下文时再进行一些初始化工作，交由子类进行扩展
        onRefresh();

        // <11> 将所有 ApplicationListener 监听器添加至 `applicationEventMulticaster` 事件广播器，如果已有事件则进行广播
        registerListeners();

        // <12> 设置 ConversionService 类型转换器，**初始化**所有还未初始化的 Bean（不是抽象、单例模式、不是懒加载方式）
        finishBeanFactoryInitialization(beanFactory);

        // <13> 刷新上下文的最后一步工作，会发布 ContextRefreshedEvent 上下文完成刷新事件
        finishRefresh();
      }
      // <14> 如果上面过程出现 BeansException 异常
      catch (BeansException ex) {
        if (logger.isWarnEnabled()) {
          logger.warn("Exception encountered during context initialization - " +
              "cancelling refresh attempt: " + ex);
        }

        // <14.1> “销毁” 已注册的单例 Bean
        destroyBeans();

        // <14.2> 设置上下文的 `active` 状态为 `false`
        cancelRefresh(ex);

        // <14.3> 抛出异常
        throw ex;
      }
      // <15> `finally` 代码块
      finally {
        // Reset common introspection caches in Spring's core, since we
        // might not ever need metadata for singleton beans anymore...
        // 清除相关缓存，例如通过反射机制缓存的 Method 和 Field 对象，缓存的注解元数据，缓存的泛型类型对象，缓存的类加载器
        resetCommonCaches();
      }
    }
  }
```

**`finishBeanFactoryInitialization(beanFactory)`**** 方法初始化了所有的非懒加载的单例bean。**

## BeanDefinition 解析

BeanDefinition 介绍 

### 面向注解的解析

核心类是 `org.springframework.context.annotation.ClassPathBeanDefinitionScanner`。

1. 该类在创建时设置了基于`@Component` 注解的过滤器。

2. 调用`doScan(String... basePackages)` 方法，根据过滤器扫描出包路径（入参的就是包路径）下符合条件 .class文件，生成 `BeanDefinition`。

  1.  将 `BeanDefinition `封装成 `BeanDefinitionHolder `对象（这里多了一个 `beanName`），并注册到`BeanDefinitionRegistry`中

1. 如果代理模式是 **TARGET_CLASS**，则再创建一个 `BeanDefinition `代理对象（重新设置了相关属性），原始 `BeanDefinition `已注册（该处与**AOP**相关）

## Spring 扩展点解析

## 广播机制

# bean 的创建和生命周期

创建 Bean 的过程如下：

- Class 对象加载阶段

- 实例化前阶段（如果返回了一个对象则直接返回，不会进行下面的阶段）

- 实例化阶段

- 实例化后阶段

- 提前暴露单例 Bean（循环依赖处理的关键）

- 属性填充阶段

- Aware 接口回调阶段

- 初始化前阶段

- 初始化阶段

- 初始化后阶段

![](http://img.stormbuf.top/java0-1559531915.jpg)

## doGetBean 方法


`doGetBean(final String name, @Nullable final Class<T> requiredType, @Nullable final Object[] args, boolean typeCheckOnly)`

该方法是获取与创建bean的核心方法。

## createBean

`AbstractAutowireCapableBeanFactory#createBean(String, RootBeanDefinition, Object[])`

该方法是创建bean的核心方法。由`doGetBean`调用。

`createBean`通过调用`doCreateBean`方法创建bean。

过程大致如下：
1.  获取 `mbd` 对应的 Class 对象，确保当前 Bean 能够被创建出来，调用 `resolveBeanClass(...)` 方法
2.  对所有的 MethodOverride 进行**验证**和**准备**工作（确保存在对应的方法，并设置为不能重复加载）
3.  **实例化前阶段**在实例化前进行相关处理，会先调用所有 InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation
注意，如果这里返回对象不是 `null` 的话，不会继续往下执行原本初始化操作，**直接返回**，也就是说这个方法返回的是最终实例对象
可以通过这种方式**提前返回**一个代理对象，例如 AOP 的实现，或者 RPC 远程调用的实现（因为本地类没有远程能力，可以通过这种方式进行拦截）
4.  创建 Bean 对象 `beanInstance`，如果上一步没有返回代理对象，就只能走常规的路线进行 Bean 的创建了，调用 `doCreateBean(...)` 方法
5.  将 `beanInstance` 返回
可以看到这个方法中并没有开始真正 Bean 的创建，在这个方法的第 `4` 步会调用 `doCreateBean(...)` 方法创建 Bean

## doCreateBean

过程大致如下：

1.  Bean 的**实例化阶段**，会将 Bean 的实例对象封装成 BeanWrapperImpl 包装对象
1.  如果是单例模式，则先尝试从 `factoryBeanInstanceCache` 缓存中获取实例对象，并从缓存中移除
2.  使用合适的实例化策略来创建 Bean 的实例：工厂方法、构造函数自动注入、简单初始化，主要是将 BeanDefinition 转换为 BeanWrapper 对象
调用 `createBeanInstance(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)` 方法
3.  获取包装的实例对象 `bean
`4.  获取包装的实例对象的类型 `beanType
`2.  对 `RootBeanDefinition`（合并后）进行**加工处理**1.  如果该 `RootBeanDefinition `没有处理过，则进行下面的处理
2.  调用所有的 `MergedBeanDefinitionPostProcessor#postProcessMergedBeanDefinition`，这个过程非常重要，例如 Spring 内有下面两个处理器：

- `AutowiredAnnotationBeanPostProcessor`，会先解析出 `@Autowired` 和 `@Value` 注解标注的属性的注入元信息，后续进行依赖注入

- `CommonAnnotationBeanPostProcessor`，会先解析出 `@Resource` 注解标注的属性的注入元信息，后续进行依赖注入，它也会找到 `@PostConstruct` 和 `@PreDestroy` 注解标注的方法，并构建一个 `LifecycleMetadata `对象，用于后续生命周期中的初始化和销毁
3.  设置该 `RootBeanDefinition `被处理过，避免重复处理
3.  **提前暴露**这个 `bean`，如果可以的话，目的是解决单例模式 Bean 的循环依赖注入
1.  判断是否可以提前暴露，满足三个条件：单例模式、允许循环依赖（默认为 true）、当前单例 bean 正在被创建，在前面已经标记过
2.  创建一个 `ObjectFactory `实现类，用于返回当前正在被创建的 `bean`，提前暴露，保存在 `singletonFactories` （**三级 Map**）缓存中

---


接下来开始初始化上面的 `bean` 实例对象，会先创建一个 `Object exposedObject` 等于 `bean` （引用）
4.  对 `bean` 进行**属性填充**，注入对应的属性值，调用 `populateBean(String beanName, RootBeanDefinition mbd, @Nullable BeanWrapper bw)` 方法
5.  **初始化**这个 `exposedObject`，调用其初始化方法，调用 `initializeBean(final String beanName, final Object bean, @Nullable RootBeanDefinition mbd)` 方法

---


6.  **循环依赖注入的检查**1.  获取当前正在创建的 `beanName` 被依赖注入的早期引用，调用 `DefaultSingletonBeanRegistry#getSingleton(String beanName, boolean allowEarlyReference)` 方法。注意，这里有一个入参是 `false`，不会调用上面第 `3` 步的 `ObjectFactory `实现类，也就是说当前 `bean` 如果出现循环依赖注入，这里才能获取到提前暴露的引用
2.  如果出现了循环依赖注入，则进行接下来的检查工作
1.  如果 `exposedObject` 没有在初始化阶段中被改变，也就是没有被增强，则使用提前暴露的那个引用
2.  否则，`exposedObject` 已经不是被别的 Bean 依赖注入的那个 Bean，如果依赖当前 `beanName` 的 Bean（通过 `depends-on` 配置）已经被创建，则抛出异常
7.  为当前 `bean` 注册 `DisposableBeanAdapter`（如果需要的话），用于 Bean 生命周期中的销毁阶段
8.  返回创建好的 `exposedObject` 对象
概括：

- 首先获取对应的 Class 对象，创建一个实例对象

- 对这个实例对象进行属性填充

- 调用这个实例对象的初始化方法

---

## createBeanInstance

在 `doCreateBean` 被调用，创建一个 Bean 的实例对象，并将 Bean 的实例对象封装成 `BeanWrapperImpl`包装对象返回。

过程大致如下：

1. 获取 `beanName` 对应的 Class 对象

2. 如果存在 Supplier 实例化回调接口，则使用给定的回调方法创建一个实例对象

3. 如果配置了 `factory-method` 工厂方法，则调用该方法来创建一个实例对象，通过 @Bean 标注的方法会通过这里进行创建

------

如果上面两种情况都不是，那么就进行接下来正常创建 Bean 实例的一个过程

1. 判断这个 RootBeanDefinition 的构造方法是否已经被解析出来了，因为找到最匹配的构造方法比较繁琐，找到后会设置到 RootBeanDefinition 中，避免重复这个过程

  1. RootBeanDefinition 的 `resolvedConstructorOrFactoryMethod` 是否不为空，不为空表示构造方法已经解析出来了

  2. 构造方法已经解析出来了，则判断它的 `constructorArgumentsResolved` 是否不为空，不为空表示有入参，需要先获取到对应的入参（构造器注入）

1. 如果最匹配的构造方法已解析出来

  1. 如果这个构造方法有入参，则找到最匹配的构造方法，这里会拿到已经被解析出来的这个方法，并找到入参（构造器注入），然后调用该方法返回一个实例对象（反射机制）

  2. 否则，没有入参，直接调用解析出来构造方法，返回一个实例对象（反射机制）

1. 如果最匹配的构造方法还没开始解析，那么需要找到一个最匹配的构造方法，然后创建一个实例对象

  1. 先尝试通过 SmartInstantiationAwareBeanPostProcessor 处理器找到一些合适的构造方法，保存在 `ctors` 中

  2. 是否满足下面其中一个条件：`ctors` 不为空、构造器注入模式、定义了构造方法的入参、当前方法指定了入参，

    则找到最匹配的构造方法，如果 `ctors` 不为空，会从这里面找一个最匹配的，并找到入参（构造器注入），然后调用该方法返回一个实例对象（反射机制）

1. 如果第 `6` 步还不满足，那么尝试从 RootBeanDefinition 中获取优先的构造方法

  1. 如果存在优先的构造方法，则从里面找到最匹配的一个，并找到入参（构造器注入），然后调用该方法返回一个实例对象（反射机制）

1. 如果上面多种情况都不满足，那只能使用兜底方法了，直接调用默认构造方法返回一个实例对象（反射机制）

------

整个的实例化过程非常的复杂，接下来进行概括：

- 先拿到对应 Class 对象

- 如果设置了 Supplier 实例化回调接口，则通过该回调接口获取实例对象

- 如果配置了通过 `factory-method` 工厂方法获取实例对象，则通过这个方法创建实例对象，@Bean 标注的方法也是通过这里创建实例对象，方法入参会依赖注入

- 找到最匹配的一个构造方法，并找到对应的入参（构造器注入），通过调用该方法返回一个实例对象

- 兜底方法，调用默认构造方法创建一个实例对象



BeanWrapperImpl 承担的角色：

1. Bean 实例的包装

2. `org.springframework.beans.PropertyAccessor`  属性编辑器

3. `org.springframework.beans.PropertyEditorRegistry`  属性编辑器注册表

4. 类型转换器



## populateBean

用作**属性填充**。

## 三级缓存

作用：解决属性注入和Setter注入的循环依赖，无法解决构造器注入的循环依赖。

说明：这里的循环依赖指的是**单例模式**下的 Bean **字段注入**时出现的循环依赖。**构造器注入**对于 Spring 无法自动解决（应该考虑代码设计是否有问题），可通过延迟初始化来处理。Spring 只解决**单例模式**下的循环依赖。

在 Spring 底层 IoC 容器 BeanFactory 中处理循环依赖的方法主要借助于以下 `3` 个 Map 集合：

1. `singletonObjects`（一级 Map），里面保存了所有已经初始化好的单例 Bean，也就是会保存 Spring IoC 容器中所有单例的 Spring Bean；

2. `earlySingletonObjects`（二级 Map），里面会保存从 **三级 Map** 获取到的正在初始化的 Bean

3. `singletonFactories`（三级 Map），里面保存了正在初始化的 Bean 对应的 ObjectFactory 实现类，调用其 getObject() 方法返回正在初始化的 Bean 对象（仅实例化还没完全初始化好），如果存在则将获取到的 Bean 对象并保存至 **二级 Map**，同时从当前 **三级 Map** 移除该 ObjectFactory 实现类。

当通过 getBean 依赖查找时会首先依次从上面三个 Map 获取，存在则返回，不存在则进行初始化，这三个 Map 是处理循环依赖的关键。

例如两个 Bean 出现循环依赖，A 依赖 B，B 依赖 A；当我们去依赖查找 A，在实例化后初始化前会先生成一个 ObjectFactory 对象（可获取当前正在初始化 A）保存在上面的 `singletonFactories` 中，初始化的过程需注入 B；接下来去查找 B，初始 B 的时候又要去注入 A，又去查找 A ，由于可以通过 `singletonFactories` 直接拿到正在初始化的 A，那么就可以完成 B 的初始化，最后也完成 A 的初始化，这样就避免出现循环依赖。

> B（也依赖 A） -> C -> A，当你获取 A 这个 Bean 时，后续 B 和 C 都要注入 A，没有上面的 **二级 Map**的话，**三级 Map** 保存的 ObjectFactory 实现类会被调用两次，会重复处理，可能出现问题，这样做在性能上也有所提升
**问题二**：为什么不直接调用这个 ObjectFactory#getObject() 方法放入 **二级Map** 中，而需要上面的 **三级 Map**？
对于不涉及到 AOP 的 Bean 确实可以不需要 `singletonFactories`（三级 Map），但是 Spring AOP 就是 Spring 体系中的一员，如果没有`singletonFactories`（三级 Map），意味着 Bean 在实例化后就要完成 AOP 代理，这样违背了 Spring 的设计原则。Spring 是通过 `AnnotationAwareAspectJAutoProxyCreator` 这个后置处理器在完全创建好 Bean 后来完成 AOP 代理，而不是在实例化后就立马进行 AOP 代理。如果出现了循环依赖，那没有办法，只有给 Bean 先创建代理对象，但是在没有出现循环依赖的情况下，设计之初就是让 Bean 在完全创建好后才完成 AOP 代理。

> 提示：`AnnotationAwareAspectJAutoProxyCreator` 是一个 `SmartInstantiationAwareBeanPostProcessor` 后置处理器，在它的 getEarlyBeanReference(..) 方法中可以创建代理对象。所以说对于上面的**问题二**，如果出现了循环依赖，如果是一个 AOP 代理对象，那只能给 Bean 先创建代理对象，设计之初就是让 Bean 在完全创建好后才完成 AOP 代理。

> 为什么 Spring 的设计是让 Bean 在完全创建好后才完成 AOP 代理？

因为创建的代理对象需要关联目标对象，在拦截处理的过程中需要根据目标对象执行被拦截的方法，所以这个目标对象最好是一个“成熟态”，而不是仅实例化还未初始化的一个对象。

# aop

Bean 的加载过程，整个过程中会调用相应的 BeanPostProcessor 对正在创建 Bean 进行处理，例如：

1. 在 Bean 的实例化前，会调用 `InstantiationAwareBeanPostProcessor#postProcessBeforeInstantiation(..)` 方法进行处理

2. 在 Bean 出现循环依赖的情况下，会调用 `SmartInstantiationAwareBeanPostProcessor#getEarlyBeanReference(..)` 方法对提前暴露的 Bean 进行处理

3. 在 Bean 初始化后，会调用 `BeanPostProcessor#postProcessAfterInitialization(..)` 方法对初始化好的 Bean 进行处理

Spring AOP 则是通过上面三个切入点进行创建代理对象，实现**自动代理**。

- 在 Spring AOP 中主要是通过第 `3` 种 BeanPostProcessor 创建代理对象，在 Bean 初始化后，也就是一个“成熟态”，然后再尝试是否创建一个代理对象；

- 第 `2` 种方式是为了解决 Bean 循环依赖的问题，虽然 Bean 仅实例化还未初始化，但是出现了循环依赖，不得不在此时创建一个代理对象；

- 第 `1` 种方式是在 Bean 还没有实例化的时候就提前创建一个代理对象（创建了则不会继续后续的 Bean 的创建过程），例如 RPC 远程调用的实现，因为本地类没有远程能力，可以通过这种方式进行拦截。


