<template>
  <div class="home">
    <h1>Welcome to {{PROJECT_NAME}}</h1>
    <p>This is a Tauri + Vue template project.</p>
    <router-link to="/tasks">Go to Task List</router-link>
    <br />
    <router-link to="/admin">Go to Admin</router-link>
  </div>
</template>

<script setup>
// Template: Replace {{PROJECT_NAME}} with your actual project name
</script>

<style scoped>
.home {
  padding: 20px;
  text-align: center;
}
</style>