<template>
  <div class="page has-navbar" v-nav="{ title: title, 'showBackButton': true }">
    <div class="page-content" :style="{ 'padding-top': (lotteryCode == 2 || lotteryCode == 3 || lotteryCode == 4) ? '1.76rem' : '1.15rem' }">
      <div v-if="lotteryCode == 2 || lotteryCode == 3 || lotteryCode == 4">
        <tabs :tab-items="tabs" :tab-index="activeTabIndex" :on-tab-click="onTabClick"></tabs>
        <div class="tab-line" :style="{'transform': 'translate(' + tabLineLeft + '%, 0)', 'width': 100 / tabs.length + '%'}"></div>
      </div>

      <div class="top-detail" thin-border v-if="activeTabIndex == 0 && lotteryList.length > 0">
        <div class="item">
          <div class="item-body">
            <div class="item-body-title">
              <span class="No">第{{lotteryObj.expect}}期</span>
              <span class="date">开奖时间：{{formatDate(lotteryObj.opentime, 'HH时mm分')}} {{formatDate(lotteryObj.opentime, 'MM-DD')}} {{formatDay(lotteryObj.opentime)}}</span>
            </div>
            <div class="item-body-ball" :class="formatClass(lotteryObj.opencode.length)">
              <div class="ball" v-for="(code, index) in lotteryObj.opencode"
                   :class="formatColor(index, lotteryObj.opencode.length, lotteryCode, code)"
              >{{parseInt(code)}}</div>
            </div>
          </div>
        </div>
        <div class="detail-title">开奖分析</div>
        <div class="item">
          <ul>
            <li>冠亚军和</li>
            <li>{{lotteryObj.sum}}</li>
            <li>{{lotteryObj.sOrD}}</li>
            <li>{{lotteryObj.size}}</li>
            <li v-if="lotteryCode != 4">1~5龍虎</li>
            <li class="big-li" v-if="lotteryCode != 4">
              <span v-for="item in lotteryObj.contrast" :style="{ 'color': item == '龍' ? 'red' : '#555' }">{{item}}</span>
            </li>
            <li v-if="lotteryCode == 4">其他</li>
            <li class="big-li" v-if="lotteryCode == 4">
              龙虎：<span style="color: red">{{lotteryObj.res}}</span>
            </li>
          </ul>
        </div>
      </div>
      <scroll v-if="activeTabIndex == 1" :style="{ 'margin-top': (lotteryCode == '2' || lotteryCode == '3' || lotteryCode == '4') ? '91px' : '55px' }"
                :on-refresh="onRefresh"
                :on-infinite="onInfinite">
        <div class="list list-ios" thin-border style="margin-bottom: 0">
          <div class="item item-ios item-icon-right" v-for="item in lotteryList" @click="getDetail(item)">
            <div class="item-body">
              <div class="item-body-title">
                <span class="No">第{{item.expect}}期</span>
                <span class="date">开奖时间：{{formatDate(item.opentime, 'HH时mm分')}} {{formatDate(item.opentime, 'MM-DD')}} {{formatDay(item.opentime)}}</span>
              </div>
              <div class="item-body-ball" :class="formatClass(item.opencode.length)" v-if="lotteryCode">
                <div class="ball" v-for="(code, index) in item.opencode"
                     :class="formatColor(index, item.opencode.length, lotteryCode, code)"
                >{{parseInt(code)}}</div>
              </div>
            </div>
            <i class="icon ion-ios-arrow-right" style="color: #DDD;"></i>
          </div>
        </div>
        <div v-if="noMore" slot="infinite"  class="no-more">已无更多</div>
      </scroll>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import service from '../../serviceInterface/serviceInterface';
  import common from '../../assets/common/common';
  import lotteryData from '../../assets/data.json';

  export default {
    data () {
      return {
        tabs: [
          "本期详情",
          "开奖记录"
        ],
        activeTabIndex: 1,
        tabLineLeft: 0,
        lotteryData: lotteryData,
        lotteryList: [],
        title: '开奖记录',
        lotteryCode: '',
        offset: 0,
        count: 10,
        noMore: false,
        lotteryObj: null,
        throttle: true, // 控制并发量
      }
    },
    mounted() {
      self = this;
      self.title = self.$route.query.title;
      self.lotteryCode = self.$route.query.code;
      if (self.lotteryCode == 2 || self.lotteryCode == 3 || self.lotteryCode == 4) {
        self.activeTabIndex = 0;
      }
      self.getOpenedCodeByCode();
    },
    methods: {
      changeTabIndex(currIndex) {
        self.activeTabIndex = currIndex;
        // console.log(self.activeTabIndex);
        switch (currIndex) {
          case 0:
            self.tabLineLeft = 0;
            break;
          case 1:
            self.tabLineLeft = 100;
            break;
        }
      },
      onTabClick(val) {
        self.changeTabIndex(val)
      },
      getOpenedCodeByCode() {
        const options = {
          code: self.lotteryCode,
          count: self.count,
          offset: self.offset
        };
        service.getOpencodeByCode(self, options, (res) => {
        
          // console.log(JSON.parse(JSON.stringify(res.data)));
          if (res.data.length < self.count) {
            self.noMore = true;
          }
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
          self.lotteryObj = res.data[0];
          self.countDetail();

          if (self.offset == 0) {
            self.lotteryList = res.data;
          } else {
            self.lotteryList = self.lotteryList.concat(res.data);
          }
          self.throttle = true;
        });
      },
      formatDate(date, formater) {
        return common.formatDate(date, formater);
      },
      formatDay(date) {
        return common.formatDay(date);
      },
      formatClass(length) {
        return `ball-${length}`;
      },
      formatColor(index, length, parentCode, code) {
        // console.log(parentCode);
        if (length != 10 && index >= self.lotteryData[parentCode].redCount) {
          return "blue-ball"
        } else if (length == 10) {
          return `num-${parseInt(code)}`;
        }
      },
      onRefresh(done) {
        self.offset = 0;
        self.getOpenedCodeByCode();
        setTimeout(() => {
          done()
        }, 1500)
      },
      onInfinite(done) {
        if (!self.noMore && self.throttle) {
        self.throttle = false;
          self.offset += self.count;
          self.getOpenedCodeByCode();
        }
        done();
      },
      countDetail() {
        if (!self.lotteryObj) return;
        let lotteryObj = JSON.parse(JSON.stringify(self.lotteryObj));
        if (self.lotteryCode == "4") {
          lotteryObj.sum = 0;
          for (let i = 0; i < lotteryObj.opencode.length; i++) {
            lotteryObj.sum += parseInt(lotteryObj.opencode[i]);
          }
          if (lotteryObj.sum > 4) {
            lotteryObj.size = "大";
          } else {
            lotteryObj.size = "小";
          }
          if (lotteryObj.sum % 2 == 0) {
            lotteryObj.sOrD = "双";
          } else {
            lotteryObj.sOrD = "单";
          }
          if (parseInt(lotteryObj.opencode[0]) > parseInt(lotteryObj.opencode[4])) {
            lotteryObj.res = "龍";
          } else if (parseInt(lotteryObj.opencode[0]) < parseInt(lotteryObj.opencode[4])) {
            lotteryObj.res = "虎";
          } else {
            lotteryObj.res = "和";
          }
        } else {
          lotteryObj.sum = parseInt(self.lotteryObj.opencode[0]) + parseInt(self.lotteryObj.opencode[1]);
          if (lotteryObj.sum > 6) {
            lotteryObj.size = "大";
          } else {
            lotteryObj.size = "小";
          }
          if (lotteryObj.sum % 2 == 0) {
            lotteryObj.sOrD = "双";
          } else {
            lotteryObj.sOrD = "单";
          }
          lotteryObj.contrast = [];
          let openCode = JSON.parse(JSON.stringify(lotteryObj.opencode));
          while (openCode.length > 0) {
            if (parseInt(openCode[0]) > parseInt(openCode[openCode.length - 1])) {
              lotteryObj.contrast.push('龍');
            } else {
              lotteryObj.contrast.push('虎');
            }
            openCode.splice(0, 1);
            openCode.splice(openCode.length - 1, 1);
          }
        }
        self.lotteryObj = lotteryObj;
      },
      getDetail(item) {
        if (self.lotteryCode == "2" || self.lotteryCode == "3" || self.lotteryCode == "4") {
          self.lotteryObj = item;
          self.countDetail();
          self.activeTabIndex = 0;
        }
      }
    },
    watch: {
      activeTabIndex(val) {
        self.changeTabIndex(val)
      }
    }
  }

</script>
<style>
  h2 {
    font-family: Candara,Calibri,Segoe,Segoe UI,Optima,Arial,sans-serif;
    color: #888;
  }

  .navbar .center,.navbar .center .title {
    background-color: #E4233E;
    color: #fff;
    height: .96rem;
    line-height: .95rem;
    display: block;
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
  }

  .no-more {
    text-align: center;
  }

  ul{
    padding:0;
    width:100%; 				/*设置表格宽 */
    border-top:#bbb 1px solid;	/*设置表格上边框*/
    border-right:#bbb 1px solid;	/*设置表格右边框*/
  }
  li{
    border-left:#bbb 1px solid;	/*设置表格左边框*/
    border-bottom:#bbb 1px solid;/*设置表格下边框*/
    /*设置单元格边框*/
    list-style:none;			/*清除项目列表前的标记*/
    float:left;					/*设置单元格浮动，用于水平排列*/
    display:block;
    line-height: 50px;/*设置单元格为块级元素于用语控制大小等*/
    width: 25%;					/*设置单元格宽*/
    height:50px;				/*设置单元格高*/
    text-align:center;			/*设置单元格内文本对齐方式*/
  }

  .top-detail {
    width: 100%;
  }

  .top-detail .item {
    padding: .2rem!important;
  }

  .top-detail .item-body-ball {
    padding-left: .1rem;
  }

  .detail-title {
    width: 100%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background-color: #fff;
  }

  .big-li {
    width: 75%;
  }

  .big-li span {
    margin: 0 .1rem;
    font-size: .3rem;
  }
</style>
