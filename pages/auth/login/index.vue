<template>
  <div class="flex flex-col gap-4">
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="handleSignIn">
      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <div class="flex items-center gap-4">
        <UButton type="submit" :loading="loading"> Login </UButton>
        or
        <UButton type="submit" :loading="loading" @click="handleSignUp"> Create Account instead </UButton>
      </div>
    </UForm>

    <UAlert v-if="errorMesssage" class="text-red-500" title="Error" :description="errorMesssage" />
    <UAlert v-if="successMessage" class="text-green-500" title="Success" :description="successMessage" />
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

useHead({
  title: "Login",
});

const supabase = useSupabaseClient();

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const successMessage = ref("");
const errorMesssage = ref("");

const loading = ref(false);

const state = ref<Schema>({
  email: "",
  password: "",
});

const handleSignIn = async () => {
  successMessage.value = "";
  errorMesssage.value = "";

  loading.value = true;
  const { error } = await supabase.auth.signInWithPassword({
    email: state.value.email,
    password: state.value.password,
  });
  loading.value = false;

  if (error) {
    // @ts-expect-error missing type
    errorMesssage.value = error.error_description || error.message;
    return;
  }

  successMessage.value = "Logged in successfully!";
};

const handleSignUp = async () => {
  successMessage.value = "";
  errorMesssage.value = "";

  loading.value = true;
  const { error } = await supabase.auth.signUp({
    email: state.value.email,
    password: state.value.password,
  });
  loading.value = false;

  if (error) {
    // @ts-expect-error missing type
    errorMesssage.value = error.error_description || error.message;
    return;
  }

  successMessage.value = "Check your email for the login link!";
};
</script>
