* # code review 总结（prdtList.jsx）  

	* ## 代码规范
	
		* 判断时，尽量使用严格等于 `===`  
			比如：  
			我们对ajax请求返回的数据状态码 `result.code` 进行判断时，尽量使用 `result.code === 0`  
			因为 `==` 会进行强制类型转换，而 `===` 则不会，避免了因强制类型转换而造成的误判。

		* 数据合法性校验  
			当我们需要取得某个数据下的一个值(如 `item.skuList[index].id.skuId` )时,需要确保：  

			1. item不为空    
			2. skuList是一个数组  
			3. skuList[index]不为空  
			4. skuList[index]中的id不为空    
		
			否则对 `item.skuList[index].id.skuId` 取值时，就会报错，所以需要验证数据的合法性。
			有些情况下可以从逻辑上确保以上4个条件一定满足，当无法保证时，应校验数据合法性：
				
			```	jsx
			let skuId;
					
			isExisty(item) && 
			isArray(item.skuList) && 
			isExisty(item.skuList[index]) && 
			isExisty(item.skuList[index].id) && 
			(skuId = item.skuList[index].id.skuId)
			```
 
		* 代码要尽量保持简洁  
			比如：
				
			```jsx
			let getCurrentTabEmptyArray = (tabItems) => {
				let len = tabItems.length;
				return new Array(len);
				//这块直接 return new Array(tabItems.length); 更简洁，因为len变量并没有做其它处理
			}
			```

		* 代码一定要适当的进行分段，增加可读性  

			```jsx
			let func = () => {
				// 定义部分 
				let a = 0;
				let b = 1;
				
				// 数据处理部分
				a += b;
				
				// 输出部分
				return a;
			}
			```

		* 不要在一行内写所有的逻辑判断、属性  
			一行太长的话影响阅读。

		* 赋值在代码规范中不建议用逗号运算符来一次赋值  
			这样容易因中间赋值出错时发生断路。

		* 变量缓存  
			一个变量在代码段中使用超过两次，就要缓存下来，以有意义的名字替代。  
			1. 代码更简洁、清晰，一处修改整体生效
			2. 在js的嵌套属性查询或是涉及dom操作的部分，缓存中间结果将会大大提升查询效率。 像JQuery中的查询操作，每次查询都需要重新遍历dom树，若不缓存会很影响性能。

	* ## 代码语义化
		* 使用函数作状态的判断，维护者阅读会更友好    
			比如：  
			**代码规范** 中提到的对ajax请求返回的数据状态码 `result.code`进行判断，更好的做法是将其封装为一个通用的方法：
			
			```jsx				
			let isResultSuccessful = (result) => {  
				return isExisty(result) && isExisty(result.code) && result.code == '0';
				// isExisty为验证传入参数是否存在的方法
			}
			```
			这样，阅读者能够更加顺畅的理解代码。
		* getXXX方法，setXXX方法，initXXX或resetXXX方法
			从函数名就可以了解函数的作用，所以一般情况下：
			* getXXX方法中，都应该要有返回值
			* setXXX的方法，都不应该有返回值，而是设置值
			* initXXX或resetXXX方法，包含了以上两个过程  
		
			比如：
			
			```jsx
			let prdtData; 
					
			// 一定要有返回值
			let getData = () => {
				return {
					skuPrice: 1, 
					skuId: 1008, 
					poSkuId:320,
				}
			}
				
			// 不应有返回值，而是在设置值
			let setData = ({skuPrice, skuId}) => {
				prdtData = {
					price: skuPrice,
					id: skuId,
				}
			}
			
				
			let resetData = () => {
				setData(getData())
			}
			```

	
	* ## 数据适配处理
		* 我们获取到的数据(比如从AJAX获取)，与页面中做需要的数据结构经常是有出入的，那么这个时候就需要对数据进行适配处理。  
			适配处理有两种方式：  
			1. 直接在当前模块中返回新的适配结构，适用于轻量数据, 如一下情况：  
			
				```jsx
					// 假设获取的数据为data
					let data = [
						{
							skuPrice: 1, 
							skuId: 1008, 
							poSkuId:320
						},{
							skuPrice: 100, 
							skuId: 1009, 
							poSkuId:321
						},{
							skuPrice: 99, 
							skuId: 1010, 
							poSkuId:322
						}
					];

					//但data的数据结构不符合要求，要重新适配
					let newData = data.map( (item, index) => {
						let {skuPrice, skuId, poSkuId} = item;
						return {
							skuPrice,
							id: {
								skuId,
								poSkuId
							}
						}
					})
				```

			2. 通过new一个适配器的形式生成新结构，因为可能会涉及多个数据实体的适配，适用于量级大、或通用性强的数据
					
				```jsx
					// 在CategoryAdaptor中处理数据
					new CategoryAdaptor(subItem).getData()
				```

	* ## 数据缓存至本地(cache)
	
		1. 首先判断相应的key是否在缓存内  
		 	i. 若命中，以缓存的值为输入调用后续逻辑  
			ii. 若未命中，获取缓存 -> 写缓存 -> 调用后续逻辑  
		2. 得到数据的后续的逻辑可以统一声明一个函数处理处理