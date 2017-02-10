# ES6 学习笔记（二）

## 目录

> 1. Symbol 数据类型  
> 2. Set 和 Map 数据结构  
> 3. 对象操作之 Proxy代理器  
> 4. 对象操作之 Reflect
> 5. Promise 对象

## 1. Symbol 数据类型

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

## 2. Set 和 Map 数据结构

### 2.1 Set结构
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

### 2.2 Map结构
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


## 3. 对象操作之 Proxy代理器

### 基本概念
Proxy 用于修改某些操作的默认行为，等同于在语言层面做出修改，即对编程语言进行编程。
  
ES6 原生提供 Proxy 构造函数，用来生成 Proxy 实例。

```js
var proxy = new Proxy(target, handler);
```  
以理解成，在目标对象`target`之前架设一层“拦截”`handler`，来定制拦截行为。外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。  
其中`target`、`handler`都是对象。

下面是另一个拦截读取属性(get)行为的例子。

```js
var a = {title: 'my demo'};
// Proxy接受两个参数
var proxy = new Proxy(
  // 第一个参数是所要代理的目标对象
  a, 
  // 第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作
  {
    get: function(target, propertyName) {
      console.log('target:', target);
      console.log('propertyName:', propertyName);
      // 可以看到，由于拦截函数总是返回35，所以访问任何属性都得到35
      return 35;
    }
  }
);

proxy.time
// target: Object {title: "my demo"}
// propertyName: time
//35
```  

*注意:  
要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是对象a）进行操作。*

### Proxy支持的拦截操作
Proxy所支持的拦截操作以粗略列在下表中，具体操作可自行Google

	|	所拦截的操作	|	含义
----|---------------|------
1   |	get(target, propKey, receiver)	|	拦截对象属性的读取，<br>比如`proxy.foo`和`proxy['foo']`。<br>最后一个参数receiver是一个对象，可选
2	|	set(target, propKey, value, receiver)	|	拦截对象属性的设置，比如`proxy.foo = v`或<br>`proxy['foo'] = v`，返回一个布尔值。
3	|	has(target, propKey)	|	拦截`propKey in proxy`的操作，返回一个布尔值。
4	|	deleteProperty(target, propKey)	|	拦截delete proxy[propKey]的操作，返回一个布尔值。
5	|	ownKeys(target)	|	拦截`Object.getOwnPropertyNames(proxy)`、<br>`Object.getOwnPropertySymbols(proxy)`、<br>`Object.keys(proxy)`，<br>返回一个数组。该方法返回目标对象所有自身的属性的属性名，<br>而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
6	|	getOwnPropertyDescriptor(target, propKey)	|	拦截<br>`Object.getOwnPropertyDescriptor(proxy,propKey)`，<br>返回属性的描述对象。
7	|	defineProperty(target, propKey, propDesc)	|	拦截<br>`Object.defineProperty(proxy,propKey,propDesc）`、<br>`Object.defineProperties(proxy, propDescs)`，<br>返回一个布尔值。
8	|	preventExtensions(target)	|	拦截`Object.preventExtensions(proxy)`，<br>返回一个布尔值。
9	|	getPrototypeOf(target)	|	拦截`Object.getPrototypeOf(proxy)`，<br>返回一个对象。
10	|	isExtensible(target)	|	拦截`Object.isExtensible(proxy)`，<br>返回一个布尔值。
11	|	setPrototypeOf(target, proto)	|	拦截`Object.setPrototypeOf(proxy, proto)`，<br>返回一个布尔值。<br>如果目标对象是函数，那么还有两种额外操作可以拦截。
12	|	apply(target, object, args)	|	拦截Proxy实例作为函数调用的操作，<br>比如`proxy(...args)`、<br>`proxy.call(object, ...args)`、<br>`proxy.apply(...)`。
13	|	construct(target, args)	|	拦截Proxy实例作为构造函数调用的操作，<br>比如`new proxy(...args)`。

### Proxy.revocable() 拒绝访问的实例
`Proxy.revocable`方法返回一个Proxy实例，但该实例的属性可设置为拒绝访问。

```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```
`Proxy.revocable`方法返回一个对象，包含两个属性：
- proxy属性 是该Proxy的一个实例
- revoke属性 是一个方法，执行该方法后，proxy实例的属性会被拒绝访问

`Proxy.revocable`的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。


## 4. 对象操作之 Reflect

### 基本概念
Reflect对象也是ES6为了操作对象而提供的新的API，它有13个和Proxy一一对应的静态方法属性（见上一节中Proxy支持的拦截操作，`Reflect.defineProperty()`等）。

### 作用
设计Reflect对象，有以下这些目的：  

1. 将Object对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到Reflect对象上。现阶段，某些方法同时在Object和Reflect对象上部署，未来的新方法将只部署在Reflect对象上。也就是说，从Reflect对象上可以拿到语言内部的方法。
2. 修改某些Object方法的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回false。

	```js
	// 老写法
	try {
	  Object.defineProperty(target, property, attributes);
	  // success
	} catch (e) {
	  // failure
	}
	
	// ES6
	if (Reflect.defineProperty(target, property, attributes)) {
	  // success
	} else {
	  // failure
	}
	```
3. 让Object操作都变成函数行为。某些Object操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。
4. 
	```js
	// 老写法
	'assign' in Object // true
	
	// 新写法
	Reflect.has(Object, 'assign') // true
	```
4. 与Proxy对象的方法一一对应，可以为Proxy的拦截行为保留原有的默认行为。
5. 
	```js
	var target = {title: 'my demo'};
	
	var proxy = new Proxy(target, {
		set: function(target, name, value, receiver) {
			var success = Reflect.set(target, name, value, receiver);
			if(success) {
				console.log('property ' + name + ' on ' + target + ' set to ' + value);
			}
			// your code here
			return success;
		}
	})
	```
	上面代码中，Proxy方法拦截target对象的属性赋值行为(set)。而先用Reflect.set方法可以先确保完成默认的属性赋值行为，然后在部署额外的功能。

## 5. Promise 对象

### 基本概念
Promise是异步编程的一种解决方案。其实简单来说Promise就是一个容器，这个容器有三种状态：
- Pending (进行中)
- Resolved (已完成)
- Rejected (已失败)

状态的改变只有两种可能：从 Pending 变为 Resolved 或 从 Pending 变为 Rejected。

```js
function successFun(value) {
	console.log(value)
}

function errorFun(value) {
	console.error(value)
}

var promise = new Promise((resolve, reject) => {
	if ( /* 异步操作成功 */ ) {
		resolve('操作成功了！'); // 该参数会被传给successFun
	} else {
		reject('操作失败了');// 该参数会被传给errorFun
	}
})

promise.then(successFun, errorFun);
```
可以看到，Promise对象是一个构造函数，可用来生成实例（promise）。  
构造函数接受一个函数作为参数，该函数会接收两个参数(resolve, reject)，它们是两个函数，由JavaScript引擎提供，不用自己部署，在异步操作成功时调用：
resolve会将promise的状态变为resolved；
reject会将promise的状态变为Rejected。  

当`promise.then`执行时，该方法接受两个回调函数(successFun、errorFun)作为参数，它们分别是Resolved状态和Rejected状态的回调函数。

### Promise.prototype.then()
Promide的实例有then方法
```js
new Promise((resolve, reject) => {
	resolve('成功');
}).then(
	() => {},
	() => {}
) // Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: undefined}
```
而`then()`方法会返回个新的Promise实例，因此可以采用链式的写法，即then方法后面再调用另一个then方法。
若在第一次的回调函数中返回一个新的Promise实例（否则默认返回一个resolved状态的新的Promise实例），则第二个then方法属于这个新的Promise实例。
```js
var i = 1;
var getJSON = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve('success 第' + (i++) + '次'), 5000)
	})
}
getJSON().then(
	(val) => {
		console.log(val);
		return getJSON();
	},
	(val) => {
		console.log('1failed');
	}
).then(
	(val) => {
		console.log(val);
	},
	(val) => {
		console.log('2failed');
	}
)
```
以上例子可以看到，第一个then方法指定的回调函数，返回的是另一个Promise对象。这时，第二个then方法指定的回调函数，就会等待这个新的Promise对象状态发生变化，从而输出结果。

### Promise.prototype.catch()

