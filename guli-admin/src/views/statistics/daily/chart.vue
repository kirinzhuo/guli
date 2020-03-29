<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-select v-model="searchObj.type" clearable placeholder="请选择">
          <el-option label="学员登录数统计" value="login_num"/>
          <el-option label="学员注册数统计" value="register_num"/>
          <el-option label="课程播放数统计" value="video_view_num"/>
          <el-option label="每日课程数统计" value="course_num"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="searchObj.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()">查询</el-button>
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import daily from '@/api/statistics/daily'

export default {
  data() {
    return {
      searchObj: {
        type: '',
        begin: '',
        end: ''
      },
      btnDisabled: false,
      title: '',
      xData: [],
      yData: []
    }
  },

  methods: {

    showChart() {
      daily.showChart(this.searchObj).then(response => {
        this.xData = response.data.xData
        this.yData = response.data.yData

        this.setChart()
      })
    },

    setChart() {
      switch (this.searchObj.type) {
        case 'login_num':
          this.title = '登录数统计'
          break

        case 'register_num':
          this.title = '注册数统计'
          break

        case 'video_view_num':
          this.title = '课程播放数统计'
          break

        case 'course_num':
          this.title = '新增课程数统计'
          break

        default:
          break
      }

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('chart'))

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: this.title
        },
        tooltip: {},
        legend: {
          data: [this.title]
        },
        xAxis: {
          data: this.xData
        },
        yAxis: {},
        series: [{
          name: this.title,
          type: 'bar',
          data: this.yData
        }],
        dataZoom: [{
          type: 'slider',
          height: 8,
          bottom: 20,
          borderColor: 'transparent',
          backgroundColor: '#e2e2e2',
          handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
          handleSize: 20,
          handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
          }
        }, {
          type: 'inside'
        }]
      }
      myChart.setOption(option)
    }
  }
}
</script>
