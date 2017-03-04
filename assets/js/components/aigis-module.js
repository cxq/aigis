Vue.component('aigis-module', {
  props: ['name','sourcePath','previewHTML'],
  template: '<div class="aigis-module" v-bind:class="{ active: isActive }">' +
  '<h2 class="aigis-module__heading" v-bind:id="name">{{name}}</h2>'+
  '<div class="aigis-module__filepath">{{sourcePath}}</div>' +
  '<div class="aigis-module__content">' +
  '<div class="aigis-module__actions">' +
  '<button v-bind:class="{ active: isActive }" class="aigis-button" v-on:click="toggleHTML">' +
  '<span v-if="isActive">Hide</span><span v-else>Show</span> source' +
  '</button>' +
  '</div>' +
  '<slot></slot>' +
  '</div>' +
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
