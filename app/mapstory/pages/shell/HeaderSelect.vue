<template>
  <div class="select-container">
    <span style="color: #FFF">{{'static.language' | lang}}</span>
    <select v-model="language">
      <option
          v-for="lang in languages"
          v-html="lang"
          :value="lang">
      </option>
    </select>
    <span style="padding-right: 30px"></span>
    <span style="color: #FFF">{{'static.area' | lang}}</span>
    <select v-model="storyId">
      <option
          v-for="e in stories"
          v-html="e.label"
          :value="e.id">
      </option>
    </select>
  </div>
  <img :src="'/stories/' + storyId + '/area-logo.png'"/>
  <img src="/pages/shell/img/wfp-logo.gif"/>
</template>

<script>
 import $ from 'jquery';
 import {storyId} from './state';

 export default {
   data() {
     return {
       language: null,
       languages: [],
       storyId,
       stories: []
     }
   },
   ready() {
     $.getJSON('/language').then(config => {
       this.language = config.current;
       this.languages = config.languages
     });
     $.getJSON('/stories/stories.json').then(data => {
       this.stories = data.stories;
       });
   },
   watch: {
     language(newv, oldv) {
       if (!oldv) {return;}
       let lang = this.language;
       window.location.href = resolveLangUrl(lang);
     },
     storyId(newv, oldv) {
       if (!oldv) {return;}
       let id = this.storyId;
       window.location.href = resolveStoryUrl(id);
     }
   }
 }

 function resolveStoryUrl(id) {
   return '//' + window.location.host + '/s/' + id + window.location.hash;
 }

 function resolveLangUrl(lang) {
   return '//' + resolveHost(lang) + window.location.pathname + window.location.hash;
 }

 function resolveHost(lang) {
   let split = window.location.host.split('.');
   split[0] = lang;
   return split.join('.');
 }
</script>
