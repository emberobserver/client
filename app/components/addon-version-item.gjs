import Component from '@glimmer/component';
import momentFormat from "ember-moment/helpers/moment-format";

export default class AddonVersionItem extends Component {<template>{{momentFormat @version.released "YYYY-MMM-DD" allowEmpty=true}} <span class="version-number">{{@version.version}}</span>
</template>

}
