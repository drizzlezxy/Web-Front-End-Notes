# DOM
## 节点的概念
### 1. 节点的类型
```js
Node.ELEMENT_NODE 			// 1
Node.ATTRIBUTE_NODE			// 2
Node.TEXT_NODE				// 3
Node.CDATA_SECTION_NODE		// 4
Node.ENTITY_REFERENCE_NODE	// 5
Node.ENTITY_NODE			// 6
Node.PROCESSING_INSTRUCTION_NODE	// 7
Node.COMMENT_NODE			// 8
Node.DOCUMENT_NODE			// 9
Node.DOCUMENT_TYPE_NODE		// 10
Node.DOCUMENT_FRAGMENT_NODE	// 11
Node.NOTATION_NODE			// 12
```
### 2. 节点的关系
![元素节点关系](./img/NodeRelation.png)

### 3. 操作节点
#### a. 将新的节点添加到DOM中
- parentNode.appendChild(newNode)
	在父节点[parentNode]的childNodes列表末尾添加一个节点[newNode]
- parentNode.inserBefore(newNode, childNode)
	在父节点[parentNode]的指定子节点[childNode]前插入一个节点[newNode]  
	若第二个参数为null，则插入在末尾，效果同appendChild()
- parentNode.replaceChild(newNode, childNode)
	用子节点[newNode]取代原有的子节点[otherNode]

以上三个方法：
均会返回插入的newNode以供操作。

```js
var returnedNode = parentNode.appendChild(newNode);
```
若[newNode]是DOM中的现有节点，则该节点不会在DOM中出现两次。该节点移动到新的指定位置后，原位置的节点会被删除。

#### b. 移除节点
-  parentNode.removeChild(childNode)

#### c. 复制节点
- someNode.cloneNode([boolean])
	复制现有的节点，传入的boolean表是否深克隆（深克隆会将该节点以及其子节点一同复制，浅克隆则只复制该节点本身）。
	复制后还需要通过`appendChild()`或`insertBefore()`或`replaceChild()`使其占据DOM中的具体位置

## Document类型节点
我们平时js中所用的ducument对象，就是12种节点中的DOCUMENT_NODE的一个实例，值为9，表示整个HTML页面。
- 特殊子节点
	+ `<html>`元素
		document.documentElement
	+ `<body>`元素
		document.body
	+ `<title>`元素  
		document.title
- 文档信息
	其实就是该文档的HTTP请求中的一些信息，只不过可以通过js访问。
	+ URL地址
		`document.URL` 完整URL
	+ domain
		`document.domain` 主机域名
	+ referrer
		`document.referrer` 来源页面的URL
- 查找元素
	+ `document.getElementById()`
		返回id属性(attribute)与之匹配的唯一元素节点。
		若多个元素拥有相同的id，则返回第一个。
	+ `document.getElementsByTagName(tagName)`
		其中，tagName不区分大小写。
		返回一个类数组对象，包含所有标签名相匹配的元素节点。
		```html
		<img name="img1st" src="" alt=""/>
		<img name="img2nd" src="" alt=""/>
		<img name="img3rd" src="" alt=""/>
		<script>
			let imgs = document.getElementsByTagName('img')
			
			// 直接从类数组对象中获取
			imgs[0];

			// 若元素有name属性，也可利用该属性的值获取
			imgs['img1st'];
		</script>
		```
	+ `document.getElementsByName(name)`
		根据元素的name属性取得所有匹配的元素的类数组对象。
	+ HTML5中扩展了一种方法`document.getElementsByClassName`
- 创建元素
	`document.createElement('div')`
	括号中传入tagName，大小写均可。
	创建元素之后，必须再用`appendChild()`或`insertBefore()`或`replaceChild()`方法将其插入文本流中。


## Element类型节点
HTML中的元素都直接或间接的继承自ELEMENT_NODE(值为1)
- 标准特性(attribute)
	```html
	<div id="myDiv" class="bd" title="Body text" lang="en" dir="ltr"></div>
	```
	对于HTML元素的标准特性，可以用以下方式直接进行读写
<table>
  <tr><th>DOM方法</th>              <th>对应HTML特性(attribute)</th></tr>
  <tr><td>someElement.id</td>       <td>id="myDiv"</td>             </tr>
  <tr><td>someElement.className</td><td>class="bd"</td>             </tr>
  <tr><td>someElement.title</td>    <td>title="Body text"</td>      </tr>
  <tr><td>someElement.lang</td>     <td>lang="en"</td>              </tr>
  <tr><td>someElement.dir</td>      <td>dir="ltr"</td>              </tr>
</table>
- 其他特性(包含自定义特性)
	以下三个方法可以HTML元素所有的特性进行访问。
	*注： attrName和value均为字符串*
	+ someElement.getAttribute(attrName)
	+ someElement.setAttribute(attrName,value)
	+ someElement.removeAttribute(attrName)  
