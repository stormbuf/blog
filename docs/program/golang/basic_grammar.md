# 基本语法
Go 是一门静态语言。

# 基本类型

Go 的 基本类型有

```go
布尔类型：bool

字符串：string

// 后面的数字代表该类型占多少位
// uint 和 int 占多少位取决于 CPU ，如果是32位CPU就是4个字节(32位)，如果是64位就是8个字节(64位)

有符号整形：int  int8  int16  int32  int64

无符号整形：uint uint8 uint16 uint32 uint64 uintptr

                  byte // uint8 的别名

                  rune // int32 的别名， 代表一个Unicode码点

浮点数：float32 float64

复数：complex64 complex128
```

## 什么是string

> 参考文档[Go系列 string、bytes、rune的区别](https://juejin.im/post/5c1a2db5f265da61682b52f5) -- Randal

go语言有以下两种表示字符串的方法：

- 双引号，如：“gogogo\n”，使用转义字符

- 反引号，如：`gogogo\n`，不使用转义字符，字符串的内容将和赋值保持严格一致

> Go语言中，string就是只读的采用utf8编码的字节切片(slice) 因此用len函数获取到的长度并不是字符个数，而是字节个数。 for循环遍历输出的也是各个字节。

因此如果以`string[i]` 只拿到一个字节，对于多字节表示的文字来说就会出现乱码。

## rune

**rune是int32的别名，代表字符的Unicode编码，采用4个字节存储。**

对于上述问题，可以将string转成rune，这意味着任何一个字符都用4个字节来存储其unicode值，这样每次 `遍历` 或 `rune[i]` **取值**的时候返回的就是**unicode值**，而**不再是字节**了，这样就可以解决乱码问题了。

```go
s := "汉字"
for _, v := range s {
//使用 range 遍历。这时 v 就是 rune 类型，自然就不会出现乱码问题
        fmt.Printf("%c", v)

    }
```

# 声明&赋值&类型推导

## 作用域

> 参考[GoLang 变量作用域](https://segmentfault.com/a/1190000012214571) --luxixing

在 Golang 中，变量作用域分为：

- 本地局部变量

- 全局变量

- 参数变量

### 本地局部变量

> 定义：在函数或者在语义块(if/for等)中定义的变量

生效范围：定义在函数里面则在整个函数范围有效; 定义在语义块，则在整个语义块生效

### 全局变量

> 定义：函数外部定义的变量都属于全局变量；全局变量声明必须以 var 开头

生效范围：当前 package 内,如果想要其他 package 访问，全局变量以大写开头

### 参数变量

> 定义：函数调用时传递的变量

生效范围：函数范围（但是有可能会可变传入参数的值，取决于传递的参数的类型）

## 变量

Go 使用 `var` 声明变量，变量类型放置在变量名后面。
变量在定义时没有明确的初始化时会赋值为**零值**。

零值：
数值类型为 `0`，
布尔类型为 `false`，
字符串为 `""`（空字符串）。
零值为nil(即null)：

- 指针

- 切片

- map

- chan

- error

- func

```go
var a int          
var b = 5  // 声明+复制

b++ //Go 中只有 b++，没有 ++b

//多变量声明
var i,j,k int  
var i,j,k int =1,2,3  //多变量声明+赋值，=号后依次赋值
or
var (
      d int
      e float32
        )
        
var (
      d int=2
      e float32=12345.5
        )
        

//类型推导
a := 5  //Go 会根据赋值推导出该变量的类型
```

`:=` **无法用于声明全局变量**

### 类型转换

**Go 里没有隐式转换，只有显式转换**

```go
表达式 T(v) 将值 v 转换为类型 `T`。

一些关于数值的转换：

var i int = 42
var f float64 = float64(i)
var u uint = uint(f)
或者，更加简单的形式：

i := 42
f := float64(i)
u := uint(f)
```

## 常量

Go 使用 `const` 声明常量，变量类型放置在变量名后面

```go
const a int = 10
  //a=20       //常量不允许修改。会报编译错误：cannot assign to a

const b = 20.345  // 不写类型，也能自动判断出类型，注意：常量声明赋值 无需用:= ，只用等于号即可。

const (
    c=2
    d=3.5    //常量 d 没有使用，没报错
)
```

# 访问权限

在 Go 里这被称为`可导出性`。
除了内置类型外，区别就在于类型名称的首字母是否大写

- 大写 -- 可导出性

- 小写 -- 不可导出性

# 分支

即 `if`、`switch`

## if

```go
//if只支持一个初始化语句，初始化语句与判断语句以;分割。 初始化语句也可以拿出来单独赋值。

  if s := "马"; s == "马云" {
    fmt.Printf("阿里巴巴\n")
  }else if s == "马化腾" {
        s ="云"
    fmt.Printf("腾讯\n")
  }else{
    fmt.Printf("xxx\n")
  }
```

## switch

```go
switch time.Saturday {
  case today + 0:
    fmt.Println("Today.")
  case today + 1:
        fmt.Println("Tomorrow.")
        fallthrough
  case today + 2:
    fmt.Println("In two days.")
  default:
    fmt.Println("Too far away.")
  }
```

`fallthrough`： 当 **case** `today + 1` 后，不管下面的分支是否 **case** ，都会执行分支内的语句

**没有条件的 switch：**

这一构造使得可以用更清晰的形式来编写长的 if-then-else 链。

```go
t := time.Now()
  switch {
  case t.Hour() < 12:
    fmt.Println("Good morning!")
  case t.Hour() < 17:
    fmt.Println("Good afternoon.")
  default:
    fmt.Println("Good evening.")
  }

```

# 循环

Go 里没有 **while**、**do while** ，只有 **for**。
虽然没有 **while** ，但是 **for** 集成了 **while** 作用。

## 用法一

```go
sum := 0
  for i := 0; i < 10; i++ {
    sum += i
  }
```

## 用法二

**死循环**

```go
//不写条件 就是 死循环 
  for {
  }
```

## 用法三

```go
sum := 1
  for ; sum < 1000; {
    sum += sum
  }
  fmt.Println(sum)
}
```

## 用法四

跟 **while** 一样

```go
sum := 1
  for sum < 1000 {
    sum += sum
    }
```

# 函数

函数使用 `func` 定义 ，可以没有参数或接受多个参数，可以没有返回值或返回多个返回值。
返回值可声明变量，在函数内使用。
参数类型和返回值类型在变量名*之后*。

```go
//参数
func add(x int, y int) int {
  return x + y
}

func add(x, y int) int {
  return x + y
}
//无返回值
func add(x, y int) {
  //dosomthing
}
//返回值
func add(x, y int) int {
  return x + y
}

func add(x, y int) (a int) {
    a = 10//函数内使用
  return x + y+a
}

func add(x, y int) (int,int) {
  return x + y,1
}
func add(x, y int) (a int,b int) {
  return x + y,1
}

// return == return a,b
func add(x, y int) (a int,b int) {
    a = x+y
    b = 1
  return 
}
```

# import

导包

```go
//单个包
import "fmt"

//多个包
import "fmt"
import "math/rand"
or
import (
  "fmt"
  "math/rand"
)
```