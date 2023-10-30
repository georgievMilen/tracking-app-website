<template>
  <div class="row justify-center">
    <div class="categories flex sm6">
      <va-card>
        <va-card-title>{{ t('tables.stripedHoverable') }}</va-card-title>
        <div class="flex">
          <va-button class="ml-3 mb-2 justify-space-around" @click="openCreateCategoryForm()">Create</va-button>
        </div>
        <va-card-content>
          <div class="table-wrapper">
            <table class="va-table va-table--striped va-table--hoverable">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Balance</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="account in accounts" :key="account.uuid">
                  <td>{{ account.name }}</td>
                  <td>{{ account.balance }}</td>
                  <td>
                    <va-button class="mr-2 mb-2" size="small" @click="openEditForm(account)">Edit</va-button>
                  </td>
                  <td>
                    <va-button class="mr-2 mb-2" size="small" color="danger" @click="deleteAccount(account.uuid)"
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
                <va-input v-model="name" placeholder="Name" label="Names" />
              </div>
              <div class="flex md6 xs12">
                <va-input v-model="balance" placeholder="Name" label="Balance" type="number" />
              </div>
              <div class="flex md6 xs12">
                <va-select
                  v-model="color"
                  label="color"
                  text-by="name"
                  track-by="color"
                  :options="[...themeColors, ...extraColors]"
                />
              </div>
              <div v-if="color.color" class="flex md6 xs12">
                <color-presentation :color="color.color" />
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
  import { onMounted, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import CategoryService from '../../../services/http/CategoryService'
  import { themeColors, extraColors } from '../ui/colors/color-presentation/colorsData'
  import ColorPresentation from '../ui/colors/color-presentation/ColorPresentation.vue'
  import AccountService from '../../../services/http/AccountService'

  const { t } = useI18n()

  const buttonText = ref('')
  const formTitle = ref('')
  const uuid = ref('')
  const name = ref('')
  const balance = ref<number>()
  const color = ref({
    color: null,
    name: '',
    description: '',
  })

  let formIsOpen = ref(false)
  let accounts = ref([])

  onMounted(async () => {
    await getAccounts()
  })

  async function getAccounts() {
    const response = await AccountService.list()
    accounts.value = reactive(response)
  }

  function openEditForm(account: any) {
    buttonText.value = 'Update'
    formTitle.value = 'Edit Account'
    formIsOpen.value = true
    uuid.value = account.uuid
    name.value = account.name
    balance.value = account.balance
    color.value.color = account.color
  }

  function openCreateCategoryForm() {
    buttonText.value = 'Create'
    formTitle.value = 'Create Account'
    formIsOpen.value = true

    name.value = ''
    balance.value = 0
  }

  async function submit(uuid: string) {
    const data = {
      name: name.value,
      color: color.value.color,
      balance: balance.value,
      in_total_balance: true,
      currency_code: 'BGN',
    }

    if (uuid) {
      await AccountService.update(uuid, data)
    } else {
      await AccountService.create(data)
    }

    await getAccounts()

    formIsOpen.value = false
  }

  async function deleteAccount(uuid: string) {
    await AccountService.delete(uuid)

    await getAccounts()
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
