<template>
  <div class="container employees">
    <div class="row mt-5 justify-content-between">
      <div class="col-12 col-md-3">
        <el-input v-model="searchInput" />
      </div>
      <div class="col-12 col-md-3">
        <button @click="dialogVisible = true" class="btn">
          Agregar
        </button>
        <el-button @click="showUSD">
          Ver en USD
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
                Salario MXN
              </th>
              <th v-if="salaryUSD">
                Salario USD
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
              <td class="text-right" :class="c.salary > 10000 ? 'salaryGood' : 'salaryBad' ">
                {{ currency(c.salary) }}
              </td>
              <td  class="text-right" v-if="salaryUSD">
                {{ showUSD(c.salary) }}
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
        <el-button @click="resetForm('ruleForm')" type="danger">Cancel</el-button>
        <button type="primary" @click="submitForm('ruleForm')" class="btn">
          Agregar
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import uuid from 'uuid/dist/v4'
export default {
  data () {
    return {
      dialogVisible: false,
      dialogEdit: false,
       ruleForm: {
          id: '',
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
      editEmployees: [],
      salaryUSD: false  
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
          this.ruleForm.id = uuid()
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
    showUSD (amount) {
      this.salaryUSD = true
      amount = parseFloat(amount)
      amount = amount / 21.50
      const option = { style: 'currency', currency: 'USD' }
      const numberFormat = new Intl.NumberFormat('en-US', option)
      return numberFormat.format(amount)
    },
    edit(id) {
      this.dialogEdit = true
      console.log(id)
      let result = this.employees.filter(c => c.id === id)
      result = JSON.stringify(result)
      this.editEmployees = JSON.parse(result)
      console.log(this.editEmployees)
    },
    remove(id) {
      console.log(id)
    }
  }
} 
</script>

<style>
.employees .btn{
  border: 2px solid rgb(4, 180, 4);
  color: rgb(4, 180, 4);
  background: none;
  border-radius: 5px;
  padding: .4rem 1rem;
  margin: 0 .4rem;
  transition: ease-in-out .3s;
}
.employees .add:hover{
  color: #fff;
  background: rgb(4, 180, 4);
}
.salaryGood{
  color: rgb(4, 180, 4);
}
.salaryBad{
  color: rgb(190, 9, 9);
}
</style>