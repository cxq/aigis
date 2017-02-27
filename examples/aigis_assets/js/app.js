var app = new Vue({
  el: '#app',
  delimiters: ['${', '}'],
  
  data: {
    isNavigationClosed: false
  },
  
  methods: {
    toggleNavigation: function () {
      return this.isNavigationClosed = !this.isNavigationClosed;
    }
  }
});
