# stormbuf 周刊 ( 1 ) ：Github Copilot 使用初体验

## Github Copilot 使用初体验
28 号早上起床习惯性刷了下邮箱，没想到收到了 GitHub 给的「新年礼物」— GitHub Copilot。

目前 copilot 以插件的形式支持三款编辑器/IDE：

1.  vscode
2.  jetbrains
3.  neovim

copilot 可以通过关键词、注释，联系上下文提供一些代码段建议，准确率可以说高的离谱。

具体的使用可以参考 [copilot-docs](https://github.com/github/copilot-docs) 。

Golang 中没有并发安全的 map，通常都要手动实现或引入第三方库。

下面是通过 copilot 实现的并发安全的 map，全部代码只键入了 `Tab`、`Alt`+`]/[` 、`func`、`type` 和一行注释。

```go
// ConcurrentMap is a thread-safe map.
type ConcurrentMap struct {
  sync.RWMutex
  items map [interface{}]interface{}
}

func New ( ) *ConcurrentMap {
  return &ConcurrentMap{items: make ( map [interface{}]interface{} )}
}

func ( m *ConcurrentMap ) Set ( key interface{}, value interface{} ) {
  m.Lock ( )
  m.items [key] = value
  m.Unlock ( )
}

func ( m *ConcurrentMap ) Get ( key interface{} ) interface{} {
  m.RLock ( )
  v := m.items [key]
  m.RUnlock ( )
  return v
}

func ( m *ConcurrentMap ) Remove ( key interface{} ) {
  m.Lock ( )
  delete ( m.items, key )
  m.Unlock ( )
}

func ( m *ConcurrentMap ) Items ( ) map [interface{}]interface{} {
  return m.items
}

func ( m *ConcurrentMap ) Count ( ) int {
  return len ( m.items )
}

func ( m *ConcurrentMap ) Clear ( ) {
  m.Lock ( )
  m.items = make ( map [interface{}]interface{} )
  m.Unlock ( )
}

func ( m *ConcurrentMap ) IsEmpty ( ) bool {
  return len ( m.items ) == 0
}

func ( m *ConcurrentMap ) Contains ( key interface{} ) bool {
  m.RLock ( )
  _, ok := m.items [key]
  m.RUnlock ( )
  return ok
}
```

使用过程中，发现 copilot 不仅仅能生成代码，还能生成文本。比如上述的注释里，我只键入了 `// ConcurrentMap` ，其余是通过 copilot 的建议补全。
