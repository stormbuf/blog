# Mybatis-SpringBoot源码解析
# 关键类

## MybatisProperties

`org.mybatis.spring.boot.autoconfigure.MybatisProperties`

 MyBatis 的配置类，通过 Spring Boot 中的 `@ConfigurationProperties` 注解，注入 MyBatis 的相关配置



这里注意到仅添加了 @ConfigurationProperties 注解，在作为 Spring Bean 注入到 Spring 容器中时，会将相关配置注入到属性中，但是这个注解不会将该类作为 Spring Bean 进行注入，需要结合 @Configuration 注解或者其他注解一起使用

## MybatisAutoConfiguration

`org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration`

实现 InitializingBean 接口，MyBatis 自动配置类，用于初始化 MyBatis，核心类



类上面定义的几个注解：

- `@Configuration`：可以当作一个 Spring Bean 注入到 Spring 上下文中

- `@ConditionalOnClass({ SqlSessionFactory.class, SqlSessionFactoryBean.class })
`保证存在 value 中所有的 Class 对象，以确保可以创建它们的实例对象，这里就保证 SqlSessionFactory 和 SqlSessionFactoryBean 都能够被创建

- `@ConditionalOnSingleCandidate(DataSource.class)
`保证存在 value 类型对应的 Bean，这里确保已经存在一个 DataSource 数据源对象

- `@EnableConfigurationProperties(MybatisProperties.class)
`注入 value 中所有的类型的 Bean，这里会让 MybatisProperties 作为 Spring Bean 注入到 Spring 上下文中

## SqlSessionTemplate


`org.mybatis.spring.SqlSessionTemplate`：实现 SqlSession 和 DisposableBean 接口，SqlSession 操作模板实现类
实际上，代码实现和 `org.apache.ibatis.session.SqlSessionManager` 相似，承担 SqlSessionFactory 和 SqlSession 的职责

### SqlSessionInterceptor

SqlSessionTemplate的内部类，实现了 InvocationHandler 接口，作为`sqlSessionProxy`动态代理对象的代理类，对 SqlSession 的相关方法进行增强

## MapperFactoryBean 

扫描 Mapper 接口时生成的`BeanDefinition`对象，通过这个对象，spring生成bean的过程完成了**Mapper 动态代理对象的创建**。

### 创建MappedStatement

`MapperFactoryBean`的父类`DaoSupport`中实现了`InitializingBean`接口，在创建bean，初始化时会调用`checkDaoConfig`方法来生成`MappedStatement`放在全局配置类`Configuration`中。

### 创建Mapper代理类

`MapperFactoryBean `实现了`FactoryBean`接口，在spring框架初始化时，会通过`FactoryBean#getObject`生成并获取Mapper接口的代理对象。

`getObject`通过getSqlSession 方法获取父类`SqlSessionDaoSupport`中的`sqlSessionTemplate`，通过sqlSession生成并获取Mapper接口的代理对象。

# @MapperScan注解

Spring boot中，配置了`@Mapper`注解的Mapper接口才会被解析，一般有四个路径：

- 配置 `MapperScannerConfigurer` 扫描器类型的 Spring Bean

-  `@MapperScan`注解

-  `<mybatis:scan />`标签

- 若没有配置上面三种方式则通过`AutoConfiguredMapperScannerRegistrar`添加`MapperScannerConfigurer`，然后扫描Spring Boot的基础包路径去获取Mapper接口。



`org.mybatis.spring.annotation.MapperScannerRegistrar`作为`@MapperScan`的注册器。

`MapperScannerRegistrar`  实现了 `ImportBeanDefinitionRegistrar`接口，在Spring Boot创建bean时，调用方法registerBeanDefinitions创建了`MapperScannerConfigurer`对象，`MapperScannerConfigurer`使用`@MapperScan`注解信息去扫描Mapper接口。

> `MapperScannerConfigurer`扫描到的所有扫描到的 Mapper 接口的 `BeanDefinition `对象（Spring Bean的前身），并将其 Bean Class 修改为 `MapperFactoryBean`，从而在 Spring 初始化该 Bean 的时候，会初始化成 `MapperFactoryBean` 类型，**实现创建 Mapper 动态代理对象**

## AutoConfiguredMapperScannerRegistrar

`org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration.AutoConfiguredMapperScannerRegistrar`

是`MybatisAutoConfiguration` 的一个内部静态类。

通过`org.mybatis.spring.boot.autoconfigure.MybatisAutoConfiguration.MapperScannerRegistrarNotFoundConfiguration`导入该bean（通过条件注解判断了不存在另外三种路径的前提）。

