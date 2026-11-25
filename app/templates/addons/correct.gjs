import OfficialIcon from "../../components/official-icon.gjs";
import DependencyIcon from "../../components/dependency-icon.gjs";
import { on } from "@ember/modifier";
import preventDefault from "../../helpers/prevent-default.js";
import { Input, Textarea } from "@ember/component";
<template><div class="addons-correct with-default-styling">
  <h1>
    {{#if @controller.model.isOfficial}}
      <OfficialIcon />
    {{/if}}

    {{#if @controller.model.isCliDependency}}
      <DependencyIcon />
    {{/if}}

    {{@controller.model.name}}

  </h1>

  <p class="description">{{@controller.model.description}}</p>

  <h2>Suggest a correction</h2>
  <p>Ember Observer is an index of Ember addons. We do not maintain {{@controller.model.name}}.</p>
  <form {{on "submit" (preventDefault @controller.submitCorrection)}}>
    <Input @type="text" @value={{@controller.name}} placeholder="Your name" />
    <Input @type="text" @value={{@controller.email}} placeholder="Your email address" />
    <Textarea @value={{@controller.correction}} placeholder="Describe what needs correcting" />    <p>
      <strong>Note:</strong>
      Most of the data (other than the reviews) presented for an addon comes from NPM.
      If you've updated the <code>package.json</code> file for an addon, you'll need to push a new release to NPM for
      the information to update.
      <br>
      A new NPM release also means the addon will be queued up for a new review.
    </p>
    <input type="submit" class="button" value="Submit">
    <button type="button" class="button cancel" {{on "click" @controller.cancel}}>Cancel</button>
  </form>
</div>
</template>