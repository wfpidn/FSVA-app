<template>
  <div class="col col-menu">
    <menu-item v-if="state.tree" :node="state.tree"></menu-item>

    <div class="help-container">
      <div style="margin-bottom: 30px">
        <img src="/public/img/au-aid.png" style="width:50%" />
      </div>
      <div @click="help" style="cursor: pointer">
        {{'link.help' | lang}}
        <img src="/pages/shell/img/help.svg" style="height: 10px"/>
      </div>
    </div>
  </div>
</template>

<script>
 import _ from 'lodash';
 import $ from 'jquery';

 import {storyId, bus, state}  from './state';
 import MenuItem from './MenuItem.vue';
 import {open} from './popup';

 let dHelp = $.get('/pages/shell/help.html');
 let template = '<div>{{{html}}}</div>';

 export default {
   components: {
     MenuItem
   },

   data() {
     return {
       state
     };
   },

   ready() {
     $.getJSON(`/stories/${storyId}/story.json`).then(story => {
       let {nodeById, tree} = resolveTree(story);
       state.nodeById = nodeById;
       state.tree = tree;

       let section = defaultSection(story);

       // modify title
       document.title = story.title;

       bus.emit('section.clicked', section);
     });
   },

   methods: {
     help() {
       dHelp.then(html => {
         open({
           width: '450px',
           template,
           data: { html }
         });
       });
     }
   }
 }

 function resolveTree(story) {
   let nodeById = {};

   // add root node
   let root = {
     level: 0,
     section: null,
     children: []
   };

   story.sections.map(s => {
     let id = s.id;
     let parent = s.parent === null ? root : nodeById[s.parent];
     let node = {
       level: parent.level + 1,
       section: s,
       children: []
     };
     parent.children.push(node);
     nodeById[id] = node;
   });

   return {
     nodeById,
     tree: root
   };
 }

 function defaultSection(story) {
   let hashId = parseInt(window.location.hash.substring(1));
   if (isFinite(hashId)) {
     return _.find(story.sections, {id: hashId});
   }
   if ('defaultSectionId' in story) {
     return _.find(story.sections, {id: story.defaultSectionId});
   }
   return story.sections[0];
 }

</script>
