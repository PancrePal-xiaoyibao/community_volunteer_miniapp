<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalUsers }}</div>
              <div class="stat-label">注册用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon activity-icon">
              <el-icon><Calendar /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalActivities }}</div>
              <div class="stat-label">活动数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon task-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalTasks }}</div>
              <div class="stat-label">任务数量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon hour-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalHours }}</div>
              <div class="stat-label">服务总时长</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>用户增长趋势</span>
          </template>
          <div id="userChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>技能分布</span>
          </template>
          <div id="skillChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>待审核内容</span>
          </template>
          <el-table :data="pendingReviews" style="width: 100%">
            <el-table-column prop="type" label="类型" width="80" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="submitter" label="提交人" width="100" />
            <el-table-column prop="time" label="提交时间" width="120" />
            <el-table-column label="操作" width="120">
              <template #default="scope">
                <el-button link type="primary" size="small">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>最近活动</span>
          </template>
          <el-table :data="recentActivities" style="width: 100%">
            <el-table-column prop="title" label="活动名称" />
            <el-table-column prop="date" label="日期" width="100" />
            <el-table-column prop="participants" label="参与人数" width="80" />
            <el-table-column label="状态" width="80">
              <template #default="scope">
                <el-tag :type="scope.row.status === '进行中' ? 'success' : 'info'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const stats = ref({
  totalUsers: 1256,
  totalActivities: 89,
  totalTasks: 234,
  totalHours: 4567
})

const pendingReviews = ref([
  { type: '动态', title: '周末义诊活动分享', submitter: '张三', time: '2025-11-13' },
  { type: '证明', title: '服务时长证明上传', submitter: '李四', time: '2025-11-12' },
  { type: '举报', title: '不当言论举报', submitter: '王五', time: '2025-11-11' }
])

const recentActivities = ref([
  { title: '社区义诊活动', date: '2025-11-15', participants: 25, status: '进行中' },
  { title: 'AI公益培训', date: '2025-11-10', participants: 18, status: '已结束' },
  { title: '环保志愿活动', date: '2025-11-08', participants: 32, status: '已结束' }
])

onMounted(() => {
  // 这里可以初始化图表
  console.log('Dashboard mounted')
})
</script>

<style scoped>
.dashboard {
  padding: 0;
}

.stat-card {
  .stat-content {
    display: flex;
    align-items: center;
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      font-size: 24px;
      color: white;
    }
    
    .user-icon { background: #409EFF; }
    .activity-icon { background: #67C23A; }
    .task-icon { background: #E6A23C; }
    .hour-icon { background: #F56C6C; }
    
    .stat-info {
      .stat-value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
      }
      
      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 5px;
      }
    }
  }
}
</style>