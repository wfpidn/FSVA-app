
import $ from 'jquery';
import Vue from 'vue';
import 'purecss/build/base-min.css';
import 'purecss/build/grids-min.css';
import 'purecss/build/forms-min.css';

const path = '/stories/jatim/story.json';

let el = document.createElement('div');
document.body.appendChild(el);

new Vue({
  el,
  template: '#template-app',
  data: {
    langs: [],
    lang: null,
    stories: [],
    storyId: null,
    story: null
  },
  methods: {
    save() {
      let story = JSON.parse(JSON.stringify(this.story));

      story.sections.forEach(e => {
        ['id', 'parent'].forEach(attr => {
          if (typeof e[attr] === 'string') {
            e[attr] = e[attr].length ? parseInt(e[attr]) : null;
          }
        });
      });

      $.ajax({
        type: 'post',
        url: '/editor/save',
        data: {
          story: JSON.stringify(story),
          path: this.path
        }
      }).then(() => {
        alert('Saved!');
      }).fail(xhr => {
        alert(xhr.responseText);
      });
    }
  },
  watch: {
    path(v) {
      $.getJSON(v).then(story => {
        this.story = story;
      });
    }
  },
  computed: {
    path() {
      return `/stories/${this.storyId}/story.${this.lang}.json`;
    }
  },
  init() {
    $.getJSON('/language').then(data => {
      this.langs = data.languages;
    });
    $.getJSON('/stories/stories.json').then(data => {
      this.stories = data.stories.map(e => e.id);
    });
  }
});
