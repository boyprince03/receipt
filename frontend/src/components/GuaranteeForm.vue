<template>
  <div class="form">
    <h2>押金收據產生器</h2>
    <form @submit.prevent="generatePDF">
      <div class="input-clear-group">
        <input v-model="roomNo" list="room-options" placeholder="房號/自訂" required />
        <datalist id="room-options">
          <option v-for="item in roomList" :key="item" :value="item" />
        </datalist>
        <button v-if="roomNo" class="clear-btn" type="button" @click="roomNo = ''" aria-label="清除" title="清除">×</button>
      </div>
      <div class="input-clear-group">
        <input v-model="tenant" placeholder="承租人姓名" required />
        <button v-if="tenant" class="clear-btn" type="button" @click="tenant = ''" aria-label="清除" title="清除">×</button>
      </div>
      <div class="input-clear-group">
        <input v-model="landlord" placeholder="出租人姓名/代理人" required />
        <button v-if="landlord" class="clear-btn" type="button" @click="landlord = ''" aria-label="清除" title="清除">×</button>
      </div>
      <div class="input-clear-group">
        <input v-model="rentfee" placeholder="房間月租金" type="number" min="0" />
        <button v-if="rentfee" class="clear-btn" type="button" @click="rentfee = ''" aria-label="清除" title="清除">×</button>
      </div>
      <div class="input-clear-group">
        <input :value="computedDeposit" placeholder="押金金額" type="text" readonly />
      </div>
      <div class="input-clear-group">
        <input v-model="address" list="address-options" placeholder="地址" required /> 
        <datalist id="address-options">
          <option v-for="item in addressList" :key="item" :value="item" />
        </datalist>
        <button v-if="address" class="clear-btn" type="button" @click="address = ''" aria-label="清除" title="清除">×</button>
      </div>
        <div class="input-clear-group">
          <input v-model="duration" placeholder="租期（年）" type="number" required/>
          <button v-if="duration" class="clear-btn" type="button" @click="duration = ''" aria-label="清除" title="清除">×</button>
    </div>
        <div class="input-clear-group">
          <input v-model="startDate" placeholder="起租日" type="date" required />
    </div>
        <div class="input-clear-group">
          <input :value="computedEndDate" placeholder="截止日" type="date" readonly />
    </div>

      <button type="submit" :disabled="downloading">
        {{ downloading ? '產生中...' : '產生 PDF' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import axios from 'axios'

// 房號、租金一一對應
const roomList = ref([401, 402, 403, 501, 502, 503, 504])
const rentfeeList = ref([7000, 7000, 10000, 5500, 5500, 5000, 4000])

const roomNo = ref('')
const tenant = ref('')
const landlord = ref('王子建(Steve)')
const rentfee = ref('')
const address = ref('基隆市中山區復興路389-3號')
const duration = ref('1')
const startDate = ref(getTodayString())

// 地址清單
const addressList = ref([
  '基隆市中山區復興路389-3號',
  '桃園市桃園區復興路83號10樓'
])

// 當房號改變時，自動帶出租金
watch(roomNo, (val) => {
  const idx = roomList.value.findIndex(r => String(r) === String(val))
  if (idx !== -1) {
    rentfee.value = rentfeeList.value[idx]
  } else {
    rentfee.value = ''
  }
})

// 押金 = 月租金 * 2
const computedDeposit = computed(() => {
  const fee = Number(rentfee.value)
  if (!fee || isNaN(fee)) return ''
  return fee * 2
})

// 截止日自動計算
const computedEndDate = computed(() => {
  if (!startDate.value) return ''
  const endDuration = Number(duration.value)
  const date = new Date(startDate.value)
  date.setFullYear(date.getFullYear() + endDuration)
  date.setDate(date.getDate() - 1) // 不含第一天
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

function getTodayString() {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function formatROCDate(date) {
  const d = new Date(date)
  const year = d.getFullYear() - 1911
  return `${year}年${d.getMonth() + 1}月${d.getDate()}日`
}

const downloading = ref(false)
const apiBase = import.meta.env.VITE_API_BASE

const generatePDF = async () => {
  // 新增新地址到下拉清單
  if (address.value && !addressList.value.includes(address.value)) {
    addressList.value.push(address.value)
  }
  downloading.value = true
  const today = formatROCDate(new Date())
  try {
    const res = await axios.post(
      `${apiBase}/pdf/generate`,
      {
        roomNo: roomNo.value,
        tenant: tenant.value,
        landlord: landlord.value,
        deposit: computedDeposit.value,
        address: address.value,
        rentfee: rentfee.value,
        duration: duration.value,
        startDate: startDate.value,
        endDate: computedEndDate.value,
        today,
        templateType: 'Guarantee'
      },
      { responseType: 'arraybuffer' }
    )

    const blob = new Blob([new Uint8Array(res.data)], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const safeTenant = encodeURIComponent(tenant.value)
    const filename = `receipt_${new Date().toISOString().slice(0,10)}_${safeTenant}.pdf`
    
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    alert('PDF 下載失敗，請稍後再試')
    console.error('PDF下載錯誤', err)
  }
  downloading.value = false
}
</script>
