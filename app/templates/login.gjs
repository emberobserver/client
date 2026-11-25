import PageLayout from "../components/page-layout.gjs";
import LoginForm from "../components/login-form.gjs";
<template><PageLayout @showCategories={{true}}>
  <div class="container login with-default-styling">
    <LoginForm @loginAction={{@controller.login}} />
  </div>
</PageLayout>
</template>