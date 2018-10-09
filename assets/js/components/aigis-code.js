Vue.component('aigis-code', {
  props: [],
  template: '<div class="aigis-code-content" v-bind:class="{ active: isActive }">' +
  '<div class="aigis-module__actions">' +
  '<button v-bind:class="{ active: isActive }" class="aigis-button" v-on:click="toggleHTML">' +
  '<span v-if="isActive">Hide</span><span v-else>Show</span> source</button>'+
  '</div>' +
  '<slot></slot>' +
  '</div>',
  
  data: function() {
    return {
      isActive: false
    }
  },
  methods: {
    toggleHTML: function() {
      return this.isActive = !this.isActive
    }
  }
});
