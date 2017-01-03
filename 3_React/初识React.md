# 初识React 
![MacDown logo](./img/logo.ico)  
首先，React 起源于 Facebook 的内部项目，是热门的前端框架之一。  
React 入门的门槛其实很低，推荐阅读 **阮一峰** 的 《React 入门实例教程》，之后就会对React框架有一个大体的概念。  
然后就可以根据自己的需要查阅[官方文档](https://facebook.github.io/react/docs/components-and-props.html)，获取各部分的内容。  

## 组件的状态和属性
可以这么说，一个 React 应用就是构建在 **React 组件(component)** 之上的。  

React 组件有两个核心概念：  

* state  
  组件的当前状态，可以把组件简单看成一个“状态机”，根据状态 state 呈现不同的 UI 展示。  
  也就是根据 state 的前后差异 (后面会提到的diff算法) 去刷新组建。  
  一旦状态 (state) 更改 (通过 `this.setState()` 方法来触发)，组件就会自动调用 render 重新渲染 UI.
* props  
  即为组件的属性，由调用当前组建的父层组建传入。  
  在组建内，我们只对其进行"读"操作 (`this.props.属性名`)，而不进行"写"操作。  

## 组建生命周期的概念
![React Components Lifecycle](./img/ReactComponentsLifecycle.jpeg)  
**组建生命周期** 主要有以下三种情况：

* mount 
* update 
* unmount 

### mount 装载  
React component 被 render 解析生成对应的 DOM 节点，并被插入 HTML 页面的 DOM 结构的一个过程。  
当这个过程结束时，组件的状态就是 **mounted** 。  
### update 更新
指一个已经被mounted的组件被重新render的过程。  
当这个过程结束时，组件的状态是 **updated** 。  
而这个重新选染的过程，并不一定会引起相应 DOM 结构的改变。React 会对当前组件的 **当前 state** 与最近一次变更前的 state进行比较，只有当state确实发生改变，且确实影响到 DOM 结构时，相应的 DOM 结构才会被刷新。
### unmount 移除  
mount的逆过程，即一个已经被mounted的组件对应的 DOM 节点，被从 DOM 结构中一除的过程。

## 组建生命周期对应的hook函数
React 对组件的每一个状态，都封装了相应的hook函数。在对特定的状态进行hook后，每个状态发生时，hook函数就能在第一时间对该状态作出相应。  
针对之前提到的 mount 、 update 、 unmount 三种情况，React都封装了将要 (will) 、已经(Did)两种状态。
![Lifecycle](./img/Lifecycle.jpeg)

### 1. mounting
* componentWillMount  
  组件开始 mounting 前被调用  
  
  ```jsx
	componentWillMount: () => {
	  // your bode here
	}
  ```
* componentDidMount()
  组件 mounted 之后被调用  
  
  ```jsx
	componentDidMount: () => {
	  // your bode here
	}
  ```
* 在这两者之间，组件会被 render 出来

### 2. updating
* componentWillUpdate  
  组件开始 updating 前被调用
  
* componentDidUpdate  
  组件 updated 之后被调用
  
* 在以上两者之间，组件会被重新 render  
  但是是什么因素使得React知道当前已加载的组件需要更新的呢，这时候就需要一下两组hook方法。
  
* componentWillReceiveProps  
  组件加载完成之后再 **每次** 收到 props 参数时，都会触发该hook函数。  
  它传入的参数就是本次新收到的 props 对象。可在函数内 根据新的 props 进行一些操作，比如修改 state 。  
  
  ```jsx
	componentWillReceiveProps: (newProps) => {
	  // your bode here
	}
  ```
  
* shouldComponentUpdate   
  在组建收到新的 props 或者变更 state 之后，shouldComponentUpdate方法会被调用。
  它的参数有两个： 新的 props 对象、 新的 state 对象。  
  可根据这两个参数去判断是否需要更新 DOM 结构。  
  
  ```jsx
	shouldComponentUpdate: (newProps) => {
	  // your bode here
	  return true; // or false
	}
  ```
  当该方法返回 true 时， DOM 结构会被更新。  
  当该方法返回 false 时， DOM 结构则不更新。  
  **若不重写该方法，则默认返回 true 。**
  
### 3. unmounting
* componentWillUnmount
  销毁组件前，该方法会被调用。  
  可在此处做一些数据清理工作。












