* # code review 总结  

	* ## 代码规范
		* 判断时，尽量使用严格等于 `===`  
			比如：  
			我们对ajax请求返回的数据状态码 `result.code` 进行判断时，尽量使用 `result.code === 0`  
			因为 `==` 会进行强制类型转换，而 `===` 则不会，避免了因强制类型转换而造成的误判。
		* 

	* ## 代码语义化
		* 使用函数作状态的判断，维护者阅读会更友好    
			比如：  
			**代码规范** 中提到的对ajax请求返回的数据状态码 `result.code`进行判断，更好的做法是将其封装为一个通用的方法：
				
				let isResultSuccessful = (result) => {  
					return isExisty(result) && isExisty(result.code) && result.code == '0';
					// isExisty为验证传入参数是否存在的方法
				}
			这样，阅读者能够更加顺畅的理解代码。
		* 
				
