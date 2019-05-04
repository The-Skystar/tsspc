<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 待取件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10">批量处理</el-button>
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="下单日期">
        </el-date-picker>
        &nbsp;
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table :data="form" border class="table" v-loading="listLoading" ref="multipleTable" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间" sortable width="170px">
        </el-table-column>
        <el-table-column prop="orderCode" label="订单号" width="150px">
        </el-table-column>
        <el-table-column prop="senderName" label="寄件人" width="80px">
        </el-table-column>
        <el-table-column prop="senderPhone" label="联系电话" width="130px">
        </el-table-column>
        <el-table-column prop="senderAddress" label="寄件地址">
        </el-table-column>
        <el-table-column prop="receiverName" label="寄件人" width="80px">
        </el-table-column>
        <el-table-column prop="receiverPhone" label="联系电话" width="130px">
        </el-table-column>
        <el-table-column prop="receiverAddress" label="寄件地址">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">通知付款</el-button>
            <!--<el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
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
    name: "NotPay",
    data () {
      return {
        orderData: [],
        cur_page: 1,
        multipleSelection: [],
        select_cate: '',
        select_word: '',
        del_list: [],
        is_search: false,
        editVisible: false,
        delVisible: false,
        form: [],
        idx: -1,
        value1: '',
        pageSize: 10,
        total: 32,
        orderDetil:{
          orderTime:"",
          senderAddress: "",
          receiverAddress: '',
          weight:'',
          cost:'',
          orderId:'',
        },
        listLoading:false,
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
        this.listLoading = true
        let self = this;
        this.$axios.get('/tss/getOrder?status=3', config).then(function (res) {
          self.orderData = res.data.data;
          self.total = res.data.data.length;
          self.getFormData(self.orderData, 1);
          self.listLoading = false
        })
      },
      getFormData (data) {
        let form = [];
        let orders = data.slice((this.cur_page - 1) * this.pageSize,this.cur_page*this.pageSize);
        for (let order in orders) {
          let orderForm = {
            orderId: orders[order].orderId,
            orderTime: this.getFormatDate(new Date(orders[order].orderTime)),
            orderCode: orders[order].orderCode,
            senderName: orders[order].sender.name,
            senderPhone: orders[order].sender.phone,
            senderAddress: orders[order].sender.province + orders[order].sender.city + orders[order].sender.county + orders[order].sender.street + orders[order].sender.address,
            appointTime: this.getFormatDate(new Date(orders[order].startTime)),
            receiverName:orders[order].receiver.name,
            receiverPhone:orders[order].receiver.phone,
            receiverAddress:orders[order].receiver.province + orders[order].receiver.city + orders[order].receiver.county + orders[order].receiver.street + orders[order].receiver.address,
          }
          form.push(orderForm);
        }
        this.form = form;
        console.log(this.form)
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
        let currentdate = year + seperator1 + month + seperator1 + strDate + " " + hour +":" + minutes + ":" + seconds;
        return currentdate;
      },
      search () {
        this.is_search = true
        let user = JSON.parse(sessionStorage.getItem("user"))
        let config = {
          headers: {
            'token': sessionStorage.getItem("token"),
            'userId': user.userId
          }
        }
        let self = this;
        if (this.value1 != null && this.value1 != "" && (this.select_word == null || this.select_word === "")) {
          this.listLoading = true
          this.$axios.get("/tss/searchByTime?time=" + this.getFormat(this.value1) + "&status=3", config).then(function (res) {
            self.orderData = res.data.data;
            self.total = res.data.data.length;
            self.getFormData(self.orderData, 1);
            self.listLoading = false
          })
        }
        if (this.select_word!=null&&this.select_word!=""&&(this.value1 == null || this.value1 === "")){
          this.listLoading = true
          this.$axios.get("/tss/serachAllColumn?conditions=" + this.select_word + "&status=3", config).then(function (res) {
            self.orderData = res.data.data;
            self.total = res.data.data.length;
            self.getFormData(self.orderData, 1);
            self.listLoading = false
          })
        }
        if (this.value1 != null && this.value1 != "" &&this.select_word!=null&&this.select_word!="") {
          this.listLoading = true
          this.$axios.get("/tss/search?conditions=" + this.select_word + "&status=3&time=" + this.getFormat(this.value1) , config).then(function (res) {
            self.orderData = res.data.data;
            self.total = res.data.data.length;
            self.getFormData(self.orderData, 1);
            self.listLoading = false
          })
        }
        if ((this.select_word == null || this.select_word === "")&&(this.value1 == null || this.value1 === "")) {
          this.getData()
        }
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      getFormat (date) {
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
