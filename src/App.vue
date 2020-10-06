<template>
  <div class="container">
    <div class="row mt-5 justify-content-between">
      <div class="col-12 col-md-3">
        <el-input v-model="searchInput" />
      </div>
      <div class="col-12 col-md-2">
        <el-button @click="dialogVisible = true">
          Agregar
        </el-button>
      </div>
    </div>
    <div class="row mt-5 justify-content-center">
      <div class="col-12">
        <span>
          Total de empleados {{ employees.length }}
        </span>
        <table class="mt-2 table table-striped table-hover">
          <thead>
            <tr>
              <th>
                Nombre
              </th>
              <th>
                Salario
              </th>
              <th>
                Empresa
              </th>
              <th>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c, index) in displayCategories" :key="index">
              <td>
                {{ c.name }}
              </td>
              <td>
                {{ currency(c.salary) }}
              </td>
              <td>
                {{ c.enterprise }}
              </td>
              <td>
                <el-button @click="edit(index)" type="primary" icon="el-icon-edit" circle />
                <el-button @click="remove(c.id)" type="danger" icon="el-icon-delete" circle />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" >
        <el-form-item prop="name">
          <span>
            Nombre
          </span>
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item prop="salary">
          <span>
            Salario
          </span>
          <el-input type="number" v-model="ruleForm.salary" />
        </el-form-item>
        <el-form-item prop="enterprise">
          <span>
            Empresa
          </span>
          <el-input v-model="ruleForm.enterprise" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">Cancel</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">
          Agregar
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  data () {
    return {
      dialogVisible: false,
       ruleForm: {
          name: '',
          salary: '',
          enterprise: ''
        },
        rules: {
          name: [
            { required: true, message: 'Nombre es requerido', trigger: 'blur' },
            { min: 3, message: 'Nombre debe de tener min 3 caracteres', trigger: 'blur' }
          ],
          salary: [
            { required: true, message: 'Salario es requerido', trigger: 'blur' }
          ],
          enterprise: [
            { required: true, message: 'Empresa es requerido', trigger: 'blur' }
          ],
        },
      searchInput: '',
      employees: [],
      // employees: [
      //     {
      //       id: 1,
      //       name: 'Yisus',
      //       price: 9200,
      //       enterprise: 'Microsoft'
      //     },
      //     {
      //       id: 2,
      //       name: 'Emanuel',
      //       price: 10000.123,
      //       enterprise: 'Oracle'
      //     },
      //     {
      //       id: 3,
      //       name: 'MArio',
      //       price: 21000.563,
      //       enterprise: 'Bungie'
      //     },
      //     {
      //       id: 4,
      //       name: 'Other Yisus',
      //       price: 9200,
      //       enterprise: 'Microsoft'
      //     }
      //   ]
      }
    },
  computed: {
    displayCategories () {
      const employees = this.employees
      const searchInput = this.searchInput
      return employees.filter(c => {
        return c.name.toLowerCase().includes(searchInput.toLowerCase()) || c.name.toUpperCase().includes(searchInput.toUpperCase()) && c.enterprise.toLowerCase().includes(searchInput.toLowerCase()) || c.enterprise.toUpperCase().includes(searchInput.toUpperCase())
      })
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.employees.push(Vue.util.extend({}, this.ruleForm))
          this.resetForm(formName)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields();
    },
    currency (amount) {
      amount = parseFloat(amount)
      const option = { style: 'currency', currency: 'USD' }
      const numberFormat = new Intl.NumberFormat('en-US', option)
      return numberFormat.format(amount)
    },
    edit(id) {
      console.log(id)
    },
    remove(id) {
      console.log(id)
    }
  }
} 
</script>

<style>

</style>