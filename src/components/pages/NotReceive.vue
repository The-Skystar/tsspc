<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-cascades"></i> 待处理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchReceive">批量处理</el-button>
        <el-date-picker
          v-model="value1"
          type="date"
          placeholder="下单日期">
        </el-date-picker>
        &nbsp;
        <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" clearable></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
      </div>
      <el-table :data="form" border class="table" v-loading="listLoading" ref="multipleTable" @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="orderTime" label="下单时间" sortable width="170px">
        </el-table-column>
        <el-table-column prop="orderCode" label="订单号" width="160px">
        </el-table-column>
        <el-table-column prop="senderName" label="寄件人" width="140px">
        </el-table-column>
        <el-table-column prop="senderPhone" label="联系电话" width="150px">
        </el-table-column>
        <el-table-column prop="senderAddress" label="寄件地址">
        </el-table-column>
        <el-table-column prop="appointTime" label="预约时间" sortable width="170px">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEdit(scope.$index, scope.row)">接单</el-button>
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

    <!-- 编辑弹出框 -->
    <el-dialog title="订单详情" :visible.sync="editVisible" width="30%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="预约时间">
          <el-date-picker type="datetime" placeholder="预约时间" v-model="orderDetil.orderTime" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="orderDetil.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="orderDetil.address"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
    </el-dialog>

    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
  import bus from '../common/bus'
  export default {
    name: 'NotReceive',
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
        listLoading: false,
        form: [],
        idx: -1,
        value1: '',
        pageSize: 10,
        total: 32,
        orderDetil: {
          orderTime: "",
          phone:"",
          address:"",
          orderId:''
        },
      }
    },
    created () {
      this.getData()
    },
    computed: {},
    methods: {
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
        this.$axios.get('/tss/getOrder?status=1', config).then(function (res) {
          self.orderData = res.data.data;
          self.total = res.data.data.length;
          bus.$emit("number1",self.total)
          self.getFormData(self.orderData, 1);
          self.listLoading = false
        }).catch(function () {
          self.$message.error("系统错误")
          self.listLoading = false
        })
      },
      getFormData (data) {
        let form = [];
        let orders = data.slice((this.cur_page - 1) * this.pageSize, this.cur_page * this.pageSize);
        for (let order in orders) {
          let orderForm = {
            orderId:orders[order].orderId,
            orderTime: this.getFormatDate(new Date(orders[order].orderTime)),
            orderCode: orders[order].orderCode,
            senderName: orders[order].sender.name,
            senderPhone: orders[order].sender.phone,
            senderAddress: orders[order].sender.province + orders[order].sender.city + orders[order].sender.county + orders[order].sender.street + orders[order].sender.address,
            appointTime: this.getFormatDate(new Date(orders[order].startTime))
          }
          form.push(orderForm);
        }
        this.form = form;
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
          this.$axios.get("/tss/searchByTime?time=" + this.getFormat(this.value1) + "&status=1", config).then(function (res) {
            self.orderData = res.data.data;
            self.total = res.data.data.length;
            self.getFormData(self.orderData, 1);
            self.listLoading = false
          }).catch(function () {
            self.$message.error("系统错误")
            self.listLoading = false
          })
        }
        if (this.select_word!=null&&this.select_word!=""&&(this.value1 == null || this.value1 === "")){
          this.listLoading = true
          this.$axios.get("/tss/serachAllColumn?conditions=" + this.select_word + "&status=1", config).then(function (res) {
            self.orderData = res.data.data;
            self.total = res.data.data.length;
            self.getFormData(self.orderData, 1);
            self.listLoading = false
          }).catch(function () {
            self.$message.error("系统错误")
            self.listLoading = false
          })
        }
        if (this.value1 != null && this.value1 != "" &&this.select_word!=null&&this.select_word!="") {
          this.listLoading = true
          this.$axios.get("/tss/search?conditions=" + this.select_word + "&status=1&time=" + this.getFormat(this.value1) , config).then(function (res) {
            self.orderData = res.data.data;
            self.total = res.data.data.length;
            self.getFormData(self.orderData, 1);
            self.listLoading = false
          }).catch(function () {
            self.$message.error("系统错误")
            self.listLoading = false
          })
        }
        if ((this.select_word == null || this.select_word === "")&&(this.value1 == null || this.value1 === "")) {
          this.getData()
        }
      },
      formatter (row, column) {
        return row.address
      },
      filterTag (value, row) {
        return row.tag === value
      },
      handleEdit (index, row) {
        this.idx = index
        const item = this.form[index]
        this.orderDetil = {
          orderTime: item.appointTime,
          phone:item.senderPhone,
          address:item.senderAddress,
          orderId:item.orderId
        }
        this.editVisible = true
      },
      handleDelete (index, row) {
        this.idx = index
        this.delVisible = true
      },
      batchReceive () {
        const length = this.multipleSelection.length
        let orderIds = ""
        for (let i = 0;i<length;i++){
          if (i === length-1)
            orderIds += this.multipleSelection[i].orderId
          else
            orderIds += this.multipleSelection[i].orderId + ","
        }
        let user = JSON.parse(sessionStorage.getItem("user"))
        let config = {
          headers: {
            'token': sessionStorage.getItem("token"),
            'userId': user.userId
          }
        }
        let self = this;
        this.$axios.get("/tss/batchReceive?orderId="+orderIds,config).then(function (res) {
          if (res.data.code==408){
            self.$message.success('已接单')
            self.getData()
          }
          else
            self.$message.error("接单失败")
        }).catch(function (res) {
          self.$message.error("接单失败")
      })
      },
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 保存编辑
      saveEdit () {
        let user = JSON.parse(sessionStorage.getItem("user"))
        let config = {
          headers: {
            'token': sessionStorage.getItem("token"),
            'userId': user.userId
          }
        }
        let self = this;
        this.$axios.get("/tss/receiveOrder?orderId="+this.orderDetil.orderId,config).then(function (res) {
          if (res.data.code==408){
            self.$message.success('接单成功')
            self.getData()
          } else {
            self.$message.error(res.data.msg)
          }
        }).catch(function () {
          self.$message.error("系统错误")
          self.listLoading = false
        })
        this.editVisible = false;
      },
      // 确定删除
      deleteRow () {
        this.tableData.splice(this.idx, 1)
        this.$message.success('删除成功')
        this.delVisible = false
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
