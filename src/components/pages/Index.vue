<template>
  <div class="page has-navbar" v-nav="{ title: '彩票查询' }">
    <div class="page-content">
      <tabs :tab-items="tabs" :tab-index="activeTabIndex" :on-tab-click="onTabClick"></tabs>
      <div class="tab-line" :style="{'transform': 'translate(' + tabLineLeft + '%, 0)', 'width': 100 / tabs.length + '%'}"></div>
      <swiper direction="horizontal" width="100%" ref="indexSwiper">
        <swiper-item>
          <scroll>
            <div class="list list-ios" thin-border>
              <div class="item item-ios item-icon-right" v-for="item in hotList" @click="jumpToDetail(item)">
                <div class="item-logo"><img :src="'static/logo/' + lotteryData[item.code].icon + '.png'"></div>
                <div class="item-body">
                  <div class="item-body-title">
                    <span class="name">{{item.name}}</span>
                    <span class="No">第{{item.expect}}期</span>
                    <span class="date">{{formatDate(item.opentime)}} ({{formatDay(item.opentime)}})</span>
                  </div>
                  <div class="item-body-ball" :class="formatClass(item.opencode.length)">
                    <div class="ball" v-for="(code, index) in item.opencode"
                         :class="formatColor(index, item.opencode.length, item.code, code)"
                    >{{parseInt(code)}}</div>
                  </div>
                  <span class="countdown">下期开奖倒计时：{{item.countDown}}</span>
                </div>
                <i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
              </div>
            </div>
          </scroll>
        </swiper-item>

        <swiper-item>
          <scroll ref="scroller2">
            <div class="list list-ios" thin-border>
              <div class="item item-ios item-icon-right" v-for="item in highList" @click.prevent="jumpToDetail(item)">
                <div class="item-logo"><img :src="'static/logo/' + lotteryData[item.code].icon + '.png'"></div>
                <div class="item-body">
                  <div class="item-body-title">
                    <span class="name">{{item.name}}</span>
                    <span class="No">第{{item.expect}}期</span>
                    <span class="date">{{formatDate(item.opentime)}} ({{formatDay(item.opentime)}})</span>
                  </div>
                  <div class="item-body-ball" :class="formatClass(item.opencode.length)">
                    <div class="ball" v-for="(code, index) in item.opencode"
                         :class="formatColor(index, item.opencode.length, item.code, code)"
                    >{{parseInt(code)}}</div>
                  </div>
                  <span class="countdown">下期开奖倒计时：{{item.countDown}}</span>
                </div>
                <i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
              </div>
            </div>
          </scroll>
        </swiper-item>

        <swiper-item>
          <scroll ref="scroller3">
            <div class="list list-ios" thin-border>
              <div class="item item-ios item-icon-right" v-for="item in lowList" @click.prevent="jumpToDetail(item)">
                <div class="item-logo"><img :src="'static/logo/' + lotteryData[item.code].icon + '.png'"></div>
                <div class="item-body">
                  <div class="item-body-title">
                    <span class="name">{{item.name}}</span>
                    <span class="No">第{{item.expect}}期</span>
                    <span class="date">{{formatDate(item.opentime)}} ({{formatDay(item.opentime)}})</span>
                  </div>
                  <div class="item-body-ball" :class="formatClass(item.opencode.length)">
                    <div class="ball" v-for="(code, index) in item.opencode"
                         :class="formatColor(index, item.opencode.length, item.code, code)"
                    >{{parseInt(code)}}</div>
                  </div>
                  <span class="countdown">下期开奖倒计时：{{item.countDown}}</span>
                </div>
                <i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
              </div>
            </div>
          </scroll>
        </swiper-item>
      </swiper>
    </div>
    <!--<md-footer></md-footer>-->
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
        intervalIds: [],
        openingIntervalIds: []
      }
    },
    mounted() {
      self = this;
      Vue.nextTick(() => {
        let activeIndex = parseInt(sessionStorage.getItem("activeTabIndex"));
        let type = self.$route.query.type;
//        console.log(activeIndex)
//        console.log(type)
        if (activeIndex || type) {
          let index = activeIndex || parseInt(type);
          self.changeTabIndex(index);
          self.getOpenedCodeByType(index);
          sessionStorage.removeItem("activeTabIndex")
        } else {
          self.getOpenedCodeByType(0);
        }
        self.$watch("$refs.indexSwiper.swiper.activeIndex", (val) => {
          self.changeTabIndex(val);
        })
      });
    },
    beforeDestroy() {
      for (let i = 0; i < self.intervalIds.length; i++) {
        clearInterval(self.intervalIds[i]);
      }
      sessionStorage.setItem("activeTabIndex", self.activeTabIndex);
    },
    methods: {
      changeTabIndex(currIndex) {
        self.activeTabIndex = currIndex;
        switch (currIndex) {
          case 0:
            self.tabLineLeft = 0;
            self.$refs.indexSwiper.go(0);
            break;
          case 1:
            self.tabLineLeft = 100;
            self.$refs.indexSwiper.go(1);
            break;
          case 2:
            self.tabLineLeft = 200;
            self.$refs.indexSwiper.go(2);
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
              break;
            case 1:
              self.highList = res.data;
              break;
            case 2:
              self.lowList = res.data;
              break;
          }
          self.setIntervalToCountDown();
        });
      },
      setIntervalToCountDown() {
        for (let i = 0; i < self.intervalIds.length; i++) {
          clearInterval(self.intervalIds[i]);
        }
        self.intervalIds = [];
        switch (self.activeTabIndex) {
          case 0:
            for (let i = 0; i < self.hotList.length; i++) {
              self.setIntervalByObj(self.hotList[i]);
            }
            break;
          case 1:
            for (let j = 0; j < self.highList.length; j++) {
              self.setIntervalByObj(self.highList[j]);
            }
            break;
          case 2:
            for (let z = 0; z < self.lowList.length; z++) {
              self.setIntervalByObj(self.lowList[z]);
            }
            break;
        }
      },
      formatDate(date) {
        return common.formatDate(date, 'MM-DD HH:mm');
      },
      formatDay(date) {
        return common.formatDay(date);
      },
      formatClass(length) {
        return `ball-${length}`;
      },
      formatColor(index, length, parentCode, code) {
        if (length != 10 && index >= self.lotteryData[parentCode].redCount) {
          return "blue-ball"
        } else if (length == 10) {
          return `num-${parseInt(code)}`;
        }
      },
      swiperTouchMove(e) {
        e.preventDefault();
        e.stopPropagation();
      },
      countDown(time) {
        var EndTime = common.formatDate(time);
        var NowTime = common.formatDate();
        var t = common.timeDifference(EndTime, NowTime);
        var d = 0;
        var h = 0;
        var m = 0;
        var s = 0;
        if (t > 0) {
          d = Math.floor(t / 1000 / 60 / 60 / 24) > 0 ? `${ Math.floor(t / 1000 / 60 / 60 / 24) }天` : '';
          h = Math.floor(t / 1000 / 60 / 60 % 24) > 0 ? `${ Math.floor(t / 1000 / 60 / 60 % 24) }小时` : '';
          m = Math.floor(t / 1000 / 60 % 60) > 0 ? `${ Math.floor(t / 1000 / 60 % 60) }分` : '';
          s = `${ Math.floor(t / 1000 % 60) }秒`;
          return `${d}${h}${m}${s}`;
        } else {
          return '开奖中...';
        }
      },
      getNewestOpencode(code) {
        const getNewestOpencodeCallBack = (res) => {
          if (common.timeDifference(common.formatDate(res.data.nextOpenTime), common.formatDate()) < 0) {
            setTimeout(() => {
              self.getNewestOpencode(code);
            }, 20000);
          } else {
            res.data.code = code;
            if (typeof res.data.opencode == 'string') {
              res.data.opencode = res.data.opencode.split(',');
            }
            if (res.data.opencode[res.data.opencode.length - 1].indexOf('+') >= 0) {
              let lastValue = res.data.opencode[res.data.opencode.length - 1].split('+');
              res.data.opencode[res.data.opencode.length - 1] = lastValue[0];
              res.data.opencode.push(lastValue[1]);
            }
            if (res.data.opencode[res.data.opencode.length - 2].indexOf('+') >= 0) {
              let valueArr = res.data.opencode[res.data.opencode.length - 2].split('+');
              res.data.opencode[res.data.opencode.length - 2] = valueArr[0];
              let lastValue = res.data.opencode[res.data.opencode.length - 1];
              res.data.opencode[res.data.opencode.length - 1] = valueArr[1];
              res.data.opencode[res.data.opencode.length] = lastValue;
            }
            switch (self.activeTabIndex) {
              case 0:
                for (let i = 0; i < self.hotList.length; i++) {
                  if (self.hotList[i].code == code) {
                    let lotteryObj = JSON.parse(JSON.stringify(self.hotList[i]));
                    lotteryObj.opencode = res.data.opencode;
                    lotteryObj.nextOpenTime = res.data.nextOpenTime;
                    lotteryObj.opentime = res.data.opentime;
                    lotteryObj.expect = res.data.expect;
                    self.hotList[i] = lotteryObj;
                    self.setIntervalByObj(self.hotList[i]);
                  }
                }
                break;
              case 1:
                for (let j = 0; j < self.highList.length; j++) {
                  if (self.highList[j].code == code) {
                    let lotteryObj = JSON.parse(JSON.stringify(self.highList[j]));
                    lotteryObj.opencode = res.data.opencode;
                    lotteryObj.nextOpenTime = res.data.nextOpenTime;
                    lotteryObj.opentime = res.data.opentime;
                    lotteryObj.expect = res.data.expect;
                    self.highList[j] = lotteryObj;
                    self.setIntervalByObj(self.highList[j]);
                  }
                }
                break;
              case 2:
                for (let z = 0; z < self.lowList.length; z++) {
                  if (self.lowList[z].code == code) {
                    let lotteryObj = JSON.parse(JSON.stringify(self.lowList[z]));
                    lotteryObj.opencode = res.data.opencode;
                    lotteryObj.nextOpenTime = res.data.nextOpenTime;
                    lotteryObj.opentime = res.data.opentime;
                    lotteryObj.expect = res.data.expect;
                    self.lowList[z] = lotteryObj;
                    self.setIntervalByObj(self.lowList[z]);
                  }
                }
                break;
            }
          }
        };
        service.getNewestOpencode(self, { code: code }, getNewestOpencodeCallBack);
      },
      setIntervalByObj(obj) {
        let intervalId = setInterval(() => {
          let countDown = self.countDown(obj.nextOpenTime);
          self.$set(obj, 'countDown', countDown);
          if (countDown.indexOf('开奖中') >= 0) {
            self.getNewestOpencode(obj.code);
            clearInterval(intervalId);
            self.intervalIds.splice(self.intervalIds.indexOf(intervalId));
          }
        }, 1000);
        self.intervalIds.push(intervalId);
      },
      stopEvent(e) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    watch: {
      activeTabIndex(val) {
        self.changeTabIndex(val);
        self.getOpenedCodeByType(val);
//        self.onRefresh();
      }
    }
  }

</script>
<style>
  h2 {
    font-family: Candara,Calibri,Segoe,Segoe UI,Optima,Arial,sans-serif;
    color: #888;
  }

  .page.has-navbar .page-content {
    padding-top: 1.75rem;
  }

  .navbar {
    top: 0;
    bottom: 0;
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
    transition: All 0.4s ease-in-out;
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

  .num-1 {
    background-color: #FFFF06!important;
    color: #676767;
  }

  .num-2 {
    background-color: #1289EC!important;
    color: #fff;
  }

  .num-3 {
    background-color: #4C4C4C!important;
    color: #fff;
  }

  .num-4 {
    background-color: #FF7300!important;
    color: #fff;
  }

  .num-5 {
    background-color: #82FDFF!important;
    color: #676767;
  }

  .num-6 {
    background-color: #5100FD!important;
    color: #fff;
  }

  .num-7 {
    background-color: #E3E3E3!important;
    color: #676767;
  }

  .num-8 {
    background-color: #FF0001!important;
    color: #fff;
  }

  .num-9 {
    background-color: #770000!important;
    color: #fff;
  }

  .num-10 {
    background-color: #29BF04!important;
    color: #fff;
  }

  ::-webkit-scrollbar {
    width: 0;
  }

  .scroll {
    margin-top: 41px;
  }

  .list {
    padding-bottom: 50px!important;
  }
</style>
