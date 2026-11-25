import PageLayout from "../../components/page-layout.gjs";
import { on } from "@ember/modifier";
import { Input } from "@ember/component";
<template><PageLayout @showCategories={{false}}>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Token</th>
      </tr>
    </thead>
    <tbody>
      {{#each @model as |buildServer|}}
        <tr data-test-build-server>
          <td>{{buildServer.name}}</td>
          <td>{{buildServer.token}}</td>
        </tr>
      {{/each}}
    </tbody>
  </table>

  <form {{on "submit" @controller.save}}>
    <fieldset>
      <label for="name">
        Name:
      </label>
      <Input @value={{@controller.newBuildServerName}} @type="text" id="name" data-test-new-build-server-name />
      <input type="submit" value="Add" data-test-add-new-build-server>
    </fieldset>
  </form>
</PageLayout>
</template>