<template>
  <div id="app">
    <el-container>
      <el-header class="header">
        <h1>JSON Editor Vue3 组件示例</h1>
        <div class="header-info">
          <el-tag type="success">Vue 3 + Vite + Element Plus</el-tag>
          <el-tag type="primary">Monaco Editor</el-tag>
        </div>
      </el-header>

      <el-container>
        <el-aside width="250px" class="sidebar">
          <el-menu :default-active="$route.path" class="menu" router unique-opened>
            <el-menu-item index="/basic">
              <el-icon><Document /></el-icon>
              <span>基础功能</span>
            </el-menu-item>
            <el-menu-item index="/advanced">
              <el-icon><Setting /></el-icon>
              <span>高级功能</span>
            </el-menu-item>
            <el-menu-item index="/utils">
              <el-icon><Tools /></el-icon>
              <span>工具函数</span>
            </el-menu-item>
            <el-menu-item index="/comparison">
              <el-icon><TrendCharts /></el-icon>
              <span>JSON 比较</span>
            </el-menu-item>
            <el-menu-item index="/field-operations">
              <el-icon><Operation /></el-icon>
              <span>字段操作</span>
            </el-menu-item>
            <el-menu-item index="/form">
              <el-icon><Grid /></el-icon>
              <span>表单集成</span>
            </el-menu-item>
            <el-menu-item index="/height-control">
              <el-icon><Monitor /></el-icon>
              <span>高度控制</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {
  Document,
  Setting,
  Tools,
  TrendCharts,
  Operation,
  Grid,
  Monitor,
} from '@element-plus/icons-vue'
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #409eff;
  color: white;
  padding: 0 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}

.header-info {
  display: flex;
  gap: 10px;
}

.sidebar {
  border-right: 1px solid #e6e6e6;
  min-height: calc(100vh - 60px);
}

.menu {
  border-right: none;
}

.main-content {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}
</style>
