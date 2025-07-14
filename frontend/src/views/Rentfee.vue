<template>
    <div>debug: {{ rentfeeList.length }}</div>

  <div class="rentfee-container">
    <template v-if="view === 'list'">
      <h2>本月可用房間狀態</h2>
      <div class="room-status-list">
        <span v-for="room in availableRooms" :key="room.roomNo" class="room available">
          {{ room.roomNo }}
        </span>
        <span v-for="room in unavailableRooms" :key="room.roomNo" class="room unavailable">
          {{ room.roomNo }}
        </span>
      </div>
      <button class="room-manage-btn" @click="$emit('changeView', 'room')">房間管理</button>

      <h2>本月租金繳費狀態</h2>
      <button @click="editRow = null; view = 'form'">新增租金資料</button>
      <table>
        <thead>
          <tr>
            <th>房號</th>
            <th>承租人</th>
            <th>租期</th>
            <th>租金</th>
            <th>繳費狀態</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fee in rentfeeList" :key="fee.roomNo">
            <td>{{ fee.roomNo }}</td>
            <td>{{ fee.tenantName }}</td>
            <td>{{ fee.rentStart }} ~ {{ fee.rentEnd }}</td>
            <td>{{ fee.rentfee }}</td>
            <td>
              <span v-if="fee.isPaid">已繳清</span>
              <span v-else>未繳</span>
            </td>
            <td>
              <button @click="editRow = fee; view = 'form'">編輯</button>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <template v-if="view === 'form'">
      <DataInput :data="editRow" @back="onFormBack" />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DataInput from './tenant/DataInput.vue'

const view = ref('list')
const editRow = ref(null)
const rentfeeList = ref([])
const rooms = ref([])

const availableRooms = computed(() => rooms.value.filter(r => r.isActive))
const unavailableRooms = computed(() => rooms.value.filter(r => !r.isActive))

const loadRentFee = async () => {
  const res = await fetch('/api/rentfee')
  rentfeeList.value = await res.json()
}
const loadRooms = async () => {
  const res = await fetch('/api/room')
  rooms.value = await res.json()
}
onMounted(() => {
  loadRentFee()
  loadRooms()
})
function onFormBack() {
  view.value = 'list'
  editRow.value = null
  loadRentFee()
}
</script>

<style scoped>
.rentfee-container { max-width: 900px; margin: auto; padding: 16px; }
.room-status-list { margin-bottom: 10px; }
.room { display: inline-block; padding: 3px 12px; margin-right: 6px; border-radius: 12px; font-size: 1em;}
.room.available { background: #e1f3d8; color: #26ad50;}
.room.unavailable { background: #ffe6e6; color: #e1564c;}
.room-manage-btn { margin: 12px 0; background: #4786ea; color: white; border: none; border-radius: 8px; padding: 6px 18px;}
</style>
