<template>
  <div class="container employees">
    <div class="row mt-5 justify-content-between">
      <div class="col-12 col-md-3">
        <el-input v-model="searchInput" suffix-icon="el-icon-search"/>
      </div>
      <div class="col-12 col-md-3">
        <button @click="dialogAdd = true" class="button">
          Agregar
        </button>
        <el-button type="warning" plain @click="showUSD">
          Ver en USD
        </el-button>
      </div>
    </div>
    <div class="row mt-5 justify-content-center">
      <div class="col-12">
        <span>
          Total de empleados {{ totalEmployees.length }}
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
            <tr v-for="(c, index) in displayEmployees" :key="index">
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
                <el-button @click="edit(c._id)" type="primary" icon="el-icon-edit" circle />
                <el-button @click="remove(c._id)" type="danger" icon="el-icon-delete" circle />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Add -->
    <el-dialog
      :visible.sync="dialogAdd"
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
        <el-button @click="resetForm('ruleForm')" type="danger">
          Cancelar
        </el-button>
        <button type="primary" @click="submitForm('ruleForm')" class="button">
          Agregar
        </button>
      </span>
    </el-dialog>
    <!-- Edit -->
    <el-dialog
      :visible.sync="dialogEdit"
    >
      <el-form >
        <el-form-item>
          <span>
            Nombre
          </span>
          <el-input v-model="editEmployees.name" />
        </el-form-item>
        <el-form-item>
          <span>
            Salario
          </span>
          <el-input type="number" v-model="editEmployees.salary" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="dialogEdit = false">
          Cancelar
        </el-button>
        <button type="primary" @click="editSubmit(editEmployees._id)" class="button">
          Editar
        </button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      totalEmployees: [],
      editEmployees: [],
      dialogAdd: false,
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
      salaryUSD: false  
    }
  },
  computed: {
    displayEmployees () {
      const employees = this.totalEmployees
      const searchInput = this.searchInput
      return employees.filter(c => {
        return c.name.toLowerCase().includes(searchInput.toLowerCase()) || c.name.toUpperCase().includes(searchInput.toUpperCase()) && c.enterprise.toLowerCase().includes(searchInput.toLowerCase()) || c.enterprise.toUpperCase().includes(searchInput.toUpperCase())
      })
    }
  },
  created(){
    this.list()
  },
  methods: {
    list () {
      axios.get('employee')
        .then(response => {
          this.totalEmployees = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios.post('employee/add', this.ruleForm)
            .then(() => {
              this.resetForm(formName)
              this.list()
            })
            .catch(error => {
              console.log(error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.dialogAdd = false
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
      axios.get(`employee/${id}`)
        .then(response => {
          this.editEmployees = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    editSubmit(id){
      const name = this.editEmployees.name
      const salary = this.editEmployees.salary
      const employeeObj = {
        name,
        salary
      }
      axios.put(`employee/update/${id}`, employeeObj )
        .then(() => {
          this.dialogEdit = false
          this.list()
        })
        .catch(error => {
          console.log(error)
        })
    },
    remove(id) {
      axios.delete(`employee/delete/${id}`)
        .then(() => {
          this.list()
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
} 
</script>

<style lang="sass" scoped>
.employees 
  .button
    border: 2px solid rgb(4, 180, 4)
    color: rgb(4, 180, 4)
    background: none
    border-radius: 5px
    padding: .4rem 1rem
    margin: 0 .4rem
    transition: ease-in-out .3s
    &:hover
      color: #fff
      background: rgb(4, 180, 4)
.salaryGood
  color: rgb(4, 180, 4)
.salaryBad
  color: rgb(190, 9, 9)
</style>