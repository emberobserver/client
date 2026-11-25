import Component from '@glimmer/component';
import SvgIcon from "./svg-icon.gjs";
import { concat } from "@ember/helper";

export default class DependencyIcon extends Component {<template><SvgIcon @iconName="stars" @class={{concat "dependency " @class}} @title="Dependency of newly generated Ember-CLI applications" />
</template>

}
