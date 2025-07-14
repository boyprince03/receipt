<template>
  <div>
    <h2>編輯租金資料</h2>
    <form @submit.prevent="handleSubmit">
      <div><label>房號：</label><input v-model="form.roomNo" readonly /></div>
      <div><label>姓名：</label><input v-model="form.tenantName" required /></div>
      <div><label>租期（年）：</label><input type="number" step="0.01" v-model.number="form.rentYears" min="0.01" required /></div>
      <div><label>起租日：</label><input type="date" v-model="form.rentStart" required /></div>
      <div><label>到期日：</label><input type="date" v-model="form.rentEnd" required /></div>
      <div><label>租金：</label><input type="number" v-model="form.rentfee" required /></div>
      <div>
        <label>繳費狀態：</label>
        <select v-model="form.isPaid">
          <option :value="1">已繳清</option>
          <option :value="0">欠費</option>
        </select>
      </div>
      <button type="submit">儲存</button>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const roomNo = route.params.roomNo
const form = ref({ roomNo, tenantName: '', rentYears: '', rentStart: '', rentEnd: '', rentfee: '', isPaid: 0 })
onMounted(async () => {
  const res = await fetch('/api/rentfee')
  const list = await res.json()
  const data = list.find(x => x.roomNo == roomNo)
  if (data) Object.assign(form.value, data)
})
const handleSubmit = async () => {
  await fetch(`/api/rentfee/${form.value.roomNo}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  router.push('/dashboard')
}
</script>
