import AddonList from "../../../components/addon-list.gjs";
<template><h1>Addons needing review</h1>
<AddonList @addons={{@controller.model}} />
</template>