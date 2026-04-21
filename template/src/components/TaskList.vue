<template>
  <div class="task-list">
    <h2>Task List</h2>

    <div class="add-task">
      <el-input
        v-model="newTask"
        placeholder="Enter task title..."
        @keyup.enter="handleAddTask"
      />
      <el-button type="primary" @click="handleAddTask">Add</el-button>
    </div>

    <el-spinner v-if="loading" />

    <div v-else class="tasks">
      <div v-for="task in tasks" :key="task.id" class="task-item">
        <el-checkbox
          :model-value="task.completed === 1"
          @change="handleToggle(task)"
        >
          <span :class="{ completed: task.completed }">{{ task.title }}</span>
        </el-checkbox>
        <el-button text type="danger" @click="handleDelete(task.id)">
          Delete
        </el-button>
      </div>

      <div v-if="tasks.length === 0" class="empty">No tasks yet</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getTasks, addTask, deleteTask, toggleTask } from '../utils/db'
import { ElMessage } from 'element-plus'

const tasks = ref([])
const newTask = ref('')
const loading = ref(true)

async function loadTasks() {
  loading.value = true
  try {
    tasks.value = await getTasks()
  } catch (e) {
    ElMessage.error('Failed to load tasks')
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function handleAddTask() {
  if (!newTask.value.trim()) return
  try {
    await addTask(newTask.value.trim())
    newTask.value = ''
    await loadTasks()
    ElMessage.success('Task added')
  } catch (e) {
    ElMessage.error('Failed to add task')
    console.error(e)
  }
}

async function handleToggle(task) {
  try {
    await toggleTask(task.id, task.completed !== 1)
    await loadTasks()
  } catch (e) {
    ElMessage.error('Failed to update task')
    console.error(e)
  }
}

async function handleDelete(id) {
  try {
    await deleteTask(id)
    await loadTasks()
    ElMessage.success('Task deleted')
  } catch (e) {
    ElMessage.error('Failed to delete task')
    console.error(e)
  }
}

onMounted(loadTasks)
</script>

<style scoped>
.task-list {
  padding: 20px;
}

.add-task {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.add-task .el-input {
  flex: 1;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.task-item .completed {
  text-decoration: line-through;
  color: #999;
}

.empty {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>