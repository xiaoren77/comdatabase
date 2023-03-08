<template>
  <el-card class="box-card" wrap>
    <template #header>
      <el-button type="primary" @click="addSelectionRow" :icon="Plus">添加新数据</el-button>
      <el-dialog
          v-model="dialogVisible"
          title="添加新数据"
          width="30%"
      >
        <el-upload
            drag
            class="upload-demo"
            :auto-upload="false"
            :on-change="upload"
        >
          <el-icon class="el-icon--upload">
            <UploadFilled/>
          </el-icon>
          <div class="el-upload__text">
            拖拽文件上传或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              仅可提交.xls/.xlsx类型文件
            </div>
          </template>
        </el-upload>
      </el-dialog>
      <el-popconfirm
          title="确定删除数据 "
          @confirm="deleteSelectionRows"
          confirm-button-type="danger"
          cancel-button-type="primary">
        <template #reference>
          <el-button type="danger" :icon="Delete">删除所选数据</el-button>
        </template>
      </el-popconfirm>
      <el-button @click="checkAll">全选</el-button>
    </template>
    <div class="el-table">
      <el-table
          :data="recordList"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
          ref="tableRef">
        <el-table-column type="selection" width="55" />
        <template v-for="(value,index) in fieldNames" :key="index">
          <el-table-column :property="value" :label="value" width="250"/>
          <h1>{{value}}</h1>
        </template>
        <el-table-column align="right">

          <template #header>
            <el-input
                v-model="searchVal"
                class="search_input"
                placeholder="请输入实体主键查找数据"
                :prefix-icon="Search"
                @keyup.enter="searchBaseName"
            />
          </template>

          <template #default="scope">
            <el-popover placement="left" :width="400" trigger="click">
              <template #reference>
                <el-button style="margin-right: 16px" @click="showDetailedInfo">展示详细消息</el-button>
              </template>
            </el-popover>
          </template>

        </el-table-column>
      </el-table>

    </div>
    <div class="el-pagination">
      <el-pagination
          :page-count="page"
          :total="rows"
          v-model:current-page="currentPage"
          @current-change="handleCurrentChange"
          background
          layout="total, prev, pager, next, jumper"/>
    </div>
  </el-card>
</template>

<script>
import {getCurrentInstance, onMounted, ref} from "vue";
import {useRoute} from 'vue-router';
import {Delete, Plus, Search, UploadFilled} from "@element-plus/icons-vue/global";
import {ElMessage} from "element-plus";

export default {
  name: "Data",

  components: {
    UploadFilled,
  },

  setup() {
    const route = useRoute()
    const className = ref()
    const fieldNames=ref([])

    const commonRequest = getCurrentInstance().appContext.config.globalProperties.$commonRequest;
    const recordList = ref([])
    const searchVal = ref()
    const page = ref()
    const currentPage = ref(1)
    const tableRef = ref()
    const keyOfCheckedData = ref([])
    const rows = ref()
    const dialogVisible = ref(false)

    onMounted(() => {
      className.value = route.query.class
      getFieldNames()
    });

    function getFieldNames() {
      commonRequest({
        method: "get",
        url: `/${className.value}/fieldNames`
      }).then(res => {
        fieldNames.value = res.data.data.fieldNames;
      }).catch(err => {
        console.log(err)
      });
    }

    // 基于当前页数获取数据
    function getData(currentSize) {
      commonRequest({
        method: "get",
        url: `/${className.value}/page/${currentSize}`
      }).then(res => {
        recordList.value = res.data.data.recordList
        for (let row of recordList.value) {
          row.checked = false;
        }
      }).catch(err => {
        console.log(err)
      });
    }

    // 获取页数
    function getPageSize() {
      commonRequest({
        method: "get",
        url: `/${className.value}/page-count`
      }).then(res => {
        page.value = res.data.data.pageCount
      }).catch(err => {
        console.log(err)
      });
    }

    // 获取数据行数
    function getRows() {
      commonRequest({
        method: "get",
        url: `/${className.value}/rows-size`
      }).then(res => {
        rows.value = res.data.data.rowsSize
      }).catch(err => {
        console.log(err)
      });
    }

    // 处理被选中数据checked属性
    // 手动选择实体主键
    function handleSelectionChange() {
      keyOfCheckedData.value=[]

      for (let data of recordList.value) {
        data.checked = false
      }

      const selectionRows = tableRef.value.getSelectionRows();
      for (let selectionRow of selectionRows) {
        selectionRow.checked = true;
        // 直接向keyOfCheckedData里填充完整数据 而不是主键值
        const classNameValue = className.value;
        if (classNameValue === "cds") {
          keyOfCheckedData.value.push(selectionRow.cdsId);
        }
      }
    }

    // 删除所选数据
    function deleteSelectionRows() {
      commonRequest({
        method: "delete",
        url: `/${className.value}/delete`,
        params: {
          ids: getSerializedData()
        }
      }).then(res => {
      }).catch(err => {
        console.log(err)
      });

      commonRequest({
        method: "get",
        url: `/${className.value}/rows-size`
      }).then(res => {
        rows.value = res.data.data.rowsSize
      }).catch(err => {
        console.log(err)
      });

      const newDataList=[]
      for (let data of recordList.value) {
        if (data.checked===false) {
          newDataList.push(data)
        }
      }
      recordList.value=newDataList

    }

    // 添加数据
    function addSelectionRow() {
      dialogVisible.value = true;
    }

    // 切换页数
    function handleCurrentChange(newVal) {
      getData(newVal)
    }

    function getSerializedData() {
      let stringify = JSON.stringify(keyOfCheckedData.value);
      stringify = stringify.substring(1, stringify.length - 1);
      return stringify;
    }

    function searchBaseName() {
      commonRequest({
        method: "get",
        url: `/${className.value}/search/${searchVal.value}`
      }).then(res => {
        recordList.value = res.data.data.recordList
        for (let row of recordList.value) {
          row.checked = false;
        }
      }).catch(err => {
        console.log(err)
      });
      searchVal.value = "";
    }

    // 展示某数据行详细消息
    function showDetailedInfo() {
    }

    // 文件上传
    function upload(uploadFile) {
      ElMessage({
        message: '文件上传成功',
        type: 'success',
      })
      commonRequest({
        method: "post",
        url: `/${className.value}/upload`,
        data: {
          'file': uploadFile.raw,
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        const code = res.data.code;
        const message = res.data.message;

        if (code==="A0005") {
          ElMessage({
            message: message,
            type: 'success',
          })
        }else {
          ElMessage({
            message: message,
            type: 'error',
          })
        }
      }).catch(error => {
        ElMessage({
          message: '数据添加失败',
          type: 'error',
        })
      });
    }

    // 全选数据
    function checkAll() {
      tableRef.value.toggleAllSelection();
    }

    onMounted(() => {
      getData(1)
      getPageSize()
      getRows()
    })

    return{
      route,
      recordList,
      page,
      searchVal,
      Plus,
      Delete,
      Search,
      currentPage,
      tableRef,
      keyOfCheckedData,
      rows,
      dialogVisible,
      fieldNames,
      searchBaseName,
      handleSelectionChange,
      deleteSelectionRows,
      handleCurrentChange,
      addSelectionRow,
      showDetailedInfo,
      upload,
      checkAll
    }
  },
}
</script>

<style scoped>
  .el-table{
    margin-bottom: 10px;
  }
  .el-pagination {
    margin: auto;
  }
  .search_input {
    width: 300px;
    margin-left: 10px;
  }
</style>
