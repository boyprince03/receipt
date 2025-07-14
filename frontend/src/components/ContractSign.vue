<template>
  <!-- STEP 1: 表單填寫 & 簽名 -->
  <form v-if="step === 1" class="form-area" @submit.prevent="showConfirm">
    <h2>租屋合約電子簽署</h2>
    <div class="input-row"><label>房號</label>
        <input v-model="form.roomNo" list="room-options" placeholder="房號" required />
        <datalist id="room-options">
          <option v-for="item in roomList" :key="item" :value="item" />
        </datalist>
    </div>
    <div class="input-row"><label>租賃地址</label>
        <input v-model="form.address" list="address-options" placeholder="地址" required/>
    <datalist id="address-options">
        <option v-for="item in addressList" :key="item" :value="item" />
    </datalist>
    </div>
    <div class="input-row"><label>承租人</label><input v-model="form.tenant" required /></div>
    <div class="input-row"><label>承租人身分證</label><input v-model="form.tenantId" required /></div>
    <div class="input-row"><label>承租人電話</label><input v-model="form.tenantPhone" required /></div>
    <div class="input-row"><label>出租人</label><input v-model="form.landlord" required /></div>
    <div class="input-row"><label>出租人身分證</label><input v-model="form.landlordId" required /></div>
    <div class="input-row"><label>出租人電話</label><input v-model="form.landlordPhone" required /></div>
    <div class="input-row"><label>租金</label>
        <input v-model="form.rentfee" placeholder="房間月租金" type="number" min="0" />
    </div>
    <div class="input-row"><label>押金</label>
        <input :value="form.deposit" placeholder="押金金額" type="text" readonly />
    </div>
    <div class="input-row"><label>租期</label><input v-model="form.duration" type="number" required /></div>
    <div class="input-row"><label>起租日</label><input v-model="form.startDate" type="date" required /></div>
    <div class="input-row"><label>退租日</label>
        <input :value="form.endDate" placeholder="截止日" type="date" readonly />
    </div>

    <!-- 前往簽名彈窗 -->
    <!-- <div class="sign-row">
      <button type="button" @click="showSignModal = true" class="sign-btn">前往簽名</button>
      <span v-if="form.signature">已完成簽名 <img :src="form.signature" style="height:36px; border:1px solid #aaa" /></span>
    </div>
    <Signature v-model:visible="showSignModal" @confirm="setSignature"/> -->
    <div class="btn-row">
      <button type="submit" class="next-btn">下一步（合約預覽確認）</button>
    </div>
  </form>

  <!-- STEP 2: 合約預覽/確認 -->
  <div v-else-if="step === 2" class="contract-preview">
    <h3>合約條款預覽</h3>
    <div class="preview-content">
        <Preview :form="form" />
    </div>

    <div class="confirm-check">
      <input type="checkbox" id="check" v-model="isChecked">
      <label for="check">我已詳細閱讀以上合約條款</label>
    </div>
    <div class="btn-row">
      <button
        :disabled="!isChecked || loading"
        class="submit-btn"
        @click="submitContract"
      >產生PDF</button>
      <button class="back-btn" @click="step=1" >返回修改</button>
    </div>
    <div v-if="loading" class="loading">PDF 產生中…</div>
  </div>
</template>

<script setup>
import { ref, computed,watch } from 'vue'
import Preview from './Preview.vue'
import axios from 'axios'


const step = ref(1)
const isChecked = ref(false)
const loading = ref(false)
const showSignModal = ref(false)

const form = ref({
  roomNo: '', address: '基隆市中山區復興路389-3號', tenant: '', tenantId: '', tenantPhone: '',
  landlord: '王子建', landlordId: 'H124054268', landlordPhone: '0929511011', rentfee: '', deposit: '',
  duration: '1', startDate: getTodayString(), endDate: '', signature: '',today: getTodayRoc()
})
const roomList = ref([401, 402, 403, 501, 502, 503, 504])
const rentfeeList = ref([7000, 7000, 10000, 5500, 5500, 5000, 4000])
const addressList = ref([
  '基隆市中山區復興路389-3號',
  '桃園市桃園區復興路83號10樓'
])
watch(() => form.value.roomNo, (val) => {
  const idx = roomList.value.findIndex(r => String(r) === String(val))
  if (idx !== -1) {
    form.value.rentfee = rentfeeList.value[idx]
  } else {
    form.value.rentfee = ''
  }
})
watch(() => form.value.roomNo, (val) => {
  console.log('房號變更:', val)
})

watch(() => form.value.rentfee, (val) => {
  console.log('租金:', val)
})
watch(() => form.value.deposit, (val) => {
  console.log('押金:', val)
})
watch(() => form.value.endDate, (val) => {
  console.log('enddate:', val)
})
watch(
  () => form.value.rentfee,
  (fee) => {
    const n = Number(fee)
    if (!n || isNaN(n)) {
      form.value.deposit = ''
    } else {
      form.value.deposit = n * 2
    }
  },
  { immediate: true }
)


// 自動同步退租日
watch(
  [() => form.value.startDate, () => form.value.duration],
  ([start, duration]) => {
    if (!start) {
      form.value.endDate = ''
      return
    }
    const endDuration = Number(duration)
    const date = new Date(start)
    date.setFullYear(date.getFullYear() + endDuration)
    date.setDate(date.getDate() - 1)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    form.value.endDate = `${yyyy}-${mm}-${dd}`
  },
  { immediate: true }
)

const setSignature = img => { form.value.signature = img }

// 取得民國日期
function getTodayRoc() {
  const d = new Date()
  const year = d.getFullYear() - 1911
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const date = String(d.getDate()).padStart(2, '0')
  return `${year} 年 ${month} 月 ${date} 日`
}

function getTodayString() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// 檢查填寫與簽名
function showConfirm() {
  for (let k of ['roomNo','address','tenant','landlord','rentfee','startDate','deposit','endDate']) {
    if (!form.value[k]) { alert('請確實填寫所有必要欄位'); return }
  }



  step.value = 2
  isChecked.value = false
}



const apiBase = import.meta.env.VITE_API_BASE
const submitContract = async () => {
  if (!form.value.signature) { alert('請完成電子簽名！'); return }
  if (!isChecked.value) return
  loading.value = true
  try {
    const res = await axios.post(
      `${apiBase}/pdf/generate`,
      {
        ...form.value,
        today: getTodayRoc(),
        templateType: 'Contract'
      },
      { responseType: 'arraybuffer' }
    )
    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '租賃合約.pdf'
    a.click()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    alert('產生 PDF 失敗，請稍後重試。')
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-area {
  background: #fff; border-radius: 14px; padding: 28px 20px 16px 24px;
  box-shadow: 0 2px 12px #88a8e633; max-width: 520px; margin: 20px 0;
  display: flex; flex-direction: column; gap: 14px;
}
.input-row { display: flex; align-items: center; gap: 12px; }
.input-row label { min-width: 105px; }
input, select {
  flex: 1; padding: 6px; border: 1px solid #bcd; border-radius: 6px;
}
.sign-row { margin-top: 10px; }
.sign-btn {
  background: #f3f9ff; color: #2767c7; border: 1.5px solid #88a8e6;
  border-radius: 8px; padding: 7px 20px; cursor: pointer;
}
.contract-preview { background: #fff; border-radius: 14px; max-width: 700px;
  box-shadow: 0 2px 12px #88a8e633; margin: 20px 0; padding: 28px 8vw 30px 8vw;
}
.preview-content { border: 1.5px solid #c3d7e5; border-radius: 10px; padding: 24px 18px; background: #f8fbff;}
.confirm-check { margin: 18px 0 0 0; }
.submit-btn { background: #2767c7; color: #fff; border: none; border-radius: 10px; padding: 10px 34px; font-size: 1.12em; cursor: pointer; margin-top: 10px;}
.submit-btn:disabled { background: #a0bed7; color: #fff; }
.back-btn { border: 1px solid #bbb; border-radius: 7px; background: #fff; padding: 8px 22px; color: #444; cursor: pointer;}
.loading { color:#2767c7; margin-top:14px;}
</style>
