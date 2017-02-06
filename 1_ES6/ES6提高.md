# ES6 

## 目录

> Symbol 数据类型  
> Set 和 Map 数据结构

## Symbol 数据类型

### 基本概念
JavaScript语言的第七种数据类型，Symbol值通过Symbol函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的Symbol类型。凡是属性名属于Symbol类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。  
注：前六种是Undefined、Null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。  

```js
let s = Symbol();

typeof s
// "symbol"
```

### 作为属性名
```js
let mySymbol = Symbol();

// 第一种写法
var a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
var a = {  [mySymbol]: 'Hello!' };

// 第三种写法
var a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"  
```
#### Object.getOwnPropertySymbols() 方法获取对象symbol属性名
用Symbol值作为属性名时，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。但是，它也不是私有属性，有一个`Object.getOwnPropertySymbols`方法，可以获取指定对象的所有 Symbol 属性名。
`Object.getOwnPropertySymbols`方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。  

```js
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

	```js
	var s1 = Symbol.for('foo');
	var s2 = Symbol.for('foo');
	
	s1 === s2 // true
	```
	它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有，就返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。

2. Symbol.keyFor()  
	`Symbol.for()`与`Symbol()`这两种写法，都会生成新的Symbol。它们的区别是，前者会被登记在 *全局环境* 中供搜索，后者不会。
	而`Symbol.keyFor`方法返回一个已经登记的Symbol类型值的key。
	
	```js
	var s1 = Symbol.for('foo');
	Symbol.keyFor('s1'); // "foo"
	
	var s2 = Symbol('foo');
	Symbol.keyFor(s2) // undefined
	```

## Set 和 Map 数据结构

### 1. Set结构
#### 基本概念
Set本身是一个构造函数，用来生成一种新的数据结构Set。Set数据结构类似于数组，但是成员的值都是唯一的，没有重复的值。

```js
const s = new Set([11, 22]);

[2, 3, 5, 4, 5, 2, 2].forEach(x => s.add(x));

for(let i of s) {
	console.log(i);
}
// 11 22 2 3 5 4

s.size // 6
```  
上面的代码可以看出  
1. Set函数可以接受一个数组（或类似数组的对象）作为参数，用来初始化。  
2. 可以通过`add`方法想Set结构添加成员，但重复的值不会被添加。  

#### Set实例的属性
- `Set.prototype.constructor`: 构造函数，默认就是Set函数
- `Set.prototype.size`： 返回`Set`实例的成员总数

#### Set实例的方法
我们可以将实例的方法分为两类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。  

- 操作方法   

	```js
	// add方法，添加某个值，并返回Set结构本身
	s.add(1).add(2).add(2);
	// 注意2被加入了两次
	
	s.size // 2
	
	// has方法，判断该值是否为Set的成员，返回一个布尔值
	s.has(1) // true
	s.has(2) // true
	s.has(3) // false
	
	// delete方法，删除某个值，返回的布尔值表示是否删除成功
	s.delete(2); // true
	s.delete(3); // false
	
	s.has(2) // false
	
	// clear方法，清除所有成员，没有返回值
	s.clear();
	```
	另外，`Array.from`方法可以将Set结构转为数组
	
	```js
	var items = new Set([1,2,5]);
	var arr = Array.from(items);
		
	// 另一种转换的方式
	arr = [...new Set([1,2,5])] // [1, 2, 5]
	```

- 遍历方法  
	Set结构的实例有第四个遍历方法，遍历顺序就是插入顺序。这个特性有时非常有用，比如使用Set保存一个回调函数列表，调用时就能保证按照添加顺序调用。
	
	+ `keys()`: 返回键名的遍历器
	+ `values()`: 返回键值的遍历器，但由于Set结构的键名就是键值，所以该方法和values完全一致。
	+ `entries()`: 返回键值对的遍历器
	+ `forEach()`: 使用回调函数遍历每个成员,用法与数组一致

	```js
	let set = new Set(['red', 'green', 'blue']);
	
	// keys方法（values方法的结果也相同）
	for(let item of set.keys()) {
		console.log(item);
	}
	// red
	// green
	// blue
	
	// entries方法
	for(let item of set.entries()) {
		console.log(item)
	}
	// ["red", "red"]
	// ["green", "green"]
	// ["blue", "blue"]
	```

### 2. Map结构
JavaScript的对象（Object），本质上是键值对的集合，但只能用字符串当作键。
Map结构的键则不限于字符串，各种类型都可以当作键。
如果说Object提供了“字符串-值”的对应关系，Map结构则提供了“值-值”的对应关系。

```js
var n1 = {name:'n1'};
var n2 = {name:'n2'};
var m = new Map([
	[n1,{value:'value1'}],
	[n2,[1]],
]);

console.log(m); 
// Map {Object {name: "n1"} => Object {value: "value1"}, Object {name: "n2"} => [1]}
```
- size属性，可获取成员数
- `set()`方法，可添加Map中的键值对，返回结构本身
- `get()`方法，返回对应键的值 或 undefined

	```js
	let o = {};
	m.set(o, ["content"]);
	m.get(o); // ["content"]
	```

- `has()`方法，返回布尔值，判断结构中是否有对应的键
- `delete()`方法，返回布尔值，表示是否成功删除
- `clear()`方法，清除所有成员，没有返回值

+ `keys()`: 返回键名的遍历器
+ `values()`: 返回键值的遍历器
+ `entries()`: 返回键值对的遍历器
+ `forEach()`: 使用回调函数遍历每个成员,用法与数组一致  
*注：Map的遍历顺序就是插入顺序*