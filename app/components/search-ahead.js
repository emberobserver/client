import Ember from 'ember';

export default Ember.Component.extend({
    showMatches: false,
    matches: [],
    itemId: null,
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
        var matches = [];

        if (input.length < this.get('minSearchLength')) {
          return matches;
        }

        if (input && input !== "") {
            var _this = this;
            matches = this.get('items').filter(function(item) {
                return _this.inputMatches(input, item.get('name'));
            });
        }

        if (matches.length) {
            this.setProperties({
                'showMatches': true,
                'matches': matches,
            });
        } else {
            this.setProperties({
                'showMatches': false,
                'matches': [],
            });
        }
    }.observes('query'),

    setItemId: function() {
        var nameMatch = this.get('matches').findBy('name', this.get('query'));
        if (nameMatch) {
            this.set('itemId', nameMatch.get('id'));
            console.log(nameMatch);
        } else {
            this.set('itemId', null);
        }
    }.observes('query'),

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
            if (!this.get('showMatches')) {
                return;
            }

            var active = this.get('matches').findBy('active');

            if (active) {
                this.set('query', active.get('name'));
            }

            this.hideMatches();
        }
    }
});
