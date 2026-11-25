import { scheduleOnce } from '@ember/runloop';
import { get, action } from '@ember/object';
import Component from '@glimmer/component';
import { isArray, A } from '@ember/array';
import { modifier } from 'ember-modifier';

/**
 * Used to wrap a native `<option>` tag and associate an object with
 * it that can be bound. It can only be used in conjuction with a
 * containing `x-select` component
 *
 * @class Ember.XOptionComponent
 * @extends Ember.Component
 */
export default class XOption extends Component {
  element = null;

  lifecycle = modifier((element) => {
    this.element = element;
    this.didInsertElement();

    return () => {
      this.willDestroyElement();
      this.element = null;
    };
  });

  get disabled() {
    return this.args.disabled;
  }

  get "on-disable"() {
    return this.args["on-disable"];
  }

  get register() {
    return this.args.register;
  }

  get unregister() {
    return this.args.unregister;
  }

  get name() {
    return this.args.name;
  }

  get title() {
    return this.args.title;
  }

  get select() {
    return this.args.select;
  }

  _oldDisabled;

  /**
   * The value associated with this option. When this option is
   * selected, the `x-select` will fire its action with this
   * value.
   *
   * @property value
   * @type Object
   * @default null
   */
  get value() {
    return this.args.value;
  }

  /**
   * Property bound to the `selected` attribute of the native
   * `<option>` element. It is aware of the containing `x-select`'s
   * value and will mark itself if it is the same.
   *
   * @private
   * @property selected
   * @type Boolean
   */
  get selected() {
    if (get(this.args, 'select.multiple') && isArray(get(this.args, 'select.value'))) {
      let selectValue = A(get(this.args, 'select.value'));

      return selectValue.includes(this.value);
    } else {
      return this.value === get(this.args, 'select.value');
    }
  }

  @action
  didReceiveAttrs() {
    let oldDisabled = this._oldDisabled;

    if(oldDisabled !== undefined && !oldDisabled) {
      // Undefined means the first time

      if(this.disabled !== oldDisabled) {
        this["on-disable"]?.(this.value, this.disabled);
      }
    }

    this._oldDisabled = this.disabled;
  }

  /**
   * Register this x-option with the containing `x-select`
   *
   * @override
   */
  didInsertElement() {
    scheduleOnce('afterRender', () => {
      this.register(this);
    });
  }

  /**
   * Unregister this x-option with its containing x-select.
   *
   * @override
   */
  willDestroyElement() {
    this.unregister(this);
  }
}
