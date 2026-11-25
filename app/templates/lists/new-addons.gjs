import AddonList from "../../components/addon-list.gjs";
<template><div class="addons-index">
  <h1>New Addons</h1>

  <AddonList @addons={{@controller.model}} />
</div>
</template>