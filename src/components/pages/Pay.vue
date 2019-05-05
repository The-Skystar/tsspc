<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 待处理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-date-picker
          v-model="startTime"
          type="date"
          placeholder="开始日期">
        </el-date-picker>
        <el-date-picker
          v-model="endTime"
          type="date"
          placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
    <el-table :data="pay" highlight-current-row v-loading="listLoading" stripe style="width: 100%;">
      <el-table-column prop="time" label="统计日期" sortable>
      </el-table-column>
      <el-table-column prop="costTotal" label="下单额" sortable>
      </el-table-column>
      <el-table-column prop="collection" label="收款额"></el-table-column>
      <el-table-column prop="refund" label="退款额"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize"
                     :total="total">
      </el-pagination>
    </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Pay",
    data(){
      return{
        orderData:[],
        listLoading:false,
        pay:[],
        cur_page:1,
        pageSize:10,
        total:1,
        startTime:'',
        endTime:''
      }
    },
    created(){
      this.getData()
    },
    methods:{
      // 分页导航
      handleCurrentChange (val) {
        this.cur_page = val
        this.getFormData(this.orderData, this.cur_page)
      },
      // 获取 easy-mock 的模拟数据
      getData () {
        let user = JSON.parse(sessionStorage.getItem("user"))
        let config = {
          headers: {
            'token': sessionStorage.getItem("token"),
            'userId': user.userId
          }
        }
        let self = this;
        this.listLoading = true
        this.$axios.get('/tss/costTotal?time='+this.getFormat(new Date()), config).then(function (res) {
          self.orderData = res.data.data;
          self.total = res.data.data.length;
          self.getFormData(self.orderData, 1);
          self.listLoading = false
        }).catch(function () {
          self.$message.error("系统错误")
          self.listLoading = false
        })
      },
      getFormData (data) {
        let form = [];
        console.log(data.length)
        let orders = data.slice((this.cur_page - 1) * this.pageSize, this.cur_page * this.pageSize);
        for (let order in orders) {
          let orderInfo = {
            time:orders[order].time,
            costTotal:orders[order].costTotal,
            collection:orders[order].collection,
            refund:0
          }
          form.push(orderInfo);
        }
        this.pay = form;
      },
      getFormatDate (date) {
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        let hour = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        if (hour >= 0 && hour <= 9) {
          hour = "0" + hour;
        }
        if (minutes >= 0 && minutes <= 9) {
          minutes = "0" + minutes;
        }
        if (seconds >= 0 && seconds <= 9) {
          seconds = "0" + seconds;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate + " " + hour + ":" + minutes + ":" + seconds;
        return currentdate;
      },
      getFormat (date) {
        if (!(date!=null&&date.length!=0))
          return '';
        let seperator1 = "-";
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
      },
      search(){
        let user = JSON.parse(sessionStorage.getItem("user"))
        let config = {
          headers: {
            'token': sessionStorage.getItem("token"),
            'userId': user.userId
          }
        }
        let self = this;
        this.listLoading = true
        this.$axios.get("/tss/costTotalBet?startTime="+this.getFormat(this.startTime)+"&endTime="+this.getFormat(this.endTime),config).then(function (res) {
          self.orderData = res.data.data;
          self.total = res.data.data.length;
          self.getFormData(self.orderData, 1);
          self.listLoading = false
        }).catch(function () {
          self.$message.error("系统错误")
          self.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .del-dialog-cnt {
    font-size: 16px;
    text-align: center
  }

  .table {
    width: 100%;
    font-size: 14px;
  }

  .red {
    color: #ff0000;
  }

  .mr10 {
    margin-right: 10px;
  }
</style>
