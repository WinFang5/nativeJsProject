// 引入模块
import { load } from "/web/util/LoadView.js"

load("") //加载topbar

// 渲染内容
async function render() {
  let id = new URL(location.href).searchParams.get("id")
  let { title, author, content }  = await fetch(`http://localhost:5000/news/${id}`).then(res => res.json())
  document.querySelector(".title").innerHTML = title
  document.querySelector(".author").innerHTML = author
  document.querySelector(".newscontent").innerHTML = content
}
render()