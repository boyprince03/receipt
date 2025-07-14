import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RentDashboard from '../views/RentDashboard.vue'
import Room from '../views/Room.vue'
import Edit from '../views/Edit.vue'
import DepositForm from '../views/DepositForm.vue'
import GuaranteeForm from '../views/GuaranteeForm.vue'
import ContractSign from '../views/ContractSign.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/deposit', name: 'DepositForm', component: DepositForm },
  { path: '/guarantee', name: 'GuaranteeForm', component: GuaranteeForm },
  { path: '/contract', name: 'ContractSign', component: ContractSign },
  { path: '/dashboard', name: 'RentDashboard', component: RentDashboard },
  { path: '/room', name: 'Room', component: Room },
  { path: '/edit/:roomNo', name: 'Edit', component: Edit, props: true },
]
export default createRouter({
  history: createWebHistory(),
  routes
})
