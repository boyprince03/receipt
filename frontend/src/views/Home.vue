<template>
  <div class="home-wrap">
    <h2>租屋電子文件產生器</h2>
    <div class="btn-group">
      <router-link to="/deposit" class="dash-btn">訂金收據</router-link>
      <router-link to="/guarantee" class="dash-btn">押金收據</router-link>
      <router-link to="/contract" class="dash-btn">電子化租約及簽署</router-link>
      <router-link to="/dashboard" class="dash-btn">房屋管理</router-link>
    </div>
  </div>
</template>
<style scoped>
.home-wrap { text-align:center; margin-top: 60px;}
.btn-group { display: flex; flex-direction: column; gap: 16px; max-width: 340px; margin: 32px auto;}
.dash-btn {
  background: #e6eaff;
  border-radius: 16px;
  border: none;
  font-size: 1.15em;
  padding: 20px 0;
  color: #2347a7;
  text-decoration: none;
  font-weight: bold;
  box-shadow: 0 2px 10px #0001;
  transition: background .2s, color .2s;
}
.dash-btn:hover { background: #b8c7ff; color: #000; }
</style>
