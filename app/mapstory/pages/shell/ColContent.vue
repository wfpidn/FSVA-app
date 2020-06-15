<template>
  <div class="col col-content"></div>
</template>

<script>
 import $ from 'jquery';
 import {bus, state} from './state';

 let frame = null;

 export default {
   data() {
     return {
       state,
     };
   },
   watch: {
     'state.section': function(section) {
       setFrame(this.$el, section);
     }
   }
 };

 function isExternal(section) {
   return section.url.startsWith('http://');
 }

 function frameUrl(section) {
   // don't pass params for external url
   if (isExternal(section)) {
     return section.url;
   }
   return section.url + '?q=' + encodeURIComponent(JSON.stringify(section.params || {}));
 }

 function setFrame(el, section) {
   if (frame !== null) {
     frame.remove();
   }

   let url = frameUrl(section);
   frame = $('<iframe>', {
       src: url,
       class: 'full-wh',
       frameborder: 0
     });
   $(el).append(frame);
 }
</script>
