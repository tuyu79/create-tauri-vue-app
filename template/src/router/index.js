import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import TaskList from '../components/TaskList.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TaskList
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Home
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router