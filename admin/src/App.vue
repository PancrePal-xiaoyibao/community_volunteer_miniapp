<template>
  <div id="app">
    <el-container class="layout-container">
      <!-- 侧边栏菜单 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h3>小x宝志愿者</h3>
          <p>管理后台</p>
        </div>
        <el-menu
          :default-active="$route.path"
          router
          class="sidebar-menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/dashboard">
            <el-icon><House /></el-icon>
            <span>数据看板</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/activities">
            <el-icon><Calendar /></el-icon>
            <span>活动管理</span>
          </el-menu-item>
          <el-menu-item index="/tasks">
            <el-icon><Document /></el-icon>
            <span>任务管理</span>
          </el-menu-item>
          <el-menu-item index="/content">
            <el-icon><Files /></el-icon>
            <span>内容审核</span>
          </el-menu-item>
          <el-menu-item index="/messages">
            <el-icon><ChatDotRound /></el-icon>
            <span>消息推送</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <el-container>
        <el-header class="header">
          <div class="header-left">
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>{{ currentRouteTitle }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar size="small" :src="userStore.avatar" />
                <span style="margin-left: 8px">{{ userStore.name }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人设置</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const currentRouteTitle = computed(() => {
  const routeTitles: Record<string, string> = {
    '/dashboard': '数据看板',
    '/users': '用户管理',
    '/activities': '活动管理',
    '/tasks': '任务管理',
    '/content': '内容审核',
    '/messages': '消息推送'
  }
  return routeTitles[route.path] || '首页'
})

const handleLogout = () => {
  userStore.logout()
  // 这里可以添加退出登录逻辑
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
}

.logo {
  padding: 20px;
  text-align: center;
  color: white;
  border-bottom: 1px solid #475669;
}

.logo h3 {
  margin: 0;
  font-size: 18px;
}

.logo p {
  margin: 5px 0 0 0;
  font-size: 12px;
  opacity: 0.8;
}

.sidebar-menu {
  border: none;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>