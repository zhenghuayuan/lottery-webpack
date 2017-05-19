<template>
  <div v-tabbar="{'menus': menus, menuColor: '#BFBFBF', activeMenuColor: '#E31E3A', onMenuClick: menuClicked}">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        menus: [
          {
            iconOn: 'ion-ios-home',
            iconOff: 'ion-ios-home-outline',
            text: '首页',
            path: '/index'
          },
          {
            iconOn: 'ion-ios-paper',
            iconOff: 'ion-ios-paper-outline',
            text: '文章',
            path: '/index'
          },
          {
            iconOn: 'ion-ios-person',
            iconOff: 'ion-ios-person-outline',
            text: '我的',
            path: '/index'
          }
        ]
      }
    },

    methods: {
      menuClicked(menuIndex) {
        console.log(menuIndex)
      }
    },

    beforeDestroy() {
      $tabbar.$emit('hideTabbar')
    }
  }
</script>
