* # code review 总结（prdtList.jsx）  

	* ## 代码规范
		* 判断时，尽量使用严格等于 `===`  
			比如：  
			我们对ajax请求返回的数据状态码 `result.code` 进行判断时，尽量使用 `result.code === 0`  
			因为 `==` 会进行强制类型转换，而 `===` 则不会，避免了因强制类型转换而造成的误判。
		* 代码一定要适当的进行分段，增加可读性  
		
				let func = () => {
					// 定义部分 
					let a = 0;
					let b = 1;
				
					// 数据处理部分
					a += b;
				
					// 输出部分
					return a;
				}
		* 数据合法性校验  
		当我们需要取得某个数据下的一个值(如 `item.skuList[index].id.skuId` )时,需要确保：  
			1. item不为空    
			2. skuList是一个数组  
			3. skuList[index]不为空  
			4. skuList[index]中的id不为空    
	
		否则对 `item.skuList[index].id.skuId` 取值时，就会报错，所以需要验证数据的合法性。
		有些情况下可以从逻辑上确保以上4个条件一定满足，当无法保证时，应校验数据合法性：

			let skuId;
				
			isExisty(item) && 
			isArray(item.skuList) && 
			isExisty(item.skuList[index]) && 
			isExisty(item.skuList[index].id) && 
			(skuId = item.skuList[index].id.skuId) 

	* ## 代码语义化
		* 使用函数作状态的判断，维护者阅读会更友好    
			比如：  
			**代码规范** 中提到的对ajax请求返回的数据状态码 `result.code`进行判断，更好的做法是将其封装为一个通用的方法：
				
				let isResultSuccessful = (result) => {  
					return isExisty(result) && isExisty(result.code) && result.code == '0';
					// isExisty为验证传入参数是否存在的方法
				}
			这样，阅读者能够更加顺畅的理解代码。
		* getXXX方法，setXXX方法，initXXX或resetXXX方法
			从函数名就可以了解函数的作用，所以一般情况下：
			* getXXX方法中，都应该要有返回值
			* setXXX的方法，都不应该有返回值，而是设置值
			* initXXX或resetXXX方法，包含了以上两个过程  
		
			比如：

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

	
	* ## 数据适配处理
		* 我们获取到的数据(比如从AJAX获取)，与页面中做需要的数据结构经常是有出入的，那么这个时候就需要对数据进行适配处理。  
			适配处理有两种方式：  
			1. 直接在当前模块中返回新的适配结构，适用于轻量数据, 如一下情况：  

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

			2. 通过new一个适配器的形式生成新结构，因为可能会涉及多个数据实体的适配，适用于量级大、或通用性强的数据
				
					// 在CategoryAdaptor中处理数据
					new CategoryAdaptor(subItem).getData()
