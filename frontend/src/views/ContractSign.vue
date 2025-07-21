<template>
  <!-- STEP 1: 表單填寫 & 簽名 -->
  <form v-if="step === 1" class="form" @submit.prevent="showConfirm">
    <h2>租賃合約電子簽署</h2>
    <div class="input-clear-group">
        <input v-model="form.roomNo" list="room-options" placeholder="房號" required />
        <datalist id="room-options">
          <option v-for="item in roomList" :key="item" :value="item" />
        </datalist>
    </div>
    <div class="input-clear-group">
        <input v-model="form.address" list="address-options" placeholder="地址" required/>
    <datalist id="address-options">
        <option v-for="item in addressList" :key="item" :value="item" />
    </datalist>
    </div>
    <div class="input-clear-group"><input v-model="form.tenant" placeholder="承租人真實姓名..." required /></div>
    <div class="input-clear-group">
      <input v-model="form.tenantId" placeholder="承租人身分證或居留證號..." required @blur="checkTenantId" />
      <div v-if="tenantIdError" class="error-text">{{ tenantIdError }}</div>
    </div>
    <div class="input-clear-group">
      <input v-model="form.tenantPhone" placeholder="承租人電話 EX:09xx123456 或 02-12345678" required @blur="checkTenantPhone" />
      <div v-if="tenantPhoneError" class="error-text">{{ tenantPhoneError }}</div>
    </div>
    <div class="input-clear-group"><input v-model="form.landlord" placeholder="出租人" required /></div>
    <div class="input-clear-group">
      <input v-model="form.landlordId" placeholder="出租人身分證字號" required />
    </div>
    <div class="input-clear-group"><input v-model="form.landlordPhone" placeholder="出租人電話"  required /></div>
    <div class="input-clear-group"><input v-model="form.rentfee" placeholder="房間月租金" type="number" min="0" /></div>
    <div class="input-clear-group"><input :value="form.deposit" placeholder="押金金額" type="text" readonly /></div>
    <div class="input-clear-group"><input type="number" step="0.5" v-model.number="form.duration" min="0.5" placeholder="租期" required /></div>
    <div class="input-clear-group"><input v-model="form.startDate" type="date" placeholder="起租日" required /></div>
    <div class="input-clear-group"><input :value="form.endDate" placeholder="退租日" type="date" readonly /></div>
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
import Preview from '../components/Preview.vue'
import axios from 'axios'


const step = ref(1)
const isChecked = ref(false)
const loading = ref(false)
const showSignModal = ref(false)
const tenantIdError = ref('');
const tenantPhoneError = ref('');

const form = ref({
  roomNo: '401', address: '基隆市中山區復興路389-3號', tenant: '', tenantId: '', tenantPhone: '',
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
    if (!start || !duration) {
      form.value.endDate = ''
      return
    }
    const date = new Date(start)
    const years = Math.floor(Number(duration))            // 取整年
    const months = Math.round((Number(duration) - years) * 12)  // 剩餘月（可0）

    date.setFullYear(date.getFullYear() + years)
    date.setMonth(date.getMonth() + months)
    date.setDate(date.getDate() - 1) // 退一天

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
//取得今天日期
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

//驗證身分證居留證格式
function validateId(id) {
  // 身分證: 1個英文字+9個數字
  const idReg = /^[A-Z][12]\d{8}$/i;
  // 新/舊居留證（最基本）：兩個英+8數 or 1英+9數
  const arcReg1 = /^[A-Z]{2}\d{8}$/i;
  const arcReg2 = /^[A-Z]\d{9}$/i;
  return idReg.test(id) || arcReg1.test(id) || arcReg2.test(id);
}
function checkTenantId() {
  if (!validateId(form.value.tenantId)&&form.value.tenantId != '') {
    tenantIdError.value = '格式錯誤，請輸入正確身分證或居留證號';
  } else {
    tenantIdError.value = '';
  }
}

//驗證電話格式
function validatePhone(phone) {
  // 手機
  const mobile = /^09\d{8}$/;
  // 市話(區碼2~8開頭, 長度合乎一般習慣)
  const landline = /^0\d{1,2}-\d{6,8}$/;
  return mobile.test(phone) || landline.test(phone);
}
function checkTenantPhone() {
  if (!validatePhone(form.value.tenantPhone)&&form.value.tenantPhone != '') {
    tenantPhoneError.value = '請輸入正確手機或市話號碼（市話請加區碼與"-"）';
  } else {
    tenantPhoneError.value = '';
  }
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

