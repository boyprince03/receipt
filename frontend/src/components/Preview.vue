<script setup>
const { form } = defineProps({ form: Object })
</script>

<template>
  <div>
    <div v-if="form">
      預覽測試元件，房號：{{form.roomNo}}
    </div>
    <div v-else style="color:red">
      form 尚未傳入！
    </div>
  </div>
</template>
