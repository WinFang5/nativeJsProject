// 引入模块
import { load, isLogin } from "/admin/util/LoadView.js"

load("sidemenu-newsList") //加载topbar //sidemenu

let list = []
let categoryList = ["最新动态", "典型案例", "通知公告"]
let username = JSON.parse(isLogin()).username
// 初始化预览Modal框
let myPreviewModal = new bootstrap.Modal(document.getElementById('previewModal'))
// 初始化删除Modal框
let myDelModal = new bootstrap.Modal(document.getElementById('delModal'))
let updateId = 0

// 渲染新闻列表
async function render() {
  // 发送请求获取用户信息
  list = await fetch(`http://localhost:5000/news?author=${username}`).then(res => res.json())

  listbody.innerHTML = list.map(item => `
    <tr>
        <th scope="row">${item.title}</th>
        <td>${categoryList[item.category]}</td>
        <td>
        <button type="button" class="btn btn-success  btn-sm btn-preview" ${item.default ? "disabled" : ""} data-myid="${item.id}">预览</button>
        <button type="button" class="btn btn-primary  btn-sm btn-edit" ${item.default ? "disabled" : ""} data-myid="${item.id}">编辑</button>
        <button type="button" class="btn btn-danger  btn-sm btn-del" ${item.default ? "disabled" : ""} data-myid="${item.id}">删除</button>
        </td>
    </tr>
  `).join("")
}

// 利用事件委托给每一个预览按钮、编辑按钮、删除按钮添加点击事件
listbody.onclick = function (evt) {
  if (evt.target.className.includes("btn-preview")) {
    // console.log("预览")
    // 显示预览Modal框,之前是隐藏的
    myPreviewModal.toggle()
    let obj = list.filter(item => item.id == evt.target.dataset.myid)[0]
    // 渲染预览Modal框
    renderPreviewModal(obj)
  }
  if (evt.target.className.includes("btn-edit")) {
    // console.log("编辑")
    // 跳转到编辑页面,带上id
    location.href = "/admin/views/news-manage/EditNews/index.html?id=" + evt.target.dataset.myid
  }
  if (evt.target.className.includes("btn-del")) {
    // console.log("删除")
    myDelModal.toggle()
    updateId = evt.target.dataset.myid

  }
}

// 渲染预览Modal框方法
function renderPreviewModal(obj) {
  previewModalTitle.innerHTML = obj.title
  previewModalContent.innerHTML = obj.content
}

// 删除modal中的确认删除按钮点击事件
delConfirm.onclick = async function () {
  // 发送请求删除数据
  await fetch(`http://localhost:5000/news/${updateId}`, {
    method: "DELETE"
  }).then(res => res.json())
  // 隐藏删除Modal框
  myDelModal.toggle()
  // 拿到数据后重新渲染页面（调用render）
  render()

}

render()