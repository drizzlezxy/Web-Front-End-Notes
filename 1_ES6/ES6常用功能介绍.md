# ES6常用功能介绍

------
  + ### 概念
    - #### ECMAScript  
      1996年11月，JavaScript的创造者将JavaScript提交给国际标准化组织ECMA，希望这种语言能够成为国际标准。  
次年，ECMA发布262号标准文件（ECMA-262）的第一版，规定了浏览器脚本语言的标准，并将这种语言称为ECMAScript，这个版本就是1.0版。
**ECMAScript 和 JavaScript：前者是后者的规范，后者是前者的一种实现。**
    - #### ES6 (ECMAScript 6)  
      2015年6月正式发布《ECMAScript 2015标准》(简称ES2015)。  
之后每年的6月份发布一个更新版本(6.1版,6.2版……)，**ES6泛指ES2015、ES2016这些新版本**
    - #### Babel转码器  
      虽然各大浏览器的最新版本对ES6的支持度越来越高，但考虑到现有环境对ES6的支持有限，我们可以用ES6的方式编写程序，再用转码器将ES6的语法转为ES5去执行。  
Babel就是这样一个被广泛使用的ES6转码器(ES6 -> ES5)。

------
  + ### let 和 const
    - #### let  
      **JavaScript没有块级作用域的概念**  
      JavaScript的作用域：全局，局部(函数块)  

            if(1){
            	var a = 10;
            	let b = 10;
            } 
            console.log(a); //10  
            console.log(b); //ReferenceError: b is not defined(…)
        1. let命令用法类似于var，但所声明的变量只在let所在的代码块中有效 (let实际上为JavaScript新增了块级作用域)。  
        2. 同一作用域，不允许重复声明。  
        `{ let a = 10; { let a = 20; } }`  
        内层作用域可以覆盖外层同名定义。  
        3. 顶层对象的属性:    
        
                var a = 10;
                let b = 10;
                
                window.a    //10
                window.b    //undefined
            原本，全局变量等同于顶层对象的属性。  
            ES6中，let、const、class声明的全局变量，不属于顶层对象的属性。从ES6开始，全局变量将逐步与顶层对象的属性脱钩。  
            
    - #### const
            const PI = 3.1415926;  
        1. 声明一个只读的常量。一旦声明，常量的值就不能改变。
        2. 作用域与let命令相同：只在声明所在的块级作用域内有效。
        
------
  + ### 变量的解构赋值  
    从数组和对象中提取值，对变量进行赋值  
    - #### 数组  
        ##### 基本用法

            let [ , , , a, b] = [5, 6, 7, 8];
            //a = 7, b = undefined  
            
          let [c, [d]] = [1, 2];
            //报错
        前后结构必须一致 
    
        ##### 默认值  
            let [x, y = 'b'] = ['a']; 
            // x='a', y='b'
        
        注意，ES6内部使用严格相等运算符（===），判断一个位置是否有值。所以，如果一个数组成员不严格等于undefined，默认值是不会生效的。  
        
            var [x = 1] = [undefined]; 
            // x = 1  
            
          var [x = 1] = [null]; 
            // x = null  
            
    - #### 对象
        ##### 基本用法
        
            let { first, insert, second} = { first: [], second: {}}  
            //first = [], insert = undefined, second = {}
        对象的属性没有次序，变量必须与属性同名，才能取到正确的值。  
        如果变量名与属性名不一致，必须写成下面这样：  
        
            var { foo: baz } = { foo: 'aaa', bar: 'bbb' }; 
            // baz : "aaa"
            
        ##### 默认值
        默认值生效的条件是，对象的属性值严格等于undefined。  
        
            var {x = 3} = {x: undefined}; 
            // x = 3  
            
            var {x = 3} = {x: null};
            // x = null
            
        ##### 注意，对已经声明的变量用于解构赋值
        当` let { x } = { x: 1}` 时，是重新声明了x变量，并进行赋值。  
        错误的写法：`{x} = {x: 1};`  
        JS引擎会将`{x}`理解成一个代码块，从而发生语法错误。只有不将大括号写在行首，避免JavaScript将其解释为代码块，才能解决这个问题：`({x} = {x: 1});`
            
------
  + ### 模板字符串
    传统的JavaScript语言，输出模板通常是这样写的。  

        $('#result').append(
            'There are <b>' + basket.count + '</b> ' 
            + 'items in your basket, ' + '<em>' +  
            basket.onSale + '</em> are on sale!'  
        );
        
    ES6：
    
        $('#result').append(`  
            There are <b>${basket.count}</b> items  
            in your basket, <em>${basket.onSale}</em>
            are on sale!  
        `);
    模板字符串（template string）是增强版的字符串。  
    1. **用反引号 ` 标识**  
        字符串中需要使用反引号，则前面要用反斜杠转义。  
    2. **可以用来定义多行字符串**  
        所有的空格和缩进都会被保留在输出之中。  
    3. **${变量}**  
        可以在字符串中嵌入变量，括号内部可以放入任意的JavaScript表达式，可以进行运算，引用对象属性，以及调用函数。
        
------
  + ### 数组的扩展
    - #### Array.from()  
        将类数组对象转为真正的数组  

            let arrayLike = {
            '0': 'a',
            '1': 'b',
            '2': 'c',
            length: 3
            };
            // ES5的写法
            var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
            
            // ES6的写法
            let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
        实际应用中，常见的类似数组的对象是DOM操作返回的NodeList集合，以及函数内部的arguments对象。Array.from都可以将它们转为真正的数组。
        `Array.from()`实际有三个参数：
        * 类数组对象
        * map函数：对每个元素进行处理，将处理后的值放入返回的数组
        * 来绑定map函数中的this关键字  
                
                Array.from(arrayLike, function(item, index){
                //对每个元素进行处理
                }, this)
    
    -  #### 数组的空位
        * ##### 空位不是undefined
        `[ , , , ]`该数组中有4个空位，与`[undefined, undefined, undefined, undefined]`不同。
        * ##### ES5 对空位的处理
          + forEach(), filter(), every() 和some()都会跳过空位。
          + map()会跳过空位，但会保留这个值。 
          + join()和toString()会将空位视为undefined，而undefined和null会被处理成空字符串。
        * ##### ES6 对空位的处理
            明确将空位转为undefined。  
            如：Array.from方法会将数组的空位，转为undefined，也就是说，这个方法不会忽略空位。  
            
                Array.from(['a',,'b']) // [ "a", undefined, "b" ]
                ['a',,'b'].map(item => item) //[ "a", , "b" ]
    
------
  + ### 函数的扩展
    - #### 函数参数的默认值
      * 基本用法  
      	
				function func(x = 0, y = 0) {
                	console.log('x=',x,'y=',y);
            	}
            	func(5); //x= 5 y= 0
      * 结合解构赋值  
        函数参数的解构赋值其实就是对数组、对象解构赋值的应用。  
        
            	function add([x, y], {i, j = '默认值'}) {
                	//x = 1, y = [3, 4]
                	//i = {}, j = '默认值'
            	}
            	add([1, [3, 4] ], { i: {}, y: 5})
    - #### rest参数
            function add(param1, param2, ...values) {
	            //param1 = 1,
	            //param2 = 2,
	            //param1 = [3, 4, 5]
            }
            add(1,2,3,4,5);
        * 将多余的参数放入数组values中。  
        * rest参数必须是最后一个参数。
        * 用剩余参数代替arguments。
        * 仅用于形参中！
        
    - #### 扩展运算符... (spread)  
        相当于rest参数的逆运算，将数组转为逗号分隔的参数序列。

            console.log(1, ...[2, 3, 4], 5)
            // 1 2 3 4 5
        **可代替数组的apply方法** 将数组拆分传入
        
            // ES5的写法
            function f(x, y, z) {
              // ...
            }
            var args = [0, 1, 2];
            f.apply(null, args);
          
            // ES6的写法
            function f(x, y, z) {
              // ...
            }
            var args = [0, 1, 2];
            f(...args);
    
    - #### 严格模式
        * 当函数参数使用默认值 or 解构赋值 or rest参数 or 扩展运算符时，函数内部就不能'use strict'，否则会报错。（原因：执行顺序）  
        * 解决方式：  
            1. 全局使用'use strict'
            2. 利用立即执行函数：
            
                    const func = ( 
                      'use strict' 
                      return function(value = 42){
                        //内部函数可使用默认值 or 解构赋值 or rest参数 or 扩展运算符
                      }
                    )()
    
    - #### 箭头函数 () => {}
        * ##### 基本用法
                var func = v => y // 等同于var func = function(v) { return v; }
            多于一个参数 或 没有参数时，要用`()`将参数包裹起来。  
            代码块部分多余一条语句时，要用`{}`将代码块包裹起来。  
                
                var func = (a, b) => { a += 1, b += 2; return a+b; }
        * ##### 注意点
            1. ##### this对象的指向是可变的，但是在箭头函数中，它是固定的。  
                this指向固定化，实际原因是箭头函数没有自己的this，故内部的this就是外层代码的this。  
                箭头函数可以让setTimeout里面的this，绑定**定义时**所在的作用域，而不是指向运行时所在的作用域。  
                
                    function Timer() {
                        this.s1 = 0;
                        this.s2 = 0;
                        setInterval(() => this.s1++, 1000);	
                        // 箭头函数
                        setInterval(function () { this.s2++;  }, 1000);	
                        // 普通函数 s2指向全局的变量s2
                    }
                    var timer = new Timer();
                    setTimeout(() => console.log('s1: ', timer.s1), 3100); // s1: 3
                    setTimeout(() => console.log('s2: ', timer.s2), 3100); // s2: 0
                    
------
  + ### class
    JavaScript语言的传统方法是通过构造函数，定义并生成新对象。

        function Point(x, y) {
          this.x = x;
          this.y = y;
        }
        
        Point.prototype.toString = function () {
          return '(' + this.x + ', ' + this.y + ')';
        };
        
        var p = new Point(1, 2);
        
    ES6提供了更接近传统语言(C++,Java)的写法，引入了Class（类）这个概念，作为对象的模板。
    - #### ES5的构造函数Point，对应ES6的Point类的构造方法(constructor)。
    - #### class的方法(toString)。
        定义“类”的方法的时候，前面不需要加上function这个关键字。  
        方法之间不需要逗号分隔，加了会报错。
        
            //定义类
            class Point {
                constructor(x, y) {
                    this.x = x;
                    this.y = y;
                }
            
                toString() {
                    return '(' + this.x + ', ' + this.y + ')';
                }
            }
            
            var p = new Point(1, 2);
    - #### 继承
    
            class ColorPoint extends Point { 
	            //ColorPoint类通过extends关键字，继承了Point类的所有属性和方法
	            constructor(x, y, color) {
	              this.color = color; 
	              // 报错，此时子类还未继承父类的this对象
	              super(x, y); 
	              // 通过super(x,y)调用父类的constructor(x, y)
	              this.color = color;
	              //正确
	            }
	            
	            toString() {
	              return this.color + ' ' + super.toString(); // 调用父类的toString()
	            }
            }
        **注意：**  
        子类必须在constructor方法中调用super方法，否则新建实例时会报错。这是因为子类没有自己的this对象，而是继承父类的this对象，然后对其进行加工。如果不调用super方法，子类就得不到this对象。
    - #### Class的静态方法 
        类相当于实例的原型，所有在类中定义的方法，都会被实例继承。如果在一个方法前，加上static关键字，就表示该方法不会被实例继承，而是直接通过类来调用，这就称为“静态方法”。
        
            class Foo {
	            static classMethod() {
	              return 'hello';
	            }
            }
            
            Foo.classMethod() // 'hello'
        父类的静态方法，可以被子类继承。
        
  + ### Module
    一个模块就是一个独立的文件。该文件内部的所有变量，外部无法获取。  
    模块功能主要由两个命令构成：export和import。  
    - #### 输出：  
      如果希望外部能够读取模块内部的某个变量，就必须使用export关键字暴露该接口。
        
              export function multiply(x, y) {
	            return x * y;
	          };
	
	          export function plus(x, y) {
	            return x + y;
	          };
	          
	          export default function subtractive(x, y) { 
	            // export default 默认输出，函数名无效
	            return x - y;
	          };
        
      
    - #### 引入： 
      import引入其他模块提供的功能。
        
            import calc from './calculation' // 导入默认的输出
            import {multiply, plus} // 导入multiply, plus