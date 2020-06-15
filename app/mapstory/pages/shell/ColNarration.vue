<template>
  <div class="col col-narration {{open?'':'hide'}}">
    <div class="button-container">
      <img class="icon-lock {{lock?'active':''}}"
           @click="lock = !lock"
           title="Lock Column"
           src="/pages/shell/img/lock.svg"/>
      <button class="pure-button button-close"
              @click="close">{{'static.close' | lang}}</button>
    </div>
    <div class="narration" v-if="section">
      <h2>{{{section.title}}}</h2>
      {{{section.content}}}
    </div>
  </div>
</template>

<script>
 import {bus, state} from './state';

 export default {
   data() {
     return {
       open: false,
       lock: false,

       state
     };
   },
   computed: {
     section() {
       return this.state.section;
     }
   },
   ready() {
     bus.on('section.clicked', () => {
       this.open = true;
     });
     bus.on('content.clicked', () => {
       this.close();
     });
   },
   methods: {
     close() {
       if(!this.lock) {
         this.open = false;
       }
     }
   }
 }
</script>
