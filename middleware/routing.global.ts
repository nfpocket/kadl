export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();

  if (to.name === "auth-login" && user.value) {
    return navigateTo("/");
  }
});
