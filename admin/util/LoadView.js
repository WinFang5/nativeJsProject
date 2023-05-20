// 是否登录
function isLogin() {
  return localStorage.getItem("token")
}

// 渲染顶部导航栏
function renderTopbar(user) {
  // console.log(user)
  let photo = document.querySelector("#topbar-photo")
  let currentUsername = document.querySelector("#currentUsername")
  let exit = document.querySelector("#exit")

  // 渲染头像和用户名
  photo.src = user.photo
  currentUsername.innerHTML = user.username
  // 退出登录
  exit.onclick = function () {
    localStorage.removeItem("token")
    location.href = "/admin/views/login/index.html"
  }
}

// 如果不是管理员，就移除用户管理页面
function removeMangeItem(user) {
  if (user.role !== "admin") {
    document.querySelector(".user-manage-item").remove()
  }
}

// 加载页面
async function load(id) {
  let user = isLogin()
  if (user) {
    // 加载顶部导航栏
    let topbarText = await fetch("/admin/components/topbar/index.html")
      .then(res => res.text())
    document.querySelector(".topbar").innerHTML = topbarText
    // 渲染顶部导航栏
    renderTopbar(JSON.parse(user))

    // 加载左侧导航栏
    let sidemenuText = await fetch("/admin/components/sidemenu/index.html")
      .then(res => res.text())
    document.querySelector(".sidemenu").innerHTML = sidemenuText
    document.querySelector("#" + id).style.color = "#0a58ca"

    // 如果不是管理员，调用removeMangeItem，移除用户管理页面
    removeMangeItem(JSON.parse(user))
  } else {
    location.href = "/admin/views/login/index.html"
  }
}

export { load, isLogin }

