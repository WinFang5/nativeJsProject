// 引入模块
import { load } from "/web/util/LoadView.js"

load("topbar-news") //加载topbar

// 监听搜索框，监听input事件，根据输入的内容对后端发送模糊查询的get请求，返回数据，渲染到页面
search.oninput = async function () {
  if (search.value === "") {
    document.querySelector(".list-group").innerHTML = ""
    return 
  }

  let res = await fetch(`http://localhost:5000/news?title_like=${search.value}`).then(res => res.json())
  console.log(res)
  document.querySelector(".list-group").innerHTML = res.map(item => `
  <li class="list-group-item"><a href="/web/views/details/index.html">${item.title}</a></li>
  `).join("")
}

// 离开搜索框(失去焦点），隐藏搜索结果
search.onblur = function () {
  // 防止在点击搜索结果的时候（也算离开搜索框），还没来得及跳转就隐藏了搜索结果，设置一下延迟
  setTimeout(() => {
    document.querySelector(".list-group").style.display = "none"
  },300)
}

// 进入搜索框，显示搜索结果
search.onfocus = function () {
  document.querySelector(".list-group").style.display = "block"
}

let list = [] //做成全局变量，方便其他函数调用
// render()渲染新闻列表
async function render() {
  await renderList() 
  renderTab()
}
render()

// 新闻列表
async function renderList() {
  // 拿到新闻后四个数据
  list = await fetch(`http://localhost:5000/news`).then(res => res.json())
  list.reverse().slice(0,4) //倒序排列，取四个
  // console.log(list)
  // 渲染新闻卡片
  document.querySelector(".cardContainer").innerHTML = list.map(item => `
  <div class="card" data-id="${item.id}">
    <div style="background-image:url(${item.cover})" class="cardbg"></div>
    <div class="card-body">
      <h5 class="card-title" style="font-size:16px">${item.title}</h5>
      <p class="card-text" style="font-size:14px;color:gray">作者：${item.author}</p>
    </div>
  </div>
  `).join("")
  // 给每一个新闻卡片绑定点击事件，跳转到新闻详情页（带上新闻id）
  for (let item of document.querySelectorAll(".card")) {
    item.onclick = function () {
      location.href = `/web/views/details/index.html?id=${item.dataset.id}`
    }
  }
}

// 渲染新闻分类
function renderTab() { 
  // 利用lodash的groupBy方法，将新闻按照分类分组,返回一个对象（对象内部是数组）
  let categoryObj = _.groupBy(list, "category")
  // 直接用id拿到myTabContent下的每一个div节点,并且放入一个数组中,方便后面用forEach遍历
  let tabs = [tab0, tab1, tab2]
  tabs.forEach((item, index) => {
    // 这里得考虑一个问题，如果categoryObj[index]不存在，那么map方法就会报错，所以要加个判断 ?.可选链 再加个 || "暂无数据"，如果前面是undefined，就返回后面的值
    item.innerHTML = categoryObj[index]?.map(i => `
      <div class="listItem" data-id="${i.id}">
        <img src="${i.cover}" data-id="${i.id}"/>
        <div class="title" data-id="${i.id}">${i.title}</div>
        <p style="font-size:14px;color:gray" data-id="${i.id}">作者：${i.author}</p>
      </div>
    `).join("") || "暂无数据"

    // 为每一个item绑定点击事件（作为事件委托），当点击子元素的时候，拿到子元素的dataset.id，跳转到详情页
    item.onclick = function (evt) {
      location.href = `/web/views/details/index.html?id=${evt.target.dataset.id}` 
    }
  })
}

