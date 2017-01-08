# 如何在浏览器中控制地址(history)的后退(回退)
在项目中遇到会遇到一些情况，需要控制回退的地址，不能任它直接回退到到上一地址。大概查了网上的一些资料，以下是其中一种方式。

## 基础
js中有history对象。
window.history 对象包含浏览器的历史。
当A页面跳转至B页面时，A的地址会被压入历史列表栈中(即栈中不会保留当前页面的地址)。

	history.back() 相当于在浏览器中点击后退按钮
	history.forward() 相当于在浏览器中点击前进按钮
	history.go(-2) 相当于返回历史列表栈中倒数第二个地址


## 控制地址(history)的后退(回退)
由于安全原因javascript不允许修改history里已有的url链接。

### js提供了popstate事件监测从history栈里弹出url
	        window.addEventListener('popstate', (e) => {
	            alert('我监听到了浏览器的返回按钮事件，此处可以添加自己的处理');
	        },false)

但虽然我们监听到了后退事件，但是页面已经跳转到了上一页面，那么当前页面中的处理就并不能被执行。  
所以我们需要以下步骤将页面留在当前页面:

### 使用pushState方法往history里增加当前url地址，使得回退时从栈中弹出的url地址即为当前页面的地址。
            let state = {
                title: 'thisPage',
                url: location.href,
            };
            window.history.pushState(state, state.title, state.url);

## 完整的代码	
        let pushHistory = () => {
            let state = {
                title: 'thisPage',
                url: location.href,
            };
            window.history.pushState(state, state.title, state.url);
        }
        
        pushHistory();
        window.addEventListener('popstate', (e) => {
            alert('我监听到了浏览器的返回按钮事件，此处可以添加自己的处理');
        },false)

这样就可以在用户用户点击回退按钮时，做出自己的“个性化定制”处理。

## Tips：
虽然javascript不允许修改history里已有的url链接，也无法访问栈中的值，但document.referrer属性可返回载入当前文档的文档的 URL。  
如果当前文档不是通过超级链接访问的，则为 null。  

它的实质是访问 HTTP 引用头部：   
	HTTP请求中有一个referer的报文头，用来指明当前流量的来源参考页。例如在www.sina.com.cn/sports/上点击一个链接到达cctv.com首页，那么就referrer就是www.sina.com.cn/sports/了。而我们就可以通过document.referrer属性来访问这个值。
	但在一些特殊情况下referrer的值会丢失(这部分没有验证，需要使用的同学需先谨慎地查阅资料验证一下)。

