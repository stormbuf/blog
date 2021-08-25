> 基于版本spring boot 2.1.5.RELEASE

spring boot 启动时会调用`SpringApplication#run(String... args)`方法，一切都从这里开始。

# 整体流程

## 1. ApplicationContext创建

spring boot会调用`org.springframework.boot.SpringApplication#createApplicationContext`方法，根据`webApplicationType`值创建`ApplicationContext`。

一般web环境都是创建`AnnotationConfigServletWebServerApplicationContext`，也只有当前应用为网络应用时才会启动内嵌的 Servlet 容器。（Servlet 容器创建及启动的实现在`ServletWebServerApplicationContext`中，而`AnnotationConfigServletWebServerApplicationContext`继承了该类）。

## 2. 创建Servlet 容器

`run`方法中，spring boot会通过`refreshContext()`方法调用`ApplicationContext`的`refresh()`方法（该方法由`ApplicationContext`实例的父类`AbstractApplicationContext`提供实现，是模板方法的应用，里面定义了`ApplicationContext`的启动流程）。

### refresh()方法定义的流程

```java
  public void refresh() {
    synchronized (this.startupShutdownMonitor) {
      // Prepare this context for refreshing.
      prepareRefresh();

      // Tell the subclass to refresh the internal bean factory.
      ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

      // Prepare the bean factory for use in this context.
      prepareBeanFactory(beanFactory);

      try {
        // Allows post-processing of the bean factory in context subclasses.
        postProcessBeanFactory(beanFactory);

        // Invoke factory processors registered as beans in the context.
        invokeBeanFactoryPostProcessors(beanFactory);

        // Register bean processors that intercept bean creation.
        registerBeanPostProcessors(beanFactory);

        // Initialize message source for this context.
        initMessageSource();

        // Initialize event multicaster for this context.
        initApplicationEventMulticaster();

        // Initialize other special beans in specific context subclasses.
        onRefresh();

        // Check for listener beans and register them.
        registerListeners();

        // Instantiate all remaining (non-lazy-init) singletons.
        finishBeanFactoryInitialization(beanFactory);

        // Last step: publish corresponding event.
        finishRefresh();
      }

     ... ... 
```



子类`ServletWebServerApplicationContext` 重写的`onRefresh()`方法被调用。

这个方法里通过`createWebServer()`创建了 `Servlet`容器（默认为 Tomcat），并添加 IoC 容器中的 `Servlet`、`Filter `和 `EventListener`至 `Servlet`上下文。

## 3. 启动容器

子类`ServletWebServerApplicationContext` 重写的`finishRefresh()`方法被调用。

这个方法里通过`startWebServer()`调用`WebServer#start`方法启动创建的容器。



# createWebServer 方法

`org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext#createWebServer`

以tomcat容器为例：

```java
private void createWebServer() {
    WebServer webServer = this.webServer;
    // 获取被加载都ioc容器中的TomcatServletWebServerFactory
    ServletContext servletContext = getServletContext();
    if (webServer == null && servletContext == null) {
      ServletWebServerFactory factory = getWebServerFactory();
      // 生成一个TomcatWebServer实例
      this.webServer = factory.getWebServer(getSelfInitializer());
    }
    else if (servletContext != null) {
      try {
        getSelfInitializer().onStartup(servletContext);
      }
      catch (ServletException ex) {
        throw new ApplicationContextException("Cannot initialize servlet context",
            ex);
      }
    }
    initPropertySources();
  }
```



spring boot在`org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory#getWebServer` 

给tomcat设置了相关的配置。

其中`org.apache.catalina.connector`的实例化给Tomcat引入了默认配置。

源码路径：

1. `org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory#getWebServer`

2. `Connector connector = new Connector(this.protocol);`

3. `Class<?> clazz = Class.forName(protocolHandlerClassName);`

4. `org.apache.coyote.http11.Http11NioProtocol`

5. `org.apache.coyote.AbstractProtocol`

6. `org.apache.coyote.AbstractProtocol#endpoint`默认配置保存在这个类中。



**maxThreads**: 用于接收和处理client端请求的最大线程数，默认200

**acceptCount**: tomcat 线程池所有线程忙碌时，等待队列的最长长度。默认100

**connectionTimeout**：每个http请求的读取超时时间。默认2000ms