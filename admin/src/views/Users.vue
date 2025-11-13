<template>
  <div class="users">
    <el-card>
      <template #header>
        <div class="table-header">
          <span>用户管理</span>
          <div class="header-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索用户昵称/手机号"
              style="width: 200px; margin-right: 10px;"
              clearable
            />
            <el-select v-model="filterStatus" placeholder="状态筛选" style="width: 120px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="正常" value="1" />
              <el-option label="冻结" value="0" />
            </el-select>
            <el-button type="primary" @click="exportUsers">导出数据</el-button>
          </div>
        </div>
      </template>

      <el-table :data="userList" v-loading="loading">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="用户信息" min-width="200">
          <template #default="scope">
            <div class="user-info">
              <el-avatar :size="40" :src="scope.row.avatar_url" />
              <div class="user-details">
                <div class="nickname">{{ scope.row.nickname }}</div>
                <div class="phone">{{ scope.row.phone }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="所在地" width="100" />
        <el-table-column label="身份标签" width="120">
          <template #default="scope">
            <el-tag v-for="tag in scope.row.industry_tags?.slice(0, 2)" :key="tag" size="small" style="margin-right: 5px;">
              {{ tag }}
            </el-tag>
            <span v-if="scope.row.industry_tags?.length > 2">+{{ scope.row.industry_tags.length - 2 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="volunteer_since" label="志愿年份" width="100" />
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '正常' : '冻结' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="隐私设置" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.searchable"
              active-text="可搜索"
              inactive-text="不可搜"
              @change="updateSearchable(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="viewDetail(scope.row)">详情</el-button>
            <el-button
              link
              :type="scope.row.status === 1 ? 'danger' : 'success'"
              size="small"
              @click="toggleStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '冻结' : '解冻' }}
            </el-button>
            <el-button link type="warning" size="small" @click="editUser(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  id: string
  nickname: string
  phone: string
  avatar_url: string
  location: string
  industry_tags: string[]
  volunteer_since: number
  status: number
  searchable: boolean
  created_at: string
}

const loading = ref(false)
const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const userList = ref<User[]>([
  {
    id: '1',
    nickname: '张三',
    phone: '138****1234',
    avatar_url: '',
    location: '北京',
    industry_tags: ['医疗机构-医生', 'AI公益组织'],
    volunteer_since: 2023,
    status: 1,
    searchable: true,
    created_at: '2025-01-15'
  },
  {
    id: '2',
    nickname: '李四',
    phone: '139****5678',
    avatar_url: '',
    location: '上海',
    industry_tags: ['教育机构-教师', '无障碍设计'],
    volunteer_since: 2022,
    status: 1,
    searchable: false,
    created_at: '2025-02-20'
  }
])

const loadUsers = async () => {
  loading.value = true
  // 这里调用API获取用户列表
  setTimeout(() => {
    loading.value = false
    total.value = userList.value.length
  }, 500)
}

const updateSearchable = (user: User) => {
  console.log('更新用户搜索权限:', user)
  // 调用API更新用户搜索权限
}

const viewDetail = (user: User) => {
  console.log('查看用户详情:', user)
  // 打开用户详情弹窗
}

const toggleStatus = (user: User) => {
  const newStatus = user.status === 1 ? 0 : 1
  console.log('切换用户状态:', user.id, newStatus)
  // 调用API切换用户状态
}

const editUser = (user: User) => {
  console.log('编辑用户:', user)
  // 打开编辑用户弹窗
}

const exportUsers = () => {
  console.log('导出用户数据')
  // 实现导出功能
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadUsers()
}

const handleCurrentChange = (page: number) => {
  currentPage.value = page
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users {
  padding: 0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  
  .user-details {
    margin-left: 10px;
    
    .nickname {
      font-weight: 500;
    }
    
    .phone {
      font-size: 12px;
      color: #909399;
    }
  }
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>