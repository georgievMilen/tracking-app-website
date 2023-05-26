<template>
  <div class="categories flex">
    <va-card>
      <va-card-title>{{ t('tables.stripedHoverable') }}</va-card-title>
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
                  <va-badge text="paid" :color="getStatusColor('paid')" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </va-card-content>
    </va-card>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import data from '../../../data/tables/markup-table/data.json'
  import CategoryService from '../../../services/http/CategoryService'

  const { t } = useI18n()

  const users = ref(data.slice(0, 8))
  let categories = reactive([])

  onMounted(async () => {
    categories = await CategoryService.list()
    console.log(categories)
  })
  function getStatusColor(status: string) {
    if (status === 'paid') {
      return 'success'
    }

    if (status === 'processing') {
      return 'info'
    }

    return 'danger'
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
