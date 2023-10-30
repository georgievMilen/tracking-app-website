<template>
  <div class="row justify-center">
    <div class="categories flex sm12">
      <va-card>
        <va-card-title>{{ t('tables.stripedHoverable') }}</va-card-title>
        <div class="flex">
          <va-button class="ml-3 mb-2 justify-space-around" @click="openCreateCategoryForm()">Create</va-button>
        </div>
        <div class="flex xs12 lg6">
          <va-button-toggle v-model="transactionType" :options="categoryTypes" @click="onTransactionTypeToggle" />
        </div>
        <va-card-content>
          <div class="table-wrapper">
            <table class="va-table va-table--striped va-table--hoverable">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Account</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="transaction in transactions || []" :key="transaction.uuid">
                  <td>{{ transaction.category.name }}</td>
                  <td>{{ transaction.executed_on }}</td>
                  <td>{{ transaction.amount }}</td>
                  <td>{{ transaction.account.name }}</td>
                  <td>
                    <va-button class="mr-2 mb-2" size="small" @click="openEditForm(transaction)">Edit</va-button>
                  </td>
                  <td>
                    <va-button
                      class="mr-2 mb-2"
                      size="small"
                      color="danger"
                      @click="deleteTransaction(transaction.uuid)"
                      >Delete</va-button
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </va-card-content>
      </va-card>
    </div>
    <div v-if="formIsOpen" class="flex sm6">
      <va-card>
        <va-card-title>{{ formTitle }}</va-card-title>
        <va-card-content>
          <form>
            <div class="row">
              <div class="flex md6 xs12">
                <va-input v-model="amount" placeholder="Amount" type="number" label="Amount" />
              </div>
              <div class="flex md6 xs12">
                <va-select v-model="account" label="Account" :options="accountLabels" />
              </div>
              <div class="flex md6 xs12">
                <va-select v-model="type" label="Type" :options="['expense', 'income']" />
              </div>
              <div class="flex md6 xs12">
                <va-date-input v-model="date" label="Date" />
              </div>
              <div class="flex md6 xs12">
                <va-select v-model="category" label="Category" :options="availableCategories" />
              </div>
            </div>
            <div class="d-flex justify-content-center">
              <va-button class="mr-2 mb-2" @click="submit(uuid)">{{ buttonText }}</va-button>
            </div>
          </form>
        </va-card-content>
      </va-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CategoryService from '../../../services/http/CategoryService'
  import { categoryTypes } from '../../../data/categoryTypes'
  import TransactionService from '../../../services/http/TransactionService'
  import AccountService from '../../../services/http/AccountService'

  const { t } = useI18n()

  const transactionType = ref('expense')
  const buttonText = ref('')
  const formTitle = ref('')
  const account = ref('')
  const uuid = ref('')
  const amount = ref<number>()
  const type = ref('')
  const date = ref(new Date())
  const category = ref('')
  const color = ref({
    color: null,
    name: '',
    description: '',
  })

  type Categories = {
    expense: any[]
    income: any[]
  }
  let formIsOpen = ref(false)
  let categories = ref<Categories>({ expense: [], income: [] })
  let accountLabels = ref([])
  let accounts = ref([])
  let transactions = ref([])
  let allCategories = ref([])
  let availableCategories = ref<any[]>([])

  watch(type, (newType) => {
    if (newType === 'expense') {
      availableCategories.value = reactive(categories.value.expense)
      category.value = ''
    } else {
      availableCategories.value = reactive(categories.value.income)
      category.value = ''
    }
  })

  onMounted(async () => {
    await getCategories()
    await getTransactions(transactionType.value)
    await getAccounts()
  })

  async function onTransactionTypeToggle() {
    await getTransactions(transactionType.value)
  }

  async function getTransactions(type: string) {
    const response = await TransactionService.list({ type })
    console.log(response)
    transactions.value = reactive(response)
  }

  async function getAccounts() {
    const response = await AccountService.list()
    accounts.value = response
    accountLabels.value = reactive(
      response.map((account: { name: any }) => {
        return account.name
      }),
    )
  }
  function filterCategories(categories: Array<any>, type: string) {
    return categories
      .filter((category: { type: string }) => {
        return category.type === type
      })
      .map((category: { name: any }) => {
        return category.name
      })
  }
  async function getCategories() {
    const response = await CategoryService.list()
    allCategories.value = response
    const expenseType = filterCategories(response, 'expense')
    const incomeType = filterCategories(response, 'income')
    categories.value = reactive({
      expense: expenseType,
      income: incomeType,
    })
  }

  function openEditForm(transaction: any) {
    buttonText.value = 'Update'
    formTitle.value = 'Edit Category'
    formIsOpen.value = true
    uuid.value = transaction.uuid

    category.value = transaction.category.name
    account.value = transaction.account.name
    amount.value = transaction.amount
    type.value = transaction.type
    color.value.color = transaction.color
  }

  function openCreateCategoryForm() {
    buttonText.value = 'Create'
    formTitle.value = 'Create Transaction'
    formIsOpen.value = true

    type.value = ''
    color.value.color = null
  }

  async function submit(uuid: string) {
    const foundCategory = allCategories.value.find((cat) => {
      return cat.name === category.value
    })

    const foundAccount = accounts.value.find((acc) => {
      return acc.name === account.value
    })

    const data = {
      account_uuid: foundAccount!.uuid,
      category_uuid: foundCategory!.uuid,
      amount: amount.value,
      type: type.value,
      color: color.value.color,
      currency_code: 'BGN',
    }

    if (uuid) {
      await TransactionService.update(uuid, data)
    } else {
      await TransactionService.create(data)
    }

    await getTransactions(transactionType.value)

    formIsOpen.value = false
  }

  async function deleteTransaction(uuid: string) {
    await TransactionService.delete(uuid)

    await getTransactions(transactionType.value)
  }
</script>

<style lang="scss">
  .markup-tables {
    .table-wrapper {
      overflow: auto;
    }

    .va-table {
      width: 100%;
    }
  }
</style>
