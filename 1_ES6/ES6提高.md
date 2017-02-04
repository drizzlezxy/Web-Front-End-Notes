# ES6 


## Symbol

### 基本概念

### 作为属性名
#### 用法

```
let mySymbol = Symbol();

// 第一种写法
var a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
var a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
var a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"  
```
#### Object.getOwnPropertySymbols()
用Symbol值作为属性名时，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。但是，它也不是私有属性，有一个`Object.getOwnPropertySymbols`方法，可以获取指定对象的所有 Symbol 属性名。
`Object.getOwnPropertySymbols`方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
```
var obj = {};

var a = Symbol("a");
var b = Symbol("b");

obj = {
	[a]: 'Hello',
	[b]: 'World',
}

for (var i in obj) {
  console.log(i); // 无输出
}

Object.getOwnPropertyNames(obj)
// []

Object.getOwnPropertySymbols(obj)
// [Symbol(a),Symbol(b)]
```

### Symbol.for() 和 Symbol.keyFor()
1. Symbol.for()  
有时，我们希望重新使用同一个Symbol值，`Symbol.for`方法可以做到这一点。  
```
var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

s1 === s2 // true
```
它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有，就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。

2. Symbol.keyFor()
`Symbol.for()`与`Symbol()`这两种写法，都会生成新的Symbol。它们的区别是，前者会被登记在 *全局环境* 中供搜索，后者不会。
而`Symbol.keyFor`方法返回一个已经登记的Symbol类型值的key。
```
var s1 = Symbol.for('foo');
Symbol.keyFor('s1'); // "foo"

var s2 = Symbol('foo');
Symbol.keyFor(s2) // undefined
```