Vue.use(vMediaQuery.default);

var app = new Vue({
  el: '#app',
  delimiters: ['${', '}'],
  
  data: {
    isNavigationClosed: false
  },
  
  created: function () {
    window.addEventListener('resize', _.debounce(this.screenResize,100));
    
    this.screenResize();
  },
  
  methods: {
    toggleNavigation: function () {
      return this.isNavigationClosed = !this.isNavigationClosed;
    },
    screenResize: function () {
      this.isNavigationClosed = this.$mq.below(960);
    }
  }
});
