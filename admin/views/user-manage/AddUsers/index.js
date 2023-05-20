// 引入模块
import { load } from "/admin/util/LoadView.js"

load("sidemenu-addUser") //加载topbar //sidemenu

// base64头像
let photo = ""

// 监听表单提交事件
addUserForm.onsubmit = async function (evt) {
  evt.preventDefault()

  // 往数据库存个人信息数据,post请求
  await fetch("http://localhost:5000/users", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
      introduction: introduction.value,
      photo
    })
  }).then(res => res.json())

  // 发送成功存好数据后，跳转到用户管理页面
  location.href = "/admin/views/user-manage/UserList/index.html"
}

// 监听头像文件上传，转base64头像
photofile.onchange = function (evt) {
  // ===>base64
  let reader = new FileReader()
  reader.readAsDataURL(evt.target.files[0])
  reader.onload = function (e) {
    photo = e.target.result
  }
}