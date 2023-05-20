// 引入模块
import { load, isLogin } from "/admin/util/LoadView.js"

load("sidemenu-newsList") //加载topbar //sidemenu

// 定义content，用来接收在编辑器写的内容
let content = ""
// 定义cover，用来接收封面图片的地址(base64)
let cover = ""
// 获取从新闻列表的编辑按钮传递过来的id
let updateId = (new URL(location.href).searchParams.get("id"))

// 富文本编辑器
const { createEditor, createToolbar } = window.wangEditor

const editorConfig = {
  placeholder: 'Type here...',
  onChange(editor) {
    const html = editor.getHtml()
    // console.log('editor content', html)
    // 也可以同步到 <textarea>

    // 将编辑器的内容同步到content里面
    content = html
  }
}

const editor = createEditor({
  selector: '#editor-container',
  html: '<p><br></p>',
  config: editorConfig,
  mode: 'default', // or 'simple'
})

const toolbarConfig = {}

const toolbar = createToolbar({
  editor,
  selector: '#toolbar-container',
  config: toolbarConfig,
  mode: 'default', // or 'simple'
})

// 监听封面图片文件上传，转为base64
coverfile.onchange = function (evt) {
  // ===>base64
  let reader = new FileReader()
  reader.readAsDataURL(evt.target.files[0])
  reader.onload = function (e) {
    cover = e.target.result
  }
}

// 监听表单提交事件
editNewsForm.onsubmit = async function (evt) {
  evt.preventDefault()
  // 发送post请求，将新闻数据添加到服务器
  await fetch(`http://localhost:5000/news/${updateId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title.value,
      content,
      category: category.value,
      cover
    })
  }).then(res => res.json())
  // 发送完毕后，跳转到新闻列表页面
  location.href = "/admin/views/news-manage/NewsList/index.html"
}

// 先根据从新闻列表中点击编辑传来的id(updateId)，向数据库发送请求拿到数据后，渲染新闻数据
async function render() {
  let obj = await fetch(`http://localhost:5000/news/${updateId}`).then(res => res.json())
  let { category, content: mycontent, cover: mycover, title } = obj
  // 将拿到的数据渲染到页面上
  document.querySelector("#title").value = title
  document.querySelector("#category").value = category
  editor.setHtml(mycontent)
  content = mycontent
  cover = mycover
}
render()