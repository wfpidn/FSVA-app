
import EventEmitter from 'events';
import _ from 'lodash';

export const storyId = _.last(window.location.pathname.split('/'));

export let state = {
  tree: null,
  nodeById: null,
  activeIds: [],

  // computed
  section: null
};

export let bus = new EventEmitter();

bus.on('section.clicked', section => {
  if(state.section === section) {
    return;
  }

  let ids = [];
  let id = section.id;

  while (true) {
    let node = state.nodeById[id];
    if (!node) {
      break;
    }
    ids.push(node.section.id);
    id = node.section.parent;
  }

  state.section = section;
  state.activeIds = ids;
});

window.addEventListener('message', msg => {
  if (msg.data.header) {
    bus.emit(msg.data.header, msg.data.body);
  }
});

bus.on('section.jump', opts => {
  if (opts.storyId !== opts.storyId) {
    // FIXME: handle story jump
  }
  let id = opts.sectionId;
  let section = state.nodeById[id].section;
  bus.emit('section.clicked', section);
});

export default state;
