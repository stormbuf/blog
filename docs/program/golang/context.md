# Go Context
## 背景

在 go 中开一个goroutine非常方便，但是会存在这么一个问题。如果一个goroutine迟迟没有结束运行，在goroutine外，我们没有办法终结这个goroutine。为此需要使用一些方法让我们在goroutine外依然能控制goroutine。

## chan 通知

示例

```
func main() {
  stop := make(chan bool)

  go func() {
    for {
      select {
      case <-stop:
        fmt.Println("监控退出，停止了...")
        return
      default:
        fmt.Println("goroutine监控中...")
        time.Sleep(2 * time.Second)
      }
    }
  }()

  time.Sleep(10 * time.Second)
  fmt.Println("可以了，通知监控停止")
  stop<- true
  //为了检测监控过是否停止，如果没有监控输出，就表示停止了
  time.Sleep(5 * time.Second)

}
```

可以通过chan+select的方式去关闭goroutine。这对于少量goroutine是可行的。但是对于大量的goroutine，甚至嵌套的goroutine（比如goroutine里发起goroutine），就需要大量的chan变量。这显然不优雅，会令并发控制变得繁重杂乱。

## Context接口

Context 是官方提供的另一个控制并发的方法。同样与select搭配使用，但更优雅。

特点

1. 有层次，树状结构，能很好的匹配嵌套goroutine的结构，以此实现控制
2. 提供了更丰富功能
    1. 定时取消
    2. 超时取消
    3. 并发安全
    4. 通过特殊子 context传递参数 

### 接口分析

```
type Context interface {
  // 返回 context 被取消的时间，多配合定时取消/超时取消
  // 若没有设置取消时间，则 ok == false
  Deadline() (deadline time.Time, ok bool)
  // 返回接收到的取消信号。返回类型是一个只读的结构体chan.
  // 收到返回值本身就代表则接收到取消信号。
  Done() <-chan struct{}
  // 返回取消的错误原因，因为什么Context被取消。
  Err() error
  // 返回制定key的value，配合传递参数的子context使用
  Value(key interface{}) interface{}
}
```

go 内置了2个默认实现。通常作为context的根节点。

一个是`Background`，主要用于main函数、初始化以及测试代码中，作为Context这个树结构的最顶层的Context，也就是根Context。

一个是`TODO`,它目前还不知道具体的使用场景，如果我们不知道该使用什么Context的时候，可以使用这个。

他们两个本质上都是`emptyCtx`结构体类型，是一个不可取消，没有设置截止时间，没有携带任何值的Context。

### context的使用

当取消一个context时，该节点的context以及其子context都会收到取消信号。

通过使用context都是通过继承（更恰当的说法是组合，不过我偏不这么说）。每一个子goroutine配一个子context。当然，如果想要一个context控制多个子goroutine，那就没必要继承了，直接把自身传过去。

#### 继承context的方法

```
func WithCancel(parent Context) (ctx Context, cancel CancelFunc)
func WithDeadline(parent Context, deadline time.Time) (Context, CancelFunc)
func WithTimeout(parent Context, timeout time.Duration) (Context, CancelFunc)
func WithValue(parent Context, key, val interface{}) Context
```

这四个with方法都需要传父context。

`WithCancel` 返回子context以及CancelFunc函数。

**正是通过CancelFunc函数在goroutine外取消context。**

`WithDeadline`定时取消，传入一个指定时间点。但到达这个时间点时，自动取消context。但是也可以通过CancelFunc函数提前取消。

`WithTimeout`超时取消，传入一个时间间隔。比如100 ms，从继承完成起，如果过去了100 ms则自动取消context。

`WithValue`没有取消函数，通过子函数向goroutine传递参数。`Context.Value()`获取的就是该子context传递的参数。

### Context 使用原则

1. 不要把Context放在结构体中，要以参数的方式传递
2. 以Context作为参数的函数方法，应该把Context作为第一个参数，放在第一位。变量名建议统一为ctx。
3. 给一个函数方法传递Context的时候，不要传递nil，如果不知道传递什么，就使用context.TODO
4. Context的Value相关方法应该传递必须的数据，不要什么数据都使用这个传递