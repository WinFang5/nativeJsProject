// 引入模块
import { load, isLogin } from "/admin/util/LoadView.js"

load("sidemenu-home") //加载topbar //sidemenu

// 调用isLogin()拿到用户信息
let user = JSON.parse(isLogin())
// 渲染用户信息
document.querySelector(".userprofile").innerHTML = `
  <img src="${user.photo}" style="width:100px"/>
  <div>
    <div>${user.username}</div>
    <div><pre>${user.introduction || "这个人很懒"}</pre></div>
  </div>
`

// 获取当前用户发布的新闻数据,并且渲染到图表中
async function analyst() {
  // 发送请求获取当前用户的新闻数据
  let res = await fetch(`http://localhost:5000/news?author=${user.username}`).then(res => res.json())
  // 利用lodash的groupBy方法对数据进行分组
  let dataArray = []
  let dataObj = _.groupBy(res, "category")
  // 遍历对象,将数据转换为echarts所需要的格式
  let categoryList = ["最新动态", "典型案例", "通知公告"]
  for (let key in dataObj) {
    dataArray.push({
      name: categoryList[key],
      value: dataObj[key].length
    })
  }
  // 将数据渲染到图表中
  renderEchart(dataArray)
}
analyst()

// 将数据渲染到图表中
function renderEchart(dataArray) {
  // echarts图表
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('main'));

  // 指定图表的配置项和数据
  var option = {
    title: {
      text: '当前用户发布的新闻',
      subtext: '不同类别占比',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: dataArray,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}