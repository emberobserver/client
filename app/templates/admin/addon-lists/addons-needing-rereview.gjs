import AddonList from "../../../components/addon-list.gjs";
<template><h1>Addons with new updates since their last review</h1>
<AddonList @addons={{@controller.model}} />
</template>