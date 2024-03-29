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
                  <th>Type</th>
                  <th>Color</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="category in categories" :key="category.uuid">
                  <td>{{ category.name }}</td>
                  <td>{{ category.type }}</td>
                  <td>{{ category.color }}</td>
                  <td>
                    <va-button class="mr-2 mb-2" size="small" @click="openEditForm(category)">Edit</va-button>
                  </td>
                  <td>
                    <va-button class="mr-2 mb-2" size="small" color="danger" @click="deleteCategory(category.uuid)"
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
                <va-input v-model="name" placeholder="Name" />
              </div>
              <div v-if="buttonText === 'Update'" class="flex md6 xs12">
                <va-input v-model="type" placeholder="Type" disabled />
              </div>
              <div v-else class="flex md6 xs12">
                <va-select v-model="type" label="Type" :options="['expense', 'income']" />
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

  const { t } = useI18n()

  const buttonText = ref('')
  const formTitle = ref('')
  const uuid = ref('')
  const name = ref('')
  const type = ref('')
  const color = ref({
    color: null,
    name: '',
    description: '',
  })

  let formIsOpen = ref(false)
  let categories = ref([])

  onMounted(async () => {
    await getCategories()
  })

  async function getCategories() {
    const response = await CategoryService.list()
    categories.value = reactive(response)
  }

  function openEditForm(category: any) {
    buttonText.value = 'Update'
    formTitle.value = 'Edit Category'
    formIsOpen.value = true
    uuid.value = category.uuid
    name.value = category.name
    type.value = category.type
    color.value.color = category.color
  }

  function openCreateCategoryForm() {
    buttonText.value = 'Create'
    formTitle.value = 'Create Category'
    formIsOpen.value = true

    name.value = ''
    type.value = ''
    color.value.color = null
  }

  async function submit(uuid: string) {
    const data = {
      name: name.value,
      type: type.value,
      color: color.value.color,
    }

    if (uuid) {
      await CategoryService.update(uuid, data)
    } else {
      await CategoryService.create(data)
    }

    await getCategories()

    formIsOpen.value = false
  }

  async function deleteCategory(uuid: string) {
    await CategoryService.delete(uuid)

    await getCategories()
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
