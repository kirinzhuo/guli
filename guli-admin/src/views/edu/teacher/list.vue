<template>
  <div class="app-container">

    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <!-- <el-input v-model="searchObj.name" placeholder="讲师名"/> -->
        <el-autocomplete
          v-model="searchObj.name"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          class="inline-input"
          placeholder="请输入讲师名称"
          value-key="name"
        />
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          type="date"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          type="date"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>

    </el-form>

    <!-- 工具栏 -->
    <div style="margin-bottom: 10px">
      <el-button type="danger" size="mini" @click="batchRemove()">批量删除</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      stripe
      @selection-change="handleSelectionChange">

      <el-table-column
        type="selection"
        width="55"/>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column label="头衔" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.level === 1">
            <el-tag type="success" size="mini">高级讲师</el-tag>
          </span>
          <span v-if="scope.row.level === 2">
            <el-tag size="mini">首席讲师</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="joinDate" label="入驻时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.joinDate | formatDate }}
        </template>
      </el-table-column>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 50]"
      :current-page="page"
      style="padding: 30px 0; text-align: center;"
      layout="sizes, prev, pager, next, jumper, ->, total, slot"
      @current-change="fetchData"
      @size-change="changeSize"
    />
  </div>

</template>

<script>
import teacherApi from '@/api/edu/teacher'
export default {
  filters: {
    formatDate(fullDateString) {
      return fullDateString.substring(0, 10)
    }
  },

  data() {
    return {
      listLoading: true, // 实现显示数据加载的状态图标
      page: 1, // 页码
      limit: 5, // 每页记录数
      searchObj: {}, // 查询对象
      list: [], // 讲师列表
      total: 0, // 总记录数
      multipleSelection: [] // 多选项目列表
    }
  },

  created() {
    this.fetchData()
  },

  methods: {

    // 获取讲师列表
    fetchData(currentPage = 1) {
      // console.log('currentPage', currentPage)
      this.page = currentPage
      this.listLoading = true
      teacherApi.getPageList(this.page, this.limit, this.searchObj).then(response => {
        console.log(response)
        this.list = response.data.rows
        this.total = response.data.total
        this.listLoading = false // 数据加载成功
      })
    },

    // 切换每页条数
    changeSize(size) {
      console.log('size', size)
      this.limit = size
      this.fetchData()
    },

    // 重置表单
    resetData() {
      this.searchObj = {}
      this.fetchData()
    },

    // 根据id删除讲师信息
    removeDataById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return teacherApi.removeById(id)
      }).then(response => {
        this.fetchData()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 批量删除选项发生变化时
    handleSelectionChange(selection) {
      console.log(selection)
      this.multipleSelection = selection
    },

    // 批量删除
    batchRemove() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择要删除的记录'
        })

        return
      }

      this.$confirm('此操作将永久删除这些记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const idList = []
        this.multipleSelection.forEach(item => {
          idList.push(item.id)
        })
        return teacherApi.batchRemove(idList)
      }).then(response => {
        this.fetchData()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    querySearch(queryString, cb) {
      console.log('querySearch')
      // console.log('queryString', queryString)
      console.log('cb', cb)
      // 根据queryString的输入查询数据库中的数据
      teacherApi.selectNameListByKey(queryString).then(response => {
        // 调用 callback 返回建议列表的数据
        cb(response.data.nameList)
      })
    }
    // handleSelect(item) {
    //   console.log('handleSelect')
    //   console.log('item', item)
    // }
  }
}
</script>
