<template>
  <div class="dashboard">
    <h2>房屋管理總覽</h2>
            <section>
<table>
      <thead>
        <tr>
          <th>房號</th>
          <th>租客</th>
          <th>租金</th>
          <th>租金狀態</th>
          <th>電費</th>
          <th>電費狀態</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.roomNo">
          <td>{{ item.roomNo }}</td>
          <td>{{ item.tenantName }}</td>
          <td>{{ item.rentfee }}</td>
          <td>
            <span v-if="item.rentPaid == 1">✅</span>
            <button v-else class="pay-btn" @click="payRent(item.tenantId)">未繳(點我繳)</button>
          </td>
          <td>{{ item.elecAmount }}</td>
          <td>
            <span v-if="item.elecPaid == 1">✅</span>
            <button v-else class="pay-btn" @click="payElec(item.elecId)">未繳(點我繳)</button>
          </td>
          <td>
            <!-- 電費CRUD按鈕，自己加入modal或行內操作 -->
            <button @click="editElec(item.elecId)">編輯電費</button>
            <button @click="deleteElec(item.elecId)">刪除電費</button>
          </td>
        </tr>
      </tbody>
    </table>
    </section>
    <section>
      <h3>🏠 房屋數量：{{ houses.length || '尚未有資料' }}</h3>
      <table v-if="houses.length">
        <thead>
          <tr><th>編號</th><th>名稱</th><th>地址</th><th>描述</th></tr>
        </thead>
        <tbody>
          <tr v-for="h in houses" :key="h.houseId">
            <td>{{ h.houseId }}</td><td>{{ h.name }}</td><td>{{ h.address }}</td><td>{{ h.description }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else>尚未有資料</div>
    </section>
    <section>
      <h3>🛏️ 房間狀態</h3>
      <table v-if="rooms.length">
        <thead>
          <tr>
            <th>房號</th><th>樓層</th><th>坪數</th><th>房型</th><th>可租</th>
            <th>預設租金</th><th>描述</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rooms" :key="r.roomNo">
            <td>{{ r.roomNo }}</td>
            <td>{{ r.floor }}</td>
            <td>{{ r.area }}</td>
            <td>{{ r.roomType }}</td>
            <td>{{ r.isActive ? '可租' : '不可租' }}</td>
            <td>{{ r.defaultRentfee }}</td>
            <td>{{ r.description }}</td>
            <td>
              <router-link :to="`/room?edit=${r.roomNo}`">編輯</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>尚未有資料</div>
    </section>
    <section>
      <h3>👥 租客列表</h3>
      <table v-if="joinList.length">
        <thead>
          <tr>
            <th>房號</th><th>樓層</th><th>坪數</th><th>租金</th>
            <th>租客姓名</th><th>租期</th><th>繳費</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in joinList" :key="r.roomNo">
            <td>{{ r.roomNo }}</td>
            <td>{{ r.floor }}</td>
            <td>{{ r.area }}</td>
            <td>{{ r.rentfee || r.defaultRentfee }}</td>
            <td>{{ r.tenantName || '' }}</td>
            <td v-if="r.rentStart">{{ r.rentStart }} ~ {{ r.rentEnd }}</td>
            <td v-else></td>
            <td>
              <span v-if="r.isPaid===1">已繳清</span>
              <span v-else-if="r.isPaid===0">未繳</span>
              <span v-else></span>
            </td>
            <td>
              <router-link :to="`/edit/${r.roomNo}`">編輯</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>尚未有資料</div>
    </section>

  </div>
  

    
</template>

<script setup>
import { ref,onMounted } from 'vue'
import axios from 'axios'

const apiBase = import.meta.env.VITE_API_BASE

const houses = ref([])
const rooms = ref([])
const joinList = ref([])

const load = async () => {
  try {
    const hres = await axios.get(`${apiBase}/houses`)
    houses.value = hres.data;  // ← 這樣就夠了

    const rres = await axios.get(`${apiBase}/room`)
    rooms.value = rres.data;

    const jres = await axios.get(`${apiBase}/room-join-tenant`)
    joinList.value = jres.data;

    console.log('houses.value', houses)
  } catch (err) {
    console.error('API error', err)
  }
}

async function refresh() {
  const res = await axios.get(`${apiBase}/rent-dashboard?month=${currentMonth.value}`);
  list.value = res.data;
}

async function payRent(tenantId) {
  await axios.put(`${apiBase}/tenant/pay/${tenantId}`);
  await refresh();
}
async function payElec(elecId) {
  await axios.put(`${apiBase}/electricity/pay/${elecId}`);
  await refresh();
}
async function editElec(elecId) { /* ... */ }
async function deleteElec(elecId) { /* ... */ }
function getThisMonth() {
  const d = new Date();
  return d.toISOString().slice(0,7);
}

onMounted(async () => {
  await load()
  await refresh()
});



</script>


<style scoped>
.dashboard { max-width: 1000px; margin: auto; padding: 24px;}
section { margin-bottom: 32px; }
table { width: 100%; border-collapse: collapse; margin: 8px 0; }
th,td { border:1px solid #ccc; padding:6px 8px; text-align:center;}
h2,h3 { color: #2d4aad;}
.pay-btn {
  background: red;
  color: white;
  border: none;
  padding: 2px 12px;
  border-radius: 6px;
  cursor: pointer;
}

</style>
