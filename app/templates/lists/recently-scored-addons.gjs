import AddonList from "../../components/addon-list.gjs";
<template><div class="addons-index">
  <h1>Recently Scored Addons</h1>

  <AddonList @addons={{@controller.model}} />
</div>
</template>