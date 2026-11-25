import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import momentFrom from "ember-moment/helpers/moment-from";

export default class RelativeTime extends Component {<template><time datetime={{this.isoDate}} title={{this.isoDate}}>
  {{momentFrom @date this.currentDate.date allowEmpty=true}}
</time>
</template>
  @service currentDate;

  get isoDate() {
    let date = this.args.date;
    return date ? date.toISOString() : null;
  }
}
