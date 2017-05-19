<script src="../../../../../../学习资料/eTouch/etouch1.0.js"></script>
<template>
  <div class="page has-navbar" v-nav="{ title: '彩票查询' }">
    <div class="page-content">
      <tabs :tab-items="tabs" :tab-index="activeTabIndex" :on-tab-click="onTabClick"></tabs>
      <div class="tab-line" :style="{'transform': 'translate(' + tabLineLeft + '%, 0)', 'width': 100 / tabs.length + '%'}"></div>
        <div class="list list-ios" thin-border v-show="activeTabIndex == 0">
          <div class="item item-ios item-icon-right" v-for="item in hotList" @click.prevent="jumpToDetail(item)">
            <div class="item-logo"><img :src="'../../static/logo/' + lotteryData[item.code].icon + '.png'"></div>
            <div class="item-body">
              <div class="item-body-title">
                <span class="name">{{item.name}}</span>
                <span class="No">第{{item.expect}}期</span>
                <span class="date">{{formatDate(item.opentime)}} (周{{formatCurrDay(item.opentime)}})</span>
              </div>
              <div class="item-body-ball" :class="formatClass(item.opencode.length)">
                <div class="ball" v-for="(code, index) in item.opencode"
                     :style="{ 'background-color': formatColor(index, item.opencode.length, item.code) }"
                     :class="{ 'blue-ball': item.opencode.length != 10 && index >= lotteryData[item.code].redCount }"
                >{{code}}</div>
              </div>
              <span class="countdown">开奖倒计时：{{item.countDown}}</span>
            </div>
            <i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
          </div>
        </div>
        <div class="list list-ios" thin-border v-show="activeTabIndex == 1">
          <div class="item item-ios item-icon-right" v-for="item in highList" @click.prevent="jumpToDetail(item)">
            <div class="item-logo"><img :src="'../../static/logo/' + lotteryData[item.code].icon + '.png'"></div>
            <div class="item-body">
              <div class="item-body-title">
                <span class="name">{{item.name}}</span>
                <span class="No">第{{item.expect}}期</span>
                <span class="date">{{formatDate(item.opentime)}} (周{{formatCurrDay(item.opentime)}})</span>
              </div>
              <div class="item-body-ball" :class="formatClass(item.opencode.length)">
                <div class="ball" v-for="(code, index) in item.opencode"
                     :style="{ 'background-color': formatColor(index, item.opencode.length, item.code) }"
                     :class="{ 'blue-ball': item.opencode.length != 10 && index >= lotteryData[item.code].redCount }"
                >{{code}}</div>
              </div>
              <span class="countdown">开奖倒计时：{{item.countDown}}</span>
            </div>
            <i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
          </div>
        </div>
        <div class="list list-ios" thin-border v-show="activeTabIndex == 2">
          <div class="item item-ios item-icon-right" v-for="item in lowList" @click.prevent="jumpToDetail(item)">
            <div class="item-logo"><img :src="'../../static/logo/' + lotteryData[item.code].icon + '.png'"></div>
            <div class="item-body">
              <div class="item-body-title">
                <span class="name">{{item.name}}</span>
                <span class="No">第{{item.expect}}期</span>
                <span class="date">{{formatDate(item.opentime)}} (周{{formatCurrDay(item.opentime)}})</span>
              </div>
              <div class="item-body-ball" :class="formatClass(item.opencode.length)">
                <div class="ball" v-for="(code, index) in item.opencode"
                     :style="{ 'background-color': formatColor(index, item.opencode.length, item.code) }"
                     :class="{ 'blue-ball': item.opencode.length != 10 && index >= lotteryData[item.code].redCount }"
                >{{code}}</div>
              </div>
              <span class="countdown">开奖倒计时：{{item.countDown}}</span>
            </div>
            <i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
          </div>
        </div>
    </div>
    <md-footer></md-footer>
  </div>
</template>
<script>
  import Vue from 'vue';
  import common from '../../assets/common/common';
  import footer from '../footer/footer.vue'
  import service from '../../serviceInterface/serviceInterface';
  import lotteryData from '../../assets/data.json';

  let self = null;

  export default {
    components: {
      'md-footer': footer
    },
    data () {
      return {
        tabs: [
          "热门彩",
          "高频彩",
          "低频彩"
        ],
        activeTabIndex: 0,
        tabLineLeft: 0,
        clickFlag: false,
        hotList: [],
        highList: [],
        lowList: [],
        lotteryData: lotteryData,
        intervalIds: []
      }
    },
    mounted() {
      self = this;
      Vue.nextTick(() => {
        self.getOpenedCodeByType(0);
      });
    },
    beforeDestroy() {
      for (let i = 0; i < self.intervalIds.length; i++) {
        clearInterval(self.intervalIds[i]);
      }
    },
    methods: {
      changeTabIndex(currIndex) {
        self.activeTabIndex = currIndex;
        switch (currIndex) {
          case 0:
            self.tabLineLeft = 0;
            break;
          case 1:
            self.tabLineLeft = 100;
            break;
          case 2:
            self.tabLineLeft = 200;
            break;
        }
      },
      jumpToDetail(item) {
        self.$router.push(`/detail?title=${item.name}&code=${item.code}`);
      },
      onTabClick(val) {
        self.changeTabIndex(val)
      },
      getOpenedCodeByType(type) {
        const options = {
          type: type
        };
        service.getOpencodeByType(self, options, (res) => {
          console.log(JSON.parse(JSON.stringify(res.data)));
          for (let i = 0; i < res.data.length; i++) {
            if (typeof res.data[i].opencode == 'string') {
              res.data[i].opencode = res.data[i].opencode.split(',');
            }
            if (res.data[i].opencode[res.data[i].opencode.length - 1].indexOf('+') >= 0) {
              let lastValue = res.data[i].opencode[res.data[i].opencode.length - 1].split('+');
              res.data[i].opencode[res.data[i].opencode.length - 1] = lastValue[0];
              res.data[i].opencode.push(lastValue[1]);
            }
            if (res.data[i].opencode[res.data[i].opencode.length - 2].indexOf('+') >= 0) {
              let valueArr = res.data[i].opencode[res.data[i].opencode.length - 2].split('+');
              res.data[i].opencode[res.data[i].opencode.length - 2] = valueArr[0];
              let lastValue = res.data[i].opencode[res.data[i].opencode.length - 1];
              res.data[i].opencode[res.data[i].opencode.length - 1] = valueArr[1];
              res.data[i].opencode[res.data[i].opencode.length] = lastValue;
            }
          }
          switch (type) {
            case 0:
              self.hotList = res.data;
              for (let i = 0; i < self.hotList.length; i++) {
                self.intervalIds.push(setInterval(() => {
                  self.$set(self.hotList[i], 'countDown', self.countDown(self.hotList[i].nextOpenTime));
                }, 1000));
              }
              break;
            case 1:
              self.highList = res.data;
              for (let j = 0; j < self.highList.length; j++) {
                self.intervalIds.push(setInterval(() => {
                  self.$set(self.highList[j], 'countDown', self.countDown(self.highList[j].nextOpenTime));
                }, 1000));
              }
              break;
            case 2:
              self.lowList = res.data;
              for (let z = 0; z < self.lowList.length; z++) {
                self.intervalIds.push(setInterval(() => {
                  self.$set(self.lowList[z], 'countDown', self.countDown(self.lowList[z].nextOpenTime));
                }, 1000));
              };
              break;
          }
        });
      },
      formatDate(date) {
        return common.formatDate(date, 'MM-dd');
      },
      formatCurrDay(date) {
        return common.formatCurrDay(date);
      },
      formatClass(length) {
        return `ball-${length}`;
      },
      formatColor(index, length) {
        const colorArr = ['#29BF04', '#5100FD', '#E3E3E3', '#8FC31F', '#FF0001', '#FFFF06', '#4C4C4C', '#FF7300', '#82FDFF', '#1289EC']
        if (length == 10) {
          return colorArr[index];
        }
      },
      countDown(time) {
        var EndTime = new Date(time);
        var NowTime = new Date();
        var t = EndTime.getTime() - NowTime.getTime();
        var d = 0;
        var h = 0;
        var m = 0;
        var s = 0;
        if (true) {
          d = Math.floor(t / 1000 / 60 / 60 / 24) != 0 ? `${ Math.floor(t / 1000 / 60 / 60 / 24) }天` : '';
          h = Math.floor(t / 1000 / 60 / 60 % 24) != 0 ? `${ Math.floor(t / 1000 / 60 / 60 % 24) }小时` : '';
          m = Math.floor(t / 1000 / 60 % 60) != 0 ? `${ Math.floor(t / 1000 / 60 % 60) }分` : '';
          s = Math.floor(t / 1000 % 60) != 0 ? `${ Math.floor(t / 1000 % 60) }秒` : '';

        }
        return `${d}${h}${m}${s}`;
      }
    },
    watch: {
      activeTabIndex(val) {
        self.changeTabIndex(val)
        self.getOpenedCodeByType(val);
//        self.$refs.scroller1.finishPullToRefresh()
      }
    }
  }

</script>
<style>
    ::-webkit-scrollbar {
        width: 0;
    }
   .page-content {
     padding-bottom: 44px;
   }

  h2 {
    font-family: Candara,Calibri,Segoe,Segoe UI,Optima,Arial,sans-serif;
    color: #888;
  }

  .page.has-navbar .page-content {
    padding-top: 1.75rem;
  }

  .navbar .center,.navbar .center .title {
    background-color: #E4233E;
    color: #fff;
    height: .96rem;
    line-height: .95rem;
  }

  .tabs-color-positive .tab-item {
    color: #565656!important;
    border-color: transparent!important;
  }

  .tabs-color-positive .tab-item.active {
    color: #E4233E!important;
  }

  .tabs,.tab-item {
    top: .96rem!important;
    height: .64rem;
    line-height: .6rem;
  }

  .tab-line {
    position: absolute;
    top: 1.55rem;
    border-bottom: 2px solid #E4233E;
    z-index: 10;
    transition: All 0.2s ease-in-out;
  }

  .swiper-pagination {
    display: none;
  }

  .item:active {
    background-color: #ececec;
  }

  .item {
    display: flex;
    align-items: flex-start;
    padding: .2rem 0!important;
  }

  .item i {
    height: 100%!important;
    width: .75rem;
  }

  .item > .item-logo {
    width: 1.08rem;
  }

  .item > .item-logo img {
    width: .85rem;
    border-radius: 50%;
  }

  .item .item-body-title .No, .item .item-body-title .date, .countdown {
    margin-left: .1rem;
    color: #9c9c9c;
    font-size: .22rem;
  }

  .countdown {
    margin-left: 0;
  }

  .item .item-body-title .name {
    color: #2e2e2e;
    font-size: .24rem;
    font-weight: bold;
  }

  .item-body {
    flex: 1;
    padding: 0;
    width: 5.8rem;
    overflow: hidden;
  }

  .item-body-ball {
    display: flex;
    width: 90%;
    min-height: .9rem;
    align-items:Center;
    flex-wrap: wrap;
    color: #fff;
    padding-top: .1rem;
  }

  .item-body-ball .ball {
    width: .5rem;
    height: .5rem;
    line-height: .5rem;
    text-align: center;
    border-radius: 50%;
    margin: 0 .1rem .1rem 0;
    background-color: #e2263f;
    display: inline-block;
  }

  .blue-ball {
    background-color: #0e6ad1!important;
  }

  .item-body-ball.ball-10 .ball {
    width: .35rem;
    height: .37rem;
    line-height: .37rem;
    font-size: .24rem;
    text-align: center;
    border-radius: 4px;
    margin-right: .08rem;
    display: inline-block;
  }

  .button {
    color: white;
  }

  .button:hover {
    color: white;
  }
</style>
