
import Vue from 'vue';
import {bus, state} from './state';

new Vue({

  data: {
    state
  },

  watch: {
    'state.section': (section) => {
      let id = section.id;
      let current = parseInt(window.location.hash.substring(1));
      if (id !== current) {
        window.history.pushState(null, null, '#'+id);
      }
    }
  }
});

window.addEventListener('popstate', (event) => {
  let id = parseInt(window.location.hash.substring(1));
  if (isFinite(id)) {
    let section = state.nodeById[id].section;
    bus.emit('section.clicked', section);
  }
});
