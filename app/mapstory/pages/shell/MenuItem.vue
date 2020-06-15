<template>
  <ul class="level-{{node.level}}">
    <li v-if="node.level > 0"
        :class="{ item: 1, open: open, selected: selected }"
        :title="node.section.title"
        @click="click">
      <span v-if="node.level === 2"> &#8226; </span>
      {{{node.section.title}}}
      <div v-if="node.level === 1 && node.children.length > 0"
           class="chevron"></div>
    </li>
    <li v-if="open" transition="expand">
      <menu-item v-for="e in node.children" :node="e"></menu-item>
    </li>
  </ul>
</template>

<style>
 .expand-transition {
     transition: all 0.5s ease;
 }
</style>

<script>
 import Vue from 'vue';
 import _ from 'lodash';

 import {bus, state} from './state';

 Vue.transition('expand', {
   enter(el) {
     let origHeight = el.scrollHeight;
     el.style.height = 0;
     setTimeout(() => {
       el.style.height = origHeight + 'px';
     });
   },
   leave(el) {
     el.style.height = 0;
   }
 });

 export default {

   name: 'MenuItem',

   props: {
     node: {
       type: Object,
       required: true
     }
   },
   data() {
     return {
       toggle: false,
       state
     };
   },
   computed: {
     open() {
       return this.node.level === 0 ||
              this.state.activeIds.indexOf(this.node.section.id) >= 0;
     },
     selected() {
       return this.state.section === this.node.section;
     }
   },
   methods: {
     click() {
       bus.emit('section.clicked', this.node.section);
     }
   }
 };

</script>
