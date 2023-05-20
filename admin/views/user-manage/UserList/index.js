// 引入模块
import { load } from "/admin/util/LoadView.js"

load("sidemenu-userList") //加载topbar //sidemenu

// 获取editModal框元素
const myEditModal = new bootstrap.Modal(document.getElementById('editModal'))
// 获取delModal框元素
const myDelModal = new bootstrap.Modal(document.getElementById('delModal'))
// 初始化用户列表（全局变量）
let list = []
// 初始化拿到编辑按钮对应的id
let updateId = 0
// 头像文件
let photodata = ""


// 渲染用户列表
async function render() {
  // 发送请求获取用户信息
  list = await fetch("http://localhost:5000/users").then(res => res.json())
  listbody.innerHTML = list.map(item => `
    <tr>
        <th scope="row">${item.username}</th>
        <td><img src="${item.photo}" style="width:50px;border-radius:50%"/></td>
        <td>
        <button type="button" class="btn btn-primary  btn-sm btn-edit" ${item.default ? "disabled" : ""} data-myid="${item.id}">编辑</button>
        <button type="button" class="btn btn-danger  btn-sm btn-del" ${item.default ? "disabled" : ""} data-myid="${item.id}">删除</button>
        </td>
    </tr>
  `).join("")
}

// 利用事件委托给每一个编辑按钮、删除按钮添加点击事件
listbody.onclick = function (evt) {
  if (evt.target.className.includes("btn-edit")) {
    // 显示modal框
    myEditModal.toggle()
    // 预填
    // 拿到编辑按钮对应的用户信息
    let { username, password, introduction, photo } = list[Number(evt.target.dataset.myid - 1)]
    // 拿到编辑按钮对应的id
    updateId = Number(evt.target.dataset.myid)
    document.querySelector("#username").value = username
    document.querySelector("#password").value = password
    document.querySelector("#introduction").value = introduction
    photodata = photo

  } else if (evt.target.className.includes("btn-del")) {
    // console.log("删除")
    // 显示删除modal框，之前是隐藏
    myDelModal.toggle()
    // 拿到删除按钮对应的id
    updateId = Number(evt.target.dataset.myid)
  }
}

// Modal框中的更新按钮事件,向数据库发送请求，更新用户信息
editConfirm.onclick = async function () {
  // 往数据库更新个人信息数据,post请求
  await fetch(`http://localhost:5000/users/${updateId}`, {
    method: "PATCH", //patch请求得大写
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: document.querySelector("#username").value,
      password: document.querySelector("#password").value,
      introduction: document.querySelector("#introduction").value,
      photo: photodata
    })
  }).then(res => res.json())

  // 隐藏modal框，之前是显示
  myEditModal.toggle()
  // 发送成功存好数据后，重新渲染用户列表。不要用location.reload()，因为这样会刷新页面，会导致用户体验不好。
  render()
}

// 监听头像文件上传，转base64头像,并且更新photodata
photofile.onchange = function (evt) {
  // ===>base64
  let reader = new FileReader()
  reader.readAsDataURL(evt.target.files[0])
  reader.onload = function (e) {
    photodata = e.target.result
  }
}

// 删除modal框中的删除按钮事件
delConfirm.onclick = async function () {
  // 向数据库发送请求，删除用户信息
  await fetch(`http://localhost:5000/users/${updateId}`, {
    method: "DELETE"
  }).then(res => res.json())
  // 隐藏modal框，之前是显示
  myDelModal.toggle()
  // 发送成功存好数据后，重新渲染用户列表。不要用location.reload()，因为这样会刷新页面，会导致用户体验不好。
  render()
}

// 渲染用户列表
render()

