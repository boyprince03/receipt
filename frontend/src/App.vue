<template>
  <div id="app">
    <header>
      <span class="logo">🏠</span>
      <h1>租屋電子文件產生器</h1>
      <nav class="navbar">
        <router-link to="/" class="nav-btn" exact-active-class="active">首頁</router-link>
        <router-link to="/deposit" class="nav-btn" active-class="active">訂金收據</router-link>
        <router-link to="/guarantee" class="nav-btn" active-class="active">押金收據</router-link>
        <router-link to="/contract" class="nav-btn" active-class="active">電子化租約及簽署</router-link>
        <router-link to="/dashboard" class="nav-btn" active-class="active">房屋管理</router-link>
      </nav>
    </header>

    <main>
      <router-view />
    </main>

    <footer>
      <small>
        &copy; {{ new Date().getFullYear() }} Steve 訂金收據產生器 &mdash; Powered by Vue + Node.js<br>
        <span class="footer-tip">✨ 範本樣式可自訂、資料僅本地處理更安心 ✨</span>
      </small>
    </footer>
  </div>
</template>

<script setup>
// 不需要引入各頁面，交給 router-view 處理
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
header {
  text-align: center;
  margin-top: 36px;
}
.logo {
  font-size: 2.2em;
  vertical-align: middle;
}
.navbar {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 18px 0 18px 0;
  flex-wrap: wrap;
}
.nav-btn {
  background: #fff;
  border: 1.5px solid #88a8e6;
  border-radius: 24px;
  padding: 7px 24px;
  font-size: 1.1em;
  color: #2767c7;
  cursor: pointer;
  transition: background .2s, color .2s;
  text-decoration: none;
  font-weight: bold;
}
.nav-btn.active, .nav-btn.router-link-active, .nav-btn.router-link-exact-active, .nav-btn:hover {
  background: #e3edfa;
  color: #18489c;
  border-color: #3870dd;
}
main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 20px;
}
footer {
  text-align: center;
  padding: 18px 0 10px 0;
  background: #eaf0fa;
  color: #333;
  font-size: 0.95em;
  border-top: 1px solid #c2d2f0;
}
.footer-tip {
  color: #9676ed;
  margin-left: 8px;
}
</style>
