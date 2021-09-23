# ThreadLocal解析

# `ThreadLocal` 是什么

`ThreadLocal` 是 JDK `java.lang` 包中的一个用来实现实现线程之间数据隔离的工具。

> ThreadLocal 这个类提供线程局部变量，这些变量与其他正常的变量的不同之处在于，每一个访问该变量的线程在其内部都有一个独立的初始化的变量副本；ThreadLocal 实例变量通常采用private static 在类中修饰。
只要 ThreadLocal 的变量能被访问，并且线程存活，那每个线程都会持有 ThreadLocal 变量的副本。当一个线程结束时，它所持有的所有 ThreadLocal 相对的实例副本都可被回收。

当使用 `ThreadLocal` 维护变量时，`ThreadLocal` 为每个使用该变量的线程提供**独立的变量副本**，所以每一个线程都可以独立地改变自己的副本，而**不会影响**其它线程所对应的副本。

# `ThreadLocal` 使用

```java

import java.util.concurrent.CountDownLatch;


public class MyThreadLocalStringDemo {
    private static ThreadLocal<String> threadLocal = new ThreadLocal<>();

    private String getString() {
        return threadLocal.get();
    }

    private void setString(String string) {
        threadLocal.set(string);
    }

    public static void main(String[] args) {
        int threads = 9;
        MyThreadLocalStringDemo demo = new MyThreadLocalStringDemo();
        CountDownLatch countDownLatch = new CountDownLatch(threads);
        for (int i = 0; i < threads; i++) {
            Thread thread = new Thread(() -> {
                demo.setString(Thread.currentThread().getName());
                System.out.println(demo.getString());
                countDownLatch.countDown();
            }, "thread - " + i);
            thread.start();
        }
    }

}
```

这样子，当在一个线程中使用 `ThreadLocal` 变量时，线程都会创建一份该变量的副本供该线程使用。

# 使用场景

要注意的是，`ThreadLocal` 并不是为了解决共享变量的共享数据的线程安全的。

相反的，`ThreadLocal` 是为了共享变量的数据隔离的方案。

在一些场景中，虽然多线程使用共享变量，但对这个共享变量之间的操作在逻辑上是没有依赖关系的，但是实际操作上不同线程之间对共享变量的操作让其他线程受到了影响。这时候就需要使用 `ThreadLocal` 提供数据隔离了。

当很多线程需要多次使用同一个对象，
并且需要该对象具有相同初始化值的时候最适合使用 `ThreadLocal` 。
最常见的 `ThreadLocal` 使用场景为用来解决 **数据库连接**、**Session管理**等。

# `ThreadLocal` 为什么会内存泄漏

## 原理

![](https://raw.githubusercontent.com/stormbuf/blog/main/img/resources9456652004320593558.png)

**这个 Map 是个抽象的 Map 并不是 java.util 中的 Map**
**ThreadLocalMap(即上图的Map)的生命周期跟Thread一样长**

> ThreadLocal
ThreadLocal的实现是这样的：每个Thread 维护一个 ThreadLocalMap 映射表，这个映射表的 key 是 ThreadLocal实例本身，value 是真正需要存储的 Object。
也就是说 ThreadLocal 本身并不存储值，它只是作为一个 key 来让线程从 ThreadLocalMap 获取 value。值得注意的是图中的虚线，表示 ThreadLocalMap 是使用 ThreadLocal 的弱引用作为 Key 的，弱引用的对象在 GC 时会被回收。

## `ThreadLocal` 为什么会内存泄漏

`ThreadLocalMap` 使用 `ThreadLocal` 的弱引用作为 `key` ，

如果一个 `ThreadLocal` 没有外部强引用来引用它，

那么系统 `GC` 的时候，这个 `ThreadLocal` 势必会被回收，

这样一来， `ThreadLocalMap` 中就会出现 **key** 为 **null** 的 **Entry** ，

就没有办法访问这些 **key** 为 **null** 的 **Entry** 的 **value** ，

如果当前线程再迟迟不结束的话，

这些 **key** 为 **null** 的 **Entry**的 **value** 就会一直存在一条强引用链：

`Thread Ref -> Thread -> ThreaLocalMap -> Entry -> value` 永远无法回收，

当线程迟迟无法结束，或者线程属于线程池，就可能造成内存泄漏。

其实，`ThreadLocalMap` 的设计中已经考虑到这种情况，也加上了一些防护措施：在`ThreadLocal` 的 `get()`,`set()`,`remove()` 的时候都会清除线程 `ThreadLocalMap` 里所有 **key** 为 **null** 的 **value** 。

但是这些被动的预防措施并不能保证下列情况不会内存泄漏：

- 使用 `static` 的 `ThreadLocal`，延长了 `ThreadLocal` 的生命周期，可能导致的内存泄漏。

- 分配使用了 `ThreadLocal` 又不再调用 `get()` , `set()` , `remove()` 方法，那么就会导致内存泄漏。
