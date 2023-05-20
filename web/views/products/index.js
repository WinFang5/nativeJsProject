// 引入模块
import { load } from "/web/util/LoadView.js";

load("topbar-products"); //加载topbar

// 动态渲染轮播图
async function render() {
  let res = await fetch(`http://localhost:5000/products`).then((res) =>
    res.json()
  );
  console.log(res)
  // 动态渲染轮播图的指示器
  let carouselIndicators = document.querySelector(".carousel-indicators");
  carouselIndicators.innerHTML = res.map((item,index) => `
      <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="${index}" class="${index===0?"active":""}"
      aria-current="true" aria-label="${item.title}"></button>
  `
  ).join("");
  // 动态渲染轮播图的主体内容
  let carouselInner = document.querySelector(".carousel-inner");
  carouselInner.innerHTML = res.map((item, index) => `
  <div class="carousel-item ${index===0?"active":""}">
    <div
      style="background-image: url(${item.cover});width: 100%;height: calc(100vh - 50px);background-size: cover;">
    </div>
    <div class="carousel-caption d-none d-md-block">
      <h5>${item.title}</h5>
      <p>${item.introduction}</p>
    </div>
  </div>
  `)
  
  
}
render();
