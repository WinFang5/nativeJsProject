// 是否登录
function isLogin() {
  return localStorage.getItem("token")
}



// 加载页面
async function load(id) {

  // 加载顶部导航栏
  let topbarText = await fetch("/web/components/topbar/index.html")
    .then(res => res.text())
  document.querySelector(".topbar").innerHTML = topbarText

  if (id) {
    document.querySelector(`#${id}`).style.color = "#0a58ca"
  }
}

export { load }

