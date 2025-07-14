<template>
    <div>debug: {{ rooms.length }}</div>
  <div class="room-mgr">
    <h2>房間管理</h2>
    <button @click="openAdd">新增房間</button>
    <table>
      <thead>
        <tr>
          <th>房號</th><th>房屋ID</th><th>房型</th><th>坪數</th>
          <th>樓層</th><th>預設租金</th><th>啟用</th><th>描述</th><th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rooms" :key="r.roomNo">
          <td>{{ r.roomNo }}</td>
          <td>{{ r.houseId }}</td>
          <td>{{ r.roomType }}</td>
          <td>{{ r.area }}</td>
          <td>{{ r.floor }}</td>
          <td>{{ r.defaultRentfee }}</td>
          <td>
            <input type="checkbox" v-model="r.isActive" @change="toggleActive(r)">
          </td>
          <td>{{ r.description }}</td>
          <td>
            <button @click="openEdit(r)">編輯</button>
            <button @click="deleteRoom(r.roomNo)">刪除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 新增/編輯房間表單 -->
    <div v-if="showForm" class="room-form">
      <h3>{{ isEdit ? '編輯房間' : '新增房間' }}</h3>
      <form @submit.prevent="submitForm">
        <input v-model="form.roomNo" placeholder="房號" :readonly="isEdit"/>
        <input v-model="form.houseId" placeholder="房屋ID" type="number" required/>
        <input v-model="form.roomType" placeholder="房型"/>
        <input v-model="form.area" placeholder="坪數" type="number"/>
        <input v-model="form.floor" placeholder="樓層" type="number"/>
        <input v-model="form.defaultRentfee" placeholder="預設租金" type="number"/>
        <input v-model="form.description" placeholder="描述"/>
        <label>
          <input type="checkbox" v-model="form.isActive"/> 啟用
        </label>
        <button type="submit">儲存</button>
        <button @click.prevent="showForm=false">取消</button>
      </form>
    </div>
    <button @click="$emit('back')">返回租金管理</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const rooms = ref([])
const showForm = ref(false)
const isEdit = ref(false)
const form = ref({
  roomNo: '', houseId: '', roomType: '', area: '', floor: '', defaultRentfee: '', isActive: 1, description: ''
})

const loadRooms = async () => {
  const res = await fetch('/api/room')
  // 這裡確保 isActive 變成布林值，checkbox 才正確
  rooms.value = (await res.json()).map(r => ({ ...r, isActive: !!r.isActive }))
}


const openAdd = () => {
  Object.assign(form.value, { roomNo: '', houseId: '', roomType: '', area: '', floor: '', defaultRentfee: '', isActive: 1, description: '' })
  isEdit.value = false
  showForm.value = true
}

const openEdit = (r) => {
  Object.assign(form.value, r)
  isEdit.value = true
  showForm.value = true
}

const submitForm = async () => {
  const url = isEdit.value ? `/api/room/${form.value.roomNo}` : '/api/room'
  const method = isEdit.value ? 'PUT' : 'POST'
  await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value) })
  showForm.value = false
  loadRooms()
}
const deleteRoom = async (roomNo) => {
  if (confirm('確定要刪除?')) {
    await fetch(`/api/room/${roomNo}`, { method: 'DELETE' })
    loadRooms()
  }
}
const toggleActive = async (room) => {
  await fetch(`/api/room/${room.roomNo}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...room, isActive: room.isActive ? 1 : 0 })
  })
}
onMounted(loadRooms)
</script>

<style scoped>
.room-mgr { max-width: 900px; margin: auto; padding: 16px; }
.room-form { margin-top: 20px; border: 1px solid #bbb; padding: 16px; border-radius: 8px;}
.room-form input { margin-right: 6px; margin-bottom: 8px;}
button { margin: 3px;}
</style>
