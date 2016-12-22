import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Util from "extend/common/util";
import RequestUtil from "extend/common/RequestUtil";
import WeixinUtil from "extend/common/WeixinUtil";
import Tab from 'components/Tab/Tab';
import List from 'components/List/list'
import CacheController from 'extend/cache/CacheController';
import Notification from 'components/Notification/Notification.jsx'
import Slider from 'components/Slide/Slider.jsx'
import 'scss/base.scss';
import 'scss/PrdtList/index.scss';

// import TabItems from "data/PrdtListTabItems.json"
// import CardList0 from "data/PrdtCardList.json"
// import CardList1 from "data/PrdtCardList1.json"
// import CardList2 from "data/PrdtCardList2.json"

class MyComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			tabTree: {
				activeIndex : 0,
				items: []
			},
			currentTabItems: [], // 存放当前展示的tab对象，后期做滚动加载
			currentSortIndex: 0,
			enter: false,  //提示信息显示
			message: null,  //提示信息显示内容
		};
	}

	componentDidMount () {
		const that = this;
		WeixinUtil.hideWeixinMenu();
		let param = {
			url : `item/getCategoryOfShop?shopId=${590}`,
			method : 'GET',
			successFn : function (result) {
				/**
				 * review_不惑_1201:
				 *
				 * FIXME:
				 * 	1. 不要用result.code == 0的逻辑判断
				 * 	2. 如果要作判断，尽量使用严格等===作比较
				 * 	3. 如果没有用到返回值，不需要return，隐式return undefined即可
				 *  这块在RequestUtil里有个isResultSuccessful的方法，请自查
				 *
				 * TIPS:
				 *  使用函数作状态的判断，维护者阅读会更友好
				 *
				 */   
                if (result.code == 0) {              	
                    // let newItems = result.result.sortItem;
                    return that.getTabItems(result.result);

                }else{
					that.setErrorMessage({message: result.message});
                }
			},
			errorFn : function () {
				that.setErrorMessage({message: "获取购物车数据商品信息失败"});
			}
		};

		return RequestUtil.fetch(param);
	}

	getTabItems(tabItems) {
		/**
		 * review_不惑_1201:
		 *
		 * FIXME:
		 * 	1. 代码要适当地分段增加可读性
		 * 	2. 第一段的map做的是数据的适配处理，有两种方式：
		 * 		a. 直接在map函数里返回新的适配结构，适用于轻量数据
		 * 		b. 通过new一个适配器的形式生成新结构，如new CategoryAdaptor(subItem).getData()，适用于量级大的数据，因为可能会涉及多个数据实体的适配
		 * 		   这块见extend/adaptor里的相关适配器实现
		 * 	3. items要做合法性校验， items[0]不一定存在，因此可能会报错
		 *  4. 凡是getXXX的方法，都应该要有返回值；凡是setXXX的方法，都不应该有返回值。这段代码中除了get还有set的逻辑，意义不明确
		 *     应该叫initTabItems，或者resetTabItems，然后在该方法内分便调用
		 *     可以这样实现:  
		 *     
		 *     resetTabItems(tabItems) {
		 *     	  setTabItems(getTabItems(tabItems));
		 *     }
		 *
		 * 	   getTabItems(tabItems) {
		 * 	   	return tabItems.map((item, index) => {
		 * 	   		let subTabs = item.categoryDTOList.map( subitem => {
		 *				return {
		 *					label: subitem.name,
		 *					status: subitem.id,
		 *				}
		 *			})
		 *			return {
		 *				label: item.name,
		 *				status: item.id,
		 *				display: true,
		 *				items: subTabs
		 *			}
		 * 	   	});
		 * 	   }
		 *
		 * 	   setTabItems(tabItems) {
		 * 	   	let tabTree = {
					activeIndex : 0,
					tabItems,
				};

				let currentTabItems = tabItems.length ? 
									  that.getCurrentTabEmptyArray(tabItems[0].items) :
									  [];
				
				this.setState({
					tabTree,
					currentTabItems,
				}, () => {
					that.setSubPrdtList(0, 0);
				});
		 * 	   };
		 */ 
		const that = this;
		let items = tabItems.map( (item,index) => {
			let subTabs = item.categoryDTOList.map( subitem => {
				return {
					label: subitem.name,
					status: subitem.id,
				}
			})
			return {
				label: item.name,
				status: item.id,
				display: true,
				items: subTabs
			}
		});
		let tabTree = {
			activeIndex : 0,
			items,
		};
		let currentTabItems = that.getCurrentTabEmptyArray(items[0].items);
		this.setState({
			tabTree,
			currentTabItems
		}, () => that.setSubPrdtList(0, 0) );
	}

	getCurrentTabEmptyArray(tabItems) {
		/**
		 * review_不惑_1201:
		 *
		 * FIXME:
		 * 	这块直接 return new Array(tabItems.length); 更简洁，因为len变量并没有做其它处理
		 */
		let len = tabItems.length;
		return new Array(len);
	}

	setSubPrdtList (topIndex = 0, subIndex = 0) {
		/**
		 * review_不惑_1201:
		 *
		 * FIXME:
		 *   1. 一个变量在代码段中使用超过两次，就要缓存下来，以有意义的名字替代，这样有两个明显的好处
		 *   	a. 代码更简洁、清晰，一处修改整体生效
		 *   	b. 在js的嵌套属性查询或是涉及dom操作的部分，缓存中间结果将会大大提升查询效率
		 *   2. get请求不需要将参数加在url后边，通过data域添加，这样减少拼错的概率
		 *   3. 和缓存相关实现的我们可以统一以下步骤
		 *   	首先判断相应的key是否在缓存内
		 *   	  i. 命中，以缓存的值为输入调用后续逻辑
		 *        ii. 未命中，获取缓存 -> 写缓存 -> 调用后续逻辑
		 *      得到数据的后续的逻辑可以统一声明一个函数处理处理
		 *
		 * 	 可以这么实现:
		 *
		 *   // 设置二级菜单下的商品列表
		 * 	 setSubPrdtList(topIndex = 0, subIndex = 0) {
		 * 	 	// 变量赋值
		 *   	let that = this;
		 *   	let currentState = that.state;
		 * 	 	let {items: tabTree} = currentState.tabTree;
		 * 	 	let currentTopTab = tabTree[topIndex];
	     *   	let topTabId = currentTopTab.status;
	     *   	let subTabId = currentTopTab.items[subIndex].status;
		 * 	 	const cachedKey = `PrdtList_${topTabId}_${subTabId}`;
		 *
		 * 		// 业务逻辑处理
		 *  	let execSetSubPrdtList = () => {
		 * 			let clonedCurrentTabItems = Util.deepClone(currentState.currentTabItems);
		 * 		 	let prdtListData = CacheController.getFromCache(cacheKey);
		 * 		  	clonedCurrentTabItems[subIndex] = prdtListData;
		 *
		 * 			that.setState({
		 * 				currentTabItems: clonedCurrentTabItems,
		 * 		 	});
		 * 		};
		 * 		
		 * 		if (!CacheController.isInCache(cacheKey)) {
		 * 			return that.resetPrdtListData({
		 * 				subTabId: subTabId,
		 * 			}, (data) => {
		 * 				CacheController.storeInCache(cachedKey, that.proccessPrdtListData(data));
		 * 				
		 *              execSetSubPrdtList();
		 * 			});
		 * 		}
		 *
		 * 		execSetSubPrdtList();
		 * 	 }
		 *
		 *  // 处理商品列表的数据，这里只需要简单返回，如果有适配处理也统一在这进行
		 *  proccessPrdtListData(data) {
		 *  	let {prdtListData} = data;
		 *  	return prdtListData;
		 *  }
		 *
		 *  // 重置二级菜单下的商品列表
		 * 	resetPrdtListData(options = {}, callback) {
		 * 		let {subTabId} = options;
		 * 		return this.getPrdtListData(subTabId, (data) => {
		 * 			callback && callback(data);
		 * 		});
		 * 	}
		 *
		 * // 获取二级菜单下的商品列表数据
		 * getPrdtListData(options = {}, callback) {
		 *  let {subTabId} = options;
		 * 	let param = {
		 *		url: `item/getShopPrdtList`,
		 *		data: {
		 *			categoryId: subTabId,
		 *			shopId: 590,
		 *			sortType: 0,
		 *			fromId: 1,
		 *		},
		 *		method: 'GET',
		 *		successFn: (data) => {
	     *          if (RequestUtil.isResultSuccessful(data)) {      	
	     *              callback && callback(data.result);
	     *           }else{
		 *				that.setErrorMessage({message: data.message});
	     *           }
		 *		},
		 *		errorFn: () => {
		 *			this.setErrorMessage({message: "获取商品信息失败"});
		 *		},
		 *	};
         *
		 *	RequestUtil.fetch(param);
		 * }
		 *
		 */
		let that = this;
		//　定义一个状态数组，用于映射拼团和单独购买的子状态
        let {items: tabTree} = that.state.tabTree,
        	topTabId = tabTree[topIndex].status,
        	subTabId = tabTree[topIndex].items[subIndex].status;

		const cacheKey = `PrdtList_${topTabId}_${subTabId}`;
        
        let clonedCurrentTabItems = Util.deepClone(that.state.currentTabItems);

        if(CacheController.isInCache(cacheKey)) {	//若已有缓存数据，则从缓存读取
        	clonedCurrentTabItems[subIndex] = CacheController.getFromCache(cacheKey);
        	return that.setState( {currentTabItems: clonedCurrentTabItems} );
        }
		let param = {
			url : `item/getShopPrdtList?categoryId=${subTabId}&shopId=${590}&sortType=${0}&fromId=${1}`,
			method : 'GET',
			successFn : function (result) {                
                if (result.code == 0) {              	
                    let newItem = result.result.prdtList;
					clonedCurrentTabItems[subIndex] = newItem;
		            CacheController.storeInCache(cacheKey, newItem);
		            return that.setState( {currentTabItems: clonedCurrentTabItems} );

                }else{
					that.setErrorMessage({message: result.message});
                }
			},
			errorFn : function () {
				that.setErrorMessage({message: "获取商品信息失败"});
			}
		};

		return RequestUtil.fetch(param);
	}

	handleTabChange(item, index) {
		/**
		 * review_不惑_1201:
		 *
		 * FIXME:
		 * 	1. clonedTabTree.items要做合法性校验
		 */
		let ctx = this.context;
		let clonedTabTree = Util.deepClone(ctx.state.tabTree);

		clonedTabTree.activeIndex = index;

		let currentTabItems = ctx.getCurrentTabEmptyArray(clonedTabTree.items[clonedTabTree.activeIndex].items);

		ctx.setState({
			tabTree : clonedTabTree,
			currentTabItems,
			currentSortIndex: 0
		}, () => ctx.setSubPrdtList(clonedTabTree.activeIndex, 0)
		);
	}

	setSortIndex(index) {
		this.setState({
			currentSortIndex: index,
		});
		this.setSubPrdtList(this.state.tabTree.activeIndex, index);
	}

  /**
   * 设置提示信息并显示
   * @param {[Object]} data [{message："提示信息"}]
   */
  setErrorMessage(data) {
    let message = data&&data.message || "获取商品信息失败"
    this.setState({
      message: message,
      submitStatus: 0
    }, function () {
      this.enter();
    }.bind(this))
  }

  /**
   * 提示组件Notification消失
   * @return {[type]} [description]
   */
  leave() {
    this.setState({
      enter: false
    });
  }

  /**
   * 提示组件Notification出现，2s后自动消失
   * @return {[type]} [description]
   */
  enter() {
    this.setState({
      enter: true
    });
    setTimeout(function () {
      this.leave()
    }.bind(this), 2000)
  }

	render () {
		/**
		 * review_不惑_1201:
		 *
		 * FIXME:
		 * 	这段可读性太差了，主要存在以下几个问题:
		 *  	a. 没有适当地分段，为代码块做一个功能性的区分，如赋值部分、数据适配部分、数据运算部分
		 * 		b. 不要在一行内写所有的逻辑判断、属性，这块应属于代码规范部分，一行太长的话影响阅读
		 * 		c. activeTab.length > 1可以直接用activeTab.length由js引擎做判断，这块应属于代码规范部分
		 * 		d. sortTabs的赋值可以提取成一个函数加以实现
		 * 		e. 赋值在代码规范中不建议用逗号运算符来一次赋值，这样容易因中间赋值出错时发生断路
		 * 		f. 字符串用TemplateString或单引号引用即可，这块应属于代码规范部分
		 *  
		 */
		const that = this;
		let {tabTree, currentTabItems} = this.state;
			
		let tabActiveIndex = tabTree.activeIndex,
			tabItems = tabTree.items;
		let tabStatus = tabItems.map(function (item, index){
			return item.label;
		}).filter(function (item) {
			return !item.display;
		});
		let activeTab = tabTree.items[tabActiveIndex],
			// sortTabs = Util.isExisty(activeTab)  && activeTab.items.map( (item,index) => {
			sortTabs = Util.isExisty(activeTab) && activeTab.length > 1 && activeTab.items.map( (item,index) => {
			let activeSortTab = that.state.currentSortIndex == index ? " active" : "";
			return <div className={"sortTab" + activeSortTab} onClick={that.setSortIndex.bind(that,index)} key={index}>{item.label}</div>
		});
		return (
			<div className="m-prdtlist">
				<div className="m-header">
					<Tab tabs={tabStatus} 
						activeIndex={tabActiveIndex}
						context={that}
						handleItemClick={this.handleTabChange}
					/>
					<div className="sort-tab">{sortTabs}</div>
				</div>
				<div className="m-body">
					<Slider itemList={this.state.currentTabItems} setShowIndex={that.setSortIndex.bind(this)} showIndex={that.state.currentSortIndex}>
						<List/>
					</Slider>
				</div>
				<div className="m-footer"></div>
				<Notification enter={this.state.enter} leave={this.leave.bind(this)}>{this.state.message}</Notification>
			</div>
		)
	}
}


function doRender () {
	ReactDOM.render(<MyComponent /> , document.getElementById("app"));
}

setTimeout(doRender, 16);