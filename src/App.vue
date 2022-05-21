<template>
  <div id="app-main">
    <Spinner v-if="isLoading"></Spinner>
    <home v-else></home>
  </div>
</template>

<script>
import Spinner from './components/Spinner'
import Home from './pages/index' 
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    Spinner,
    Home
  },
  computed:{
    ...mapGetters([
      'isLoading'
    ])
  },
  methods: {
      ...mapActions([
          'loadData'
      ]),
       async getData() {
          await this.loadData();
      }
  },
  async created() {
     await this.getData()
   }
}
</script>

<style>
    @import url('../node_modules/@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css');
    html {
      background: #FAFAF9;
    }
</style>

