<template>
  <div
    class="songplaypage"
    v-if="WhenMusiClickId"
    @touchstart="touchstarts"
    @touchend="touchends"
  >
    <div class="contents">
      <template v-if="items.picUrl">
        <div
          class="bg"
          :style="{
            'background-image': 'url(' + items.picUrl + ')'
          }"
        ></div>
      </template>
      <template v-else>
        <div
          class="bg"
          :style="{
            'background-image': 'url(' + items.al.picUrl + ')'
          }"
        ></div>
      </template>

      <div class="shade"></div>
      <div class="content">
        <div class="packup" @click="packUp"></div>
        <div class="zhen">
          <img
            :class="{ active: isnowPlay }"
            src="../assets/cd_tou.png"
            alt=""
          />
        </div>
        <div class="img">
          <template v-if="items.picUrl">
            <div class="boximg">
              <img :class="{ active: !isnowPlay }" :src="items.picUrl" alt="" />
            </div>
          </template>
          <template v-else>
            <div class="boximg">
              <img
                :class="{ active: !isnowPlay }"
                :src="items.al.picUrl"
                alt=""
              />
            </div>
          </template>
        </div>
        <div class="songmessage">
          <div class="songname">{{ items.name }}</div>
          <div class="singermessage">
            <template v-if="items.picUrl">
              <span class="singername">{{
                items.song.album.artists[0].name
              }}</span>
            </template>
            <template v-else>
              <span class="singername">{{ items.ar[0].name }}</span>
            </template>
            <span class="off">音效off</span>
            <span class="mv">视频2</span>
            <h4 class="songword">{{ lyrictext }}</h4>
          </div>
        </div>
        <div class="progressbar">
          <div class="bar" style="background:#999999">
            <van-slider
              class="p"
              v-model="value"
              active-color="#ee0a24"
              @change="onChange"
            >
              <div
                slot="button"
                class="custom-button"
                style="background:white;height:3px;"
              >
                <span class="most" :style="{ left: value + '%' }"></span>
              </div>
            </van-slider>
          </div>
          <div class="playtime">
            <span>{{ SongCurrentPlayTime }}</span>
            <span>{{ SomgTotalTime }}</span>
          </div>
        </div>
        <div class=" command">
          <span @click="PlayPatternClick">
            <template v-if="circulationPlay">
              <i class="fa fa-refresh" aria-hidden="true"></i>
            </template>

            <template v-if="singlePlay">
              <i class="fa fa-apple" aria-hidden="true"></i>
            </template>
            <template v-if="randomPlay">
              <i class="fa fa-random" aria-hidden="true"></i>
            </template>
          </span>
          <span @click="PrevSong">
            <i class="fa fa-fast-backward" aria-hidden="true"></i>
          </span>
          <span @click="isnowPlayMusic">
            <template v-if="!isnowPlay">
              <i class="fa fa-play-circle" aria-hidden="true"></i>
            </template>
            <template v-else>
              <i class="fa fa-pause-circle" aria-hidden="true"></i>
            </template>
          </span>
          <span @click="NextSong">
            <i class="fa fa-fast-forward" aria-hidden="true"></i>
          </span>
          <span @click="shousonglist = !shousonglist">
            <i class="fa fa-list" aria-hidden="true"></i>
          </span>
        </div>
      </div>
      <div class="singlelist" :class="{ listactive: shousonglist }">
        <template v-if="playlist[1]">
          <ul>
            <li
              v-for="(item, index) in playlist[1]"
              :key="index"
              :index="index"
              :playlists="playlist[1]"
              @click="translateSongId(index)"
            >
              <div class="list">
                <span :class="{ active: currentIndex == index ? true : '' }">{{
                  item.name
                }}</span>
                <span>SQ</span>
                <span :class="{ active: currentIndex == index ? true : '' }"
                  >-{{ item.ar[0].name }}</span
                >
                <span v-if="currentIndex == index">
                  <img src="../assets/musicon.gif" alt="" />
                </span>
              </div>
            </li>
          </ul>
        </template>
        <h4 class="packups" @click="upsonglist">关闭</h4>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Slider } from "vant";
// import SongListItem from "@/components/SongListItem.vue";
Vue.use(Slider);
export default {
  name: "PlayMusicBollBigShow",
  props: [
    "WhenMusiClickId",
    "isnowPlay",
    "smallPlay",
    "bigPlayx",
    "SongPlayTimeArr",
    "playlist",
    "currentIndex",
    "lyrictext"
  ],
  data() {
    return {
      value: 0,
      step: 1,
      items: null,
      isPlay: true,
      PlayPatternCurrent: 0,
      circulationPlay: true,
      singlePlay: false,
      randomPlay: false,
      playBtncut: true,
      play: null,
      SongCurrentPlayTime: "00:00",
      SomgTotalTime: "00:00",
      Curreentplayindex: null,
      shousonglist: false,
      startPagx: null
    };
  },
  methods: {
    touchstarts(event) {
      this.startPagx = event.touches[0].pageX;
    },
    touchends(event) {
      let x = event.changedTouches[0].pageX;
      if (x - this.startPagx >= 50) {
        this.$router.go(-1);
        this.$emit("smallPlays", true);
      }
    },
    translateSongId(i) {
      this.$emit("translateWhenSongId", this.playlist[1][i]);
      this.$emit("translatePlaylist", [i, this.playlist[1]]);
    },
    //歌单
    upsonglist() {
      this.shousonglist = false;
    },
    showSongodd() {},
    onChange(value) {
      this.$emit("translateWhenPlayTime", value);
    },
    PlayPatternClick() {
      this.PlayPatternCurrent++;
      if (this.PlayPatternCurrent >= 3) {
        this.PlayPatternCurrent = 0;
      }
      if (this.PlayPatternCurrent <= 3) {
        if (this.PlayPatternCurrent == 0) {
          this.circulationPlay = true;
          this.singlePlay = false;
          this.randomPlay = false;
          this.$emit("tranlateplaymoder", [
            this.circulationPlay,
            this.singlePlay,
            this.randomPlay
          ]);
        } else if (this.PlayPatternCurrent == 1) {
          this.circulationPlay = false;
          this.singlePlay = true;
          this.randomPlay = false;
          this.$emit("tranlateplaymoder", [
            this.circulationPlay,
            this.singlePlay,
            this.randomPlay
          ]);
        } else {
          this.circulationPlay = false;
          this.singlePlay = false;
          this.randomPlay = true;
          this.$emit("tranlateplaymoder", [
            this.circulationPlay,
            this.singlePlay,
            this.randomPlay
          ]);
        }
      }
    },
    packUp() {
      this.$emit("smallPlays", true);
      this.$router.go(-1);
    },
    isnowPlayMusic() {
      this.$emit("isnowPlayMusic", !this.isnowPlay);
    },
    //时间处理方法
    DealTime(time) {
      let differminute = parseInt(time / 60);
      let differseconds = time % 60;
      if (differminute < 10) {
        differminute = "0" + differminute;
      }
      if (differseconds < 10) {
        differseconds = "0" + differseconds;
      }
      let t = differminute + ":" + differseconds;
      return t;
    },
    //上一曲
    PrevSong() {
      if (this.playlist[1].tracks) {
        this.Curreentplayindex =
          this.Curreentplayindex <= 0
            ? this.playlist[1].tracks.length - 1
            : --this.Curreentplayindex;
        this.items = this.playlist[1].tracks[this.Curreentplayindex];
      } else {
        this.Curreentplayindex =
          this.Curreentplayindex <= 0
            ? this.playlist[1].length - 1
            : --this.Curreentplayindex;
        this.items = this.playlist[1][this.Curreentplayindex];
      }
      this.$emit("PrevSongTure", true);
      setTimeout(() => {
        this.$emit("PrevSongTure", false);
      }, 1);
      // this.Singerpanduan();
    },
    //下一曲
    NextSong() {
      if (this.playlist[1].tracks) {
        this.Curreentplayindex =
          this.Curreentplayindex >= this.playlist[1].tracks.length - 1
            ? 0
            : ++this.Curreentplayindex;
        this.items = this.playlist[1].tracks[this.Curreentplayindex];
      } else {
        this.Curreentplayindex =
          this.Curreentplayindex >= this.playlist[1].length - 1
            ? 0
            : ++this.Curreentplayindex;
        this.items = this.playlist[1][this.Curreentplayindex];
      }
      this.$emit("NextSongTure", true);
      setTimeout(() => {
        this.$emit("NextSongTure", false);
      }, 1);
    }
  },
  watch: {
    currentIndex() {
      this.Curreentplayindex = this.currentIndex;
      if (this.playlist[1].tracks) {
        this.items = this.playlist[1].tracks[this.Curreentplayindex];
      } else {
        this.items = this.playlist[1][this.Curreentplayindex];
      }
    },
    WhenMusiClickId() {
      this.items = this.WhenMusiClickId;
    },
    SongPlayTimeArr() {
      if (this.SongPlayTimeArr[1] >= 0) {
        let currentplaytime = Math.floor(this.SongPlayTimeArr[0] + 1);
        let songtoatltimes = Math.floor(this.SongPlayTimeArr[1] + 1);
        this.SongCurrentPlayTime = this.DealTime(currentplaytime);
        this.SomgTotalTime = this.DealTime(songtoatltimes);
        this.value =
          (Math.floor(this.SongPlayTimeArr[0]) /
            Math.floor(this.SongPlayTimeArr[1])) *
          100;
      }
    },
    isnowPlay: function(newValue) {
      if (this.isnowPlay) {
        this.isPlay = false;
      } else {
        this.isPlay = true;
      }
    }
  },
  created() {
    this.items = this.WhenMusiClickId;
    this.$emit("tranlateplaymoder", [
      this.circulationPlay,
      this.singlePlay,
      this.randomPlay
    ]);
  }
};
</script>

<style lang="less">
.songplaypage {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  text-align: center;
  position: relative;
  color: white;
  .contents {
    height: 100%;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      filter: blur(10px);
    }
    .shade {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.65);
      z-index: 1;
    }
    .content {
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
      .packup {
        text-align: left;
        padding: 5px 10px 0px 5px;
        font-size: 25px;
        width: 11px;
        height: 30px;
        background-image: url("../assets/back.png");
        background-repeat: no-repeat;
        transform: rotate(-134deg);
        background-size: 100%;
        margin-left: 15px;
      }
      .zhen {
        position: absolute;
        top: 2%;
        left: 50%-5%;
        height: 14vh;
        img {
          transition: all 0.5s;
          height: 100%;
          transform-origin: top;
          transform: rotate(-50deg);
        }
        .active {
          transition: all 0.5s;
          height: 100%;
          transform-origin: top;
          transform: rotate(-30deg);
        }
      }
      .img {
        margin-top: 10%;
        .boximg {
          margin: 0px auto;
          width: 60%;
          background-image: url("../assets/disc.png");
          background-size: 100%;
          background-repeat: no-repeat;
          border-radius: 50%;
          height: 34vh;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            width: 60%;
            height: 60.1%;
            margin: 20px 0;
            border-radius: 50%;
            box-shadow: 0px 0px 10px 0 rgba(0, 0, 0, 1);
            animation: myrolling 10s linear infinite;
          }
          .active {
            width: 60%;
            height: 60.1%;
            margin: 20px 0;
            border-radius: 50%;
            box-shadow: 0px 0px 10px 0 rgba(0, 0, 0, 1);
            animation: myrolling 10s linear infinite;
            animation-play-state: paused;
          }
        }
      }
      .songmessage {
        position: absolute;
        bottom: 32vh;
        text-align: left;
        padding: 0px 25px;
        .songname {
          font-size: 3vh;
          letter-spacing: 1px;
        }
        .singermessage {
          color: #999999;

          span {
            display: inline-block;
            // padding: 5px;
            margin: 5px;
            &:nth-of-type(1) {
              margin-left: 0;
            }
            &:nth-of-type(2) {
              background: rgba(235, 227, 227, 0.1);
              padding: 0 5px;
              border-radius: 4px;
              font-size: 10px;
            }
            &:nth-of-type(3) {
              background: rgba(235, 227, 227, 0.1);
              padding: 0 5px;
              border-radius: 4px;
              font-size: 10px;
            }
          }
          h4 {
            height: 20px;
            border-radius: 5px 5px 0 0;
          }
        }
      }
      .progressbar {
        width: 100%;
        position: absolute;
        bottom: 13vh;
        input {
          border-radius: 4px;
        }
        .bar {
          margin: 0px auto;
          width: 90%;
          .p {
            position: relative;
            .custom-button {
              .most {
                position: absolute;
                top: -3px;
                display: inline-block;
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
              }
            }
            .van-slider__bar {
              transition: none;
            }
          }
        }
        .playtime {
          span {
            padding: 8px 20px;
            color: #999999;
            &:nth-of-type(1) {
              float: left;
            }
            &:nth-of-type(2) {
              float: right;
            }
          }
        }
      }
      .command {
        width: 100%;
        position: absolute;
        bottom: 20px;
        left: 0;
        display: flex;
        span {
          flex: 1;
          font-size: 20px;
          margin: 0px 22px;
          line-height: 52px;
          &:nth-of-type(1) {
            color: #999999;
          }
          &:nth-of-type(2) {
            font-size: 25px;
          }
          &:nth-of-type(3) {
            font-size: 40px;
          }
          &:nth-of-type(4) {
            font-size: 25px;
          }
          &:nth-of-type(5) {
            position: relative;
            z-index: 10;
            color: #999999;
          }
        }
      }
    }
    .singlelist {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      overflow-y: scroll;
      height: 54vh;
      transition: all 0.5s;
      bottom: -100vh;
      left: 0;
      width: 100%;
      background: rgba(10, 9, 9, 0.55);
      position: absolute;
      z-index: 4;
      ul {
        li {
          text-align: left;
          padding: 10px 15px;
        }
      }
    }
    .listactive {
      overflow-x: hidden;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      position: relative;
      overflow-y: scroll;
      height: 54vh;
      transition: all 0.5s;
      bottom: 0;
      left: 0;
      width: 100%;
      background: rgba(10, 9, 9, 0.55);
      position: absolute;
      z-index: 4;
      .packups {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        transition: all 0.5s;
        width: 100%;
        z-index: 4;
        position: fixed;
        bottom: 0;
        height: 7vh;
        background: rgba(10, 9, 9, 0.65);
        line-height: 7vh;
        box-shadow: 0 0 3px 0 rgb(110, 110, 110);
      }
      li {
        border-top: 1px solid rgb(22, 21, 21);
        .list {
          display: flex;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          overflow: hiddren;
          word-break: keep-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          span {
            &:nth-of-type(1) {
              max-width: 30%;
              word-break: keep-all;
              white-space: nowrap;
              text-overflow: ellipsis;
              display: -webkit-box;
              overflow: hidden;
              min-height: 25px;
              line-height: 1.2;
            }
            &:nth-of-type(2) {
              text-align: center;
              display: inline-block;
              height: 15px;
              width: 25px;
              color: orange;
              font-size: 8px;
              border: 1px solid orange;
              margin: 0px 8px;
              line-height: 15px;
              border-radius: 4px;
            }
            &:nth-of-type(4) {
              margin-left: 20px;
            }
            &.active {
              color: green;
            }
          }
        }
      }
    }
  }
  @keyframes myrolling {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
