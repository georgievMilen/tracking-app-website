<template>
  <form @submit.prevent="onsubmit()">
    <va-input
      v-model="name"
      name="name"
      class="mb-3"
      type="text"
      label="name"
      :error="!!nameErrors.length"
      :error-messages="nameErrors"
    />

    <va-input
      v-model="email"
      name="email"
      class="mb-3"
      type="email"
      :label="t('auth.email')"
      :error="!!emailErrors.length"
      :error-messages="emailErrors"
    />

    <va-input
      v-model="password"
      name="password"
      class="mb-3"
      type="password"
      :label="t('auth.password')"
      :error="!!passwordErrors.length"
      :error-messages="passwordErrors"
    />

    <div class="auth-layout__options d-flex align-center justify-space-between">
      <va-checkbox
        v-model="agreedToTerms"
        class="mb-0"
        :error="!!agreedToTermsErrors.length"
        :error-messages="agreedToTermsErrors"
      >
        <template #label>
          <span class="ml-2">
            {{ t('auth.agree') }}
            <span class="va-link">{{ t('auth.termsOfUse') }}</span>
          </span>
        </template>
      </va-checkbox>
      <router-link class="ml-1 va-link" :to="{ name: 'recover-password' }">
        {{ t('auth.recover_password') }}
      </router-link>
    </div>

    <div class="d-flex justify-center mt-3">
      <va-button class="my-0" @click="onsubmit">{{ t('auth.sign_up') }}</va-button>
    </div>
  </form>
  <va-modal v-model="showModal" size="small" title="Error" :message="modalMessage" ok-text="OK" cancel-text="" />
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import AuthService from '../../../services/http/AuthService'
  const { t } = useI18n()

  const name = ref('')
  const email = ref('')
  const password = ref('')
  const agreedToTerms = ref(false)
  const nameErrors = ref<string[]>([])
  const emailErrors = ref<string[]>([])
  const passwordErrors = ref<string[]>([])
  const agreedToTermsErrors = ref<string[]>([])
  const showModal = ref(false)
  const modalMessage = ref('')

  const formReady = computed(() => {
    return !(emailErrors.value.length || passwordErrors.value.length || agreedToTermsErrors.value.length)
  })

  async function onsubmit() {
    if (!formReady.value) return

    nameErrors.value = name.value ? [] : ['Name is required']
    emailErrors.value = email.value ? [] : ['Email is required']
    passwordErrors.value = password.value ? [] : ['Password is required']
    agreedToTermsErrors.value = agreedToTerms.value ? [] : ['You must agree to the terms of use to continue']
    try {
      const response = await AuthService.register({
        name: name.value,
        email: email.value,
        password: password.value,
      })

      if (response.status === 200) {
        useRouter().push({ name: 'dashboard' })
      }

      modalMessage.value = response.data.message
      showModal.value = true
    } catch (e) {
      console.log({ e })
    }
  }
</script>
