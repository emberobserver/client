// todo Fix observes and add debounce
import Ember from 'ember';

export default Ember.Component.extend({
    showMatches: false,
    matches: [],
    classNames: ['search-ahead'],
    minSearchLength: 1,

    inputMatches: function(input, checked) {
        input = input.toLowerCase();
        checked = checked.toLowerCase();

        if (checked.indexOf(input) !== -1) {
            return true;
        } else {
            return false;
        }
    },

    matchItems: function() {
        var input = this.get('query');

        if (input.length < this.get('minSearchLength')) {
            this.setProperties({'showMatches': false, 'matches': []});
            return;
        }

        if (input && input !== "") {
            var _this = this;
            var matches = this.get('items').filter(function(item) {
                return _this.inputMatches(input, item.get('name'));
            });

            if (matches.length) {
                this.setProperties({'showMatches': true, 'matches': matches});
            } else {
                this.setProperties({'showMatches': false, 'matches': []});
            }
        }
    }.observes('query'),

    item: function() {
        var nameMatch = this.get('matches').findBy('name', this.get('query'));
        if (nameMatch) {
            return nameMatch;
        } else {
            return null;
        }
    }.property('query'),

    hideMatches: function() {
        this.set('showMatches', false);
        this.get('matches').setEach('active', false);
    },

    actions: {
        lostFocus: function() {
            this.hideMatches();
        },

        arrowUp: function() {
            if (!this.get('showMatches')) {
                return;
            }

            var active = this.get('matches').findBy('active');

            if (!active) {
                this.get('matches.lastObject').set('active', true);
            } else {
                var i = this.get('matches').indexOf(active);
                active.set('active', false);

                if (i > 0) {
                    this.get('matches').objectAt(i-1).set('active', true);
                }
            }
        },

        arrowDown: function() {
            if (!this.get('showMatches')) {
                return;
            }

            var active = this.get('matches').findBy('active');

            if (!active) {
                this.get('matches.firstObject').set('active', true);
            } else {
                var i = this.get('matches').indexOf(active);
                active.set('active', false);

                if (i < (this.get('matches.length') - 1)) {
                    this.get('matches').objectAt(i+1).set('active', true);
                }
            }
        },

        enter: function() {
            if (this.get('item')) {
                this.sendAction('action', this.get('item'));
            }

            if (!this.get('showMatches')) {
                return;
            }

            var active = this.get('matches').findBy('active');

            if (active) {
                this.set('query', active.get('name'));
                this.sendAction('action', active);
            }

            this.hideMatches();
        }
    }
});
