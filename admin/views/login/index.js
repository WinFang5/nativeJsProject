const loginform = document.querySelector("#loginform");

loginform.onsubmit = async function (evt) {
  loginwarning.style.display = "none"

  evt.preventDefault();

  // 正常 post请求
  // json-server get 获取数据 post 添加数据，put修改，delete删除
  let res = await fetch(`http://localhost:5000/users?username=${username.value}&password=${password.value}`).then(res => res.json())

  if (res.length > 0) {
    // 登录成功
    // console.log(res)
    localStorage.setItem("token", JSON.stringify({ ...res[0], password: "*****" }))
    location.href = "/admin/views/home/index.html"
  } else {
    // 登录失败
    console.log("登录失败")
    loginwarning.style.display = "block"
  }
}