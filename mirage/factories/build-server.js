 import Mirage from 'ember-cli-mirage';

 export default Mirage.Factory.extend({
   name: (i) => `build-host-${i}`,
   token: 'abc123'
 });
