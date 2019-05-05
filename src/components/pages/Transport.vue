<template>
    <div>
      <div class="crumbs">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 订单管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container">
        <div class="handle-box">
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
          <el-form :inline="true" :model="filters">
            <el-date-picker
              v-model="filters.orderTime"
              type="date"
              placeholder="订单日期"
              clearable>
            </el-date-picker>
            <!--<el-form-item>-->
              <!--<el-input v-model="filters.orderCode" placeholder="订单号" clearable></el-input>-->
            <!--</el-form-item>-->
            <el-form-item>
              <el-input v-model="filters.key" placeholder="关键词" clearable></el-input>
            </el-form-item>
            <el-select v-model="filters.status" clearable placeholder="订单状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        </div>
        <!--<template>-->
          <el-table :data="orders" highlight-current-row v-loading="listLoading" stripe style="width: 100%;">
            <el-table-column prop="orderTime" label="下单时间" sortable width="140px">
            </el-table-column>
            <el-table-column prop="orderCode" label="订单号" width="130" sortable>
            </el-table-column>
            <el-table-column label="寄件人">
              <el-table-column prop="senderName" label="姓名"></el-table-column>
              <el-table-column prop="senderPhone" label="手机号"></el-table-column>
              <el-table-column prop="senderAddress" label="地址"></el-table-column>
              <el-table-column prop="senderPostcode" label="邮编"></el-table-column>
            </el-table-column>
            <el-table-column label="收件人">
              <el-table-column prop="receiverName" label="姓名"></el-table-column>
              <el-table-column prop="receiverPhone" label="手机号"></el-table-column>
              <el-table-column prop="receiverAddress" label="地址"></el-table-column>
              <el-table-column prop="receiverPostcode" label="邮编"></el-table-column>
            </el-table-column>
            <el-table-column prop="cost" label="运费" width="120" sortable>
            </el-table-column>
            <el-table-column prop="status" label="订单状态" width="100">

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
    name: "transport",
    data() {
      return {
        filters: {
          orderTime:'',
          key:'',
          status:''
        },
        loading: false,
        orderData:[],
        orders: [],
        options:[{
          value:1,
          label:'待接单',
          },
          {
            value:2,
            label:'待取件',
          },
          {
            value:3,
            label:'待付款',
          },
          {
            value:4,
            label:'运输中',
          },
          {
            value:5,
            label:'疑难件',
          },
          {
            value:6,
            label:'已完成',
          }
        ],
        value:'',
        cur_page:1,
        pageSize:10,
        total:1,
        listLoading:false,
      }
    },
    created () {
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
        this.$axios.get('/tss/getOrder', config).then(function (res) {
          self.orderData = res.data.data;
          self.total = res.data.data.length;
          self.getFormData(self.orderData, 1);
          self.listLoading = false
        })
      },
      getFormData (data) {
        let form = [];
        let orders = data.slice((this.cur_page - 1) * this.pageSize, this.cur_page * this.pageSize);
        for (let order in orders) {
          let orderInfo = {
            orderId:orders[order].orderId,
            orderTime: this.getFormatDate(new Date(orders[order].orderTime)),
            orderCode: orders[order].orderCode,
            senderName: orders[order].sender.name,
            senderPhone: orders[order].sender.phone,
            senderAddress: orders[order].sender.province + orders[order].sender.city + orders[order].sender.county + orders[order].sender.street + orders[order].sender.address,
            senderPostcode:orders[order].sender.postCode,
            receiverName: orders[order].receiver.name,
            receiverPhone: orders[order].receiver.phone,
            receiverAddress: orders[order].receiver.province + orders[order].receiver.city + orders[order].receiver.county + orders[order].receiver.street + orders[order].receiver.address,
            receiverPostcode:orders[order].receiver.postCode,
            cost:orders[order].cost,
            status:this.getStatus(orders[order].status)
          }
          form.push(orderInfo);
        }
        this.orders = form;
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
      getStatus(code){
        switch (code) {
          case '1':
            return '待接单';
            break;
          case '2':
            return '待取件';
            break;
          case '3':
            return '待付款';
            break;
          case '4':
            return '待派送';
            break;
          case '5':
            return '运送中';
            break;
          case '6':
            return '已完成';
            break;
          case '7':
            return '疑难件';
            break;
          default:
            break;
        }
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
        this.$axios.get('/tss/searchAll?time='+this.getFormat(this.filters.orderTime)+'&conditions='+this.filters.key+'&status='+this.filters.status, config).then(function (res) {
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
  .pagination {
    margin: 20px 0;
    text-align: right;
  }
  .crumbs {
    margin: 10px 0;
  }
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  .handle-box {
    margin-bottom: 20px;
  }
</style>
