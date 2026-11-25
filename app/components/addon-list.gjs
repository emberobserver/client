import AddonDetails from "./addon-details.gjs";
<template><ul class="addon-list">
  {{#each @addons as |addon|}}
    <li class="test-addon-row">
      <AddonDetails @addon={{addon}} @showRanking={{@showRanking}} />
    </li>
  {{/each}}
  {{yield}}
</ul>
</template>