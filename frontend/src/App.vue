<template>
  <div id="app">
    <header>
      <span class="logo">🏠</span>
      <h1>房屋收據產生器</h1>
      <nav class="navbar">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          :class="{ active: tab.value === activeTab }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </nav>
    </header>

    <main>
      <DepositForm v-if="activeTab === 'deposit'" />
      <DepositGuarantee v-if="activeTab === 'guarantee'" />
    </main>
    <footer>
      <small>
        &copy; {{ year }} Steve 訂金收據產生器 &mdash; Powered by Vue + Node.js<br>
        <span class="footer-tip">✨ 範本樣式可自訂、資料僅本地處理更安心 ✨</span>
      </small>
    </footer>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import DepositForm from './components/DepositForm.vue'
import DepositGuarantee from './components/GuaranteeForm.vue' // 你可以先複製一份 DepositForm 內容當樣板

const tabs = [
  { label: '訂金', value: 'deposit' },
  { label: '押金', value: 'guarantee' }
]
const activeTab = ref('deposit')
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
  gap: 28px;
  margin: 18px 0 18px 0;
}
.navbar button {
  background: #fff;
  border: 1.5px solid #88a8e6;
  border-radius: 24px;
  padding: 7px 24px;
  font-size: 1.1em;
  color: #2767c7;
  cursor: pointer;
  transition: background .2s, color .2s;
}
.navbar button.active, .navbar button:hover {
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
