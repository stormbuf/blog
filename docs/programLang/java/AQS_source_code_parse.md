# AQS源码解析
## 介绍

AQS 的全称为（AbstractQueuedSynchronizer），一个抽象类。AQS 是一个用来构建锁和同步器的框架，通过 AQS 能高效的构造出同步器。

作为用于构建锁和同步器的框架，AQS 为此提供了线程阻塞/唤醒、线程排队、获取资源失败处理等一系列公用的复杂实现，而使用者仅需要定义如何获取资源和如何释放资源的这些简单的操作。（设计模式——模板方法的应用）

AQS 的实现思路：当线程请求资源时，若资源空闲，则锁定资源，并将线程设为工作线程；若资源被占用，则将线程放入等待队列，后续排队获取资源，并为此提供了线程阻塞/唤醒和被唤醒线程锁分配的机制。

AQS 提供了两种同步方式：

- 共享式
- 独占式

使用 AQS 方式一般是根据选择的同步方式，重写以下部分或全部方法：

```java
//独占式尝试获取独占资源
protected boolean tryAcquire(int arg);
//独占式尝试释放独占资源
protected boolean tryRelease(int arg);
//共享式尝试获取共享资源
protected int tryAcquireShared(int arg);
//共享式尝试释放共享资源
protected boolean tryReleaseShared(int arg);
//资源是否被当前线程独占
protected boolean isHeldExclusively();
```

![img](https://raw.githubusercontent.com/stormbuf/blog/main/img/20210723121905.png)

![img](https://raw.githubusercontent.com/stormbuf/blog/main/img/20210723121938.png)

## 应用实例

JDK 中的应用：

- ReentrantLock
- ReentrantReadWriteLock
- Semaphore
- CountDownLatch

## 主要组成

![img](https://raw.githubusercontent.com/stormbuf/blog/main/img/CLH.png)

**state**

AQS 中的资源，一般称为同步状态。

**CLH**

CLH队列，是一个链表实现的双向队列，用以作为 AQS 中的等待队列。队列中的结点是 AQS 的内部类 `Node` ，一个节点表示一个线程。

**ConditionObject**

用于实现条件队列。

## 整体框架

![img](https://raw.githubusercontent.com/stormbuf/blog/main/img/20210723120337.png)

# Node waitStatus

| 枚举      | 含义                                           |
| --------- | ---------------------------------------------- |
| 0         | 当一个Node被初始化的时候的默认值               |
| CANCELLED | 为1，表示线程获取锁的请求已经取消了            |
| CONDITION | 为-2，表示节点在等待队列中，节点线程等待唤醒   |
| PROPAGATE | 为-3，当前线程处在SHARED情况下，该字段才会使用 |
| SIGNAL    | 为-1，表示线程已经准备好了，就等资源释放了     |

# 应用场景

| 同步工具               | 同步工具与AQS的关联                                          |
| ---------------------- | ------------------------------------------------------------ |
| ReentrantLock          | 使用AQS保存锁重复持有的次数。当一个线程获取锁时，ReentrantLock记录当前获得锁的线程标识，用于检测是否重复获取，以及错误线程试图解锁操作时异常情况的处理。 |
| Semaphore              | 使用AQS同步状态来保存信号量的当前计数。tryRelease会增加计数，acquireShared会减少计数。 |
| CountDownLatch         | 使用AQS同步状态来表示计数。计数为0时，所有的Acquire操作（CountDownLatch的await方法）才可以通过。 |
| ReentrantReadWriteLock | 使用AQS同步状态中的16位保存写锁持有的次数，剩下的16位用于保存读锁的持有次数。 |
| ThreadPoolExecutor     | Worker利用AQS同步状态实现对独占线程变量的设置（tryAcquire和tryRelease）。 |

# 条件队列Condition

![img](http://img.stormbuf.top/20210723151704.png)

```java
// ========== 阻塞 ==========

// 造成当前线程在接到信号或被中断之前一直处于等待状态,调用的时候会将当前node释放锁或从CLH队列中移除。
void await() throws InterruptedException; 

// 造成当前线程在接到信号之前一直处于等待状态。【注意：该方法对中断不敏感】。
void awaitUninterruptibly(); 

// 造成当前线程在接到信号、被中断或到达指定等待时间之前一直处于等待状态。
// 返回值表示剩余时间，如果在`nanosTimeout` 之前唤醒，那么返回值 `= nanosTimeout - 消耗时间` ，如果返回值 `<= 0` ,则可以认定它已经超时了。
long awaitNanos(long nanosTimeout) throws InterruptedException; 

// 造成当前线程在接到信号、被中断或到达指定等待时间之前一直处于等待状态。
// 如果没有到指定时间就被通知，则返回 true ，否则表示到了指定时间，返回返回 false 。
boolean await(long time, TimeUnit unit) throws InterruptedException; 

// 造成当前线程在接到信号、被中断或到达指定最后期限之前一直处于等待状态。
// 如果没有到指定时间就被通知，则返回 true ，否则表示到了指定时间，返回返回 false 。
boolean awaitUntil(Date deadline) throws InterruptedException; 


// ========== 唤醒 ==========

// 唤醒一个等待线程。该线程从等待方法返回前必须获得与Condition相关的锁。
void signal(); 

// 唤醒所有等待线程。能够从等待方法返回的线程必须获得与Condition相关的锁。
void signalAll(); 
```