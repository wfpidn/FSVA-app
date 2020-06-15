<template>
  <div class="full-wh">
    <div class="header">
      <div class="header-menu pure-menu pure-menu-horizontal">
        <div style="padding-top: 20px">
          <strong>{{'main.title.top' | lang}}</strong><br/>{{'main.title.bottom' | lang}}
        </div>
      </div>
      <div class="logo-container">
        <header-select></header-select>
      </div>
    </div>

    <div class="col-wrapper">
      <col-menu></col-menu>
      <col-narration></col-narration>
      <col-content></col-content>
    </div>
  </div>
</template>

<script>
 import HeaderSelect from './HeaderSelect.vue';
 import ColMenu from './ColMenu.vue';
 import ColNarration from './ColNarration.vue';
 import ColContent from './ColContent.vue';

 export default {
   components: {
     HeaderSelect,
     ColMenu,
     ColNarration,
     ColContent
   }
 }
</script>
