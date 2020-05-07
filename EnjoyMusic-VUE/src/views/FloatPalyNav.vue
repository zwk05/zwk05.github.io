<template>
  <div>
    <div class="palynav" v-if="WhenMusiClickId && smallPlay">
      <!-- 音乐播放 -->
      <template v-if="WhenMusiClickId.picUrl">
        <b @click="translateSongId">
          <span
            ><img :class="{ active: isactive }" :src="item.picUrl" alt=""
          /></span>
          <span>{{ item.name }}</span>
        </b>
      </template>
      <template v-if="item.al">
        <b @click="translateSongId">
          <span
            ><img :class="{ active: isactive }" :src="item.al.picUrl" alt=""
          /></span>
          <span>{{ item.name }}</span>
        </b>
      </template>
      <template v-if="item.artists && item.album">
        <b @click="translateSongId">
          <span
            ><img :class="{ active: isactive }" :src="item.al.picUrl" alt=""
          /></span>
          <span>{{ item.name }}</span>
        </b>
      </template>

      <span class="play">
        <i
          aria-hidden="true"
          class="fa fa-play-circle-o"
          @click.stop="playmusic"
          v-if="playBtncut"
        />
        <i
          aria-hidden="true"
          class="fa fa-pause-circle-o"
          @click.stop="pausedmusic"
          v-else
        />
      </span>
      <span class="menu"><i class="fa fa-list" aria-hidden="true"></i></span>
    </div>
    <div v-if="WhenMusiClickId">
      <audio id="music" ref="audio" :src="currentSongUrl" autoplay></audio>
    </div>
  </div>
</template>
<script>
let audio = new Audio();
export default {
  name: "FloatPalyNav",
  props: [
    "WhenMusiClickId",
    "playlist",
    "smallPlay",
    "isnowPlay",
    "isPrevSong",
    "isNextSong",
    "whenPlaytime",
    "playmoder"
  ],
  data() {
    return {
      playBtncut: true,
      play: null,
      songid: null,
      playcurrent: null,
      item: null,
      playlists: null,
      url: null,
      lyric: [],
      lyricArr: [],
      lyrictext: null,
      howsplict: false,
      x: null,
      isactive: true
    };
  },
  methods: {
    //拿歌词
    getlyric(p) {
      this.axios.get("https://music.kele8.cn/lyric?id=" + p).then(response => {
        // window.console.log(response)
        let m = response.data.lrc.lyric.slice(0, 11);
        if (m == "[00:00.000]") {
          this.howsplict = true;
          this.lyric = response.data.lrc.lyric;
          this.dealSinger();
        } else {
          this.howsplict = false;
          var s = response.data.lrc.lyric.split("\n");
          s.splice(0, 1);
          this.lyric = s.toString();
          this.dealSinger();
        }
      }).catch(function(){
        // window.console.log('歌词拿取失败')
        this.getlyric(p)
      });
    },
    dealSinger() {
      if (this.howsplict) {
        this.lyric.split("\n").forEach((element, index) => {
          let t = element.slice(1, 9);
          this.lyricArr[index] = {
            time: t.slice(0, 2) * 60 + Number(t.slice(3)),
            text: element.slice(10).trim()
          };
        });
        this.lyricArr.pop();
        this.lyricArr.shift();
      } else {
        this.lyric.split(",").forEach((element, index) => {
          let t = element.slice(1, 9);
          this.lyricArr[index] = {
            time: t.slice(0, 2) * 60 + Number(t.slice(3)),
            text: element.slice(10).trim()
          };
        });
        this.lyricArr.pop();
        this.lyricArr.shift();
      }
    },
    //歌词的判断函数
    Singerpanduan() {
      if (this.lyricArr.length > 1) {
        for (let i = 0; i < this.lyricArr.length; i++) {
          if (this.lyricArr[i].time >= this.$refs.audio.currentTime) {
            if (this.lyricArr[i].time > this.$refs.audio.currentTime + 60) {
              this.lyricArr.splice(i, 1);
              break;
            }
            // 如果可以当前歌曲时间 小于某个 歌词时间
            if (this.lyricArr[i - 1]) {
              if (this.lyricArr[i - 1].text.slice(0, 1) == "]") {
                this.lyrictext = this.lyricArr[i - 1].text.slice(1);
                this.$emit("transinger", this.lyrictext);
              } else {
                this.lyrictext = this.lyricArr[i - 1].text;
                this.$emit("transinger", this.lyrictext);
              }

              break;
            }
          }
        }
      }
    },
    getsongDetail: function(q) {
      let _this = this;
      fetch("http://music.kele8.cn/song/detail?ids=" + q)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          _this.playlists.push(json.songs[0]);
        });
    },
    OntimeUpdate() {
      let _that = this;
      this.$refs.audio.ontimeupdate = function() {
        _that.Singerpanduan();
        let playtime = this.currentTime;
        let SongtotalTime = this.duration;
        _that.$emit("BackPlayTime", [playtime, SongtotalTime]);
      };
    },
    //生成随机数
    randomNumber(m, n) {
      return Math.round(Math.random() * (n - m) + m);
    },
    //自动播放、循环播放、单曲、随机播放
    onendedModer() {
      let _that = this;
      this.$refs.audio.onended = function() {
        if (_that.playmoder[0]) {
          if (_that.playlist[1].tracks) {
            _that.playcurrent =
              _that.playcurrent >= _that.playlist[1].tracks.length - 1
                ? 0
                : ++_that.playcurrent;
            _that.$emit("backindex", _that.playcurrent);
            _that.item = _that.playlist[1].tracks[_that.playcurrent];
            _that.songid = _that.playlist[1].tracks[_that.playcurrent].id;
          } else {
            _that.playcurrent =
              _that.playcurrent >= _that.playlist[1].length - 1
                ? 0
                : ++_that.playcurrent;
            _that.$emit("backindex", _that.playcurrent);
            _that.item = _that.playlist[1][_that.playcurrent];
            _that.songid = _that.playlist[1][_that.playcurrent].id;
          }
          _that.$refs.audio.onloadedmetadata = function() {
            // _that.playmusic();
          };
          _that.$refs.audio.oncanplay = function() {
            _that.playmusic();
          };
        } else if (_that.playmoder[1]) {
          if (_that.playlist[1].tracks) {
            _that.$emit("backindex", _that.playcurrent);
            _that.item = _that.playlist[1].tracks[_that.playcurrent];
            _that.songid = _that.playlist[1].tracks[_that.playcurrent].id;
          } else {
            _that.$emit("backindex", _that.playcurrent);
            _that.item = _that.playlist[1][_that.playcurrent];
            _that.songid = _that.playlist[1][_that.playcurrent].id;
          }
          _that.playmusic();
        } else {
          if (_that.playlist[1].tracks) {
            let length = _that.playlist[1].tracks.length - 1;
            _that.playcurrent =
              _that.playcurrent >= _that.playlist[1].tracks.length - 1
                ? 0
                : _that.randomNumber(0, length);
            _that.$emit("backindex", _that.playcurrent);
            _that.item = _that.playlist[1].tracks[_that.playcurrent];
            _that.songid = _that.playlist[1].tracks[_that.playcurrent].id;
          } else {
            let length = _that.playlist[1].length - 1;
            _that.playcurrent =
              _that.playcurrent >= _that.playlist[1].length - 1
                ? 0
                : _that.randomNumber(0, length);
            _that.$emit("backindex", _that.playcurrent);
            _that.item = _that.playlist[1][_that.playcurrent];
            _that.songid = _that.playlist[1][_that.playcurrent].id;
          }
          _that.$refs.audio.onloadedmetadata = function() {};
          _that.$refs.audio.oncanplay = function() {
            _that.playmusic();
          };
        }
      };
    },
    //音乐播放函数
    playpusedmusic() {
      // window.console.log(this.$refs.audio.paused);
      let _that = this;
      if (this.$refs.audio.paused) {
        this.isactive = false;
        this.$refs.audio.onloadedmetadata = function() {};
        this.$refs.audio.oncanplay = function() {
          this.play();
          _that.$emit("isnowPlaydetector", true);
          _that.playBtncut = false;
        };
      } else {
        this.isactive = true;
        this.$refs.audio.pause();
        this.$emit("isnowPlaydetector", false);
        this.playBtncut = true;
      }
      this.OntimeUpdate();
      this.getlyric(this.songid);
    },
    playmusic() {
      this.isactive = false;
      // this.testMusicIsplay();
      this.$refs.audio.play();
      this.$emit("isnowPlaydetector", true);
      this.playBtncut = false;
      this.OntimeUpdate();
      this.onendedModer();
      this.getlyric(this.songid);
    },
    pausedmusic() {
      this.isactive = true;
      this.$refs.audio.pause();
      this.$emit("isnowPlaydetector", false);
      this.playBtncut = true;
      this.OntimeUpdate();
      this.onendedModer();
      this.getlyric(this.songid);
    },
    translateSongId() {
      this.$router.push({ path: "playmusicsollbigshow" });
      this.$emit("smallPlays", false);
    }
  },
  watch: {
    playlist() {
      this.playlist.forEach(element => {
        this.getsongDetail(element.id);
      });
    },
    //进度改变时更新播放时间
    whenPlaytime() {
      this.$refs.audio.currentTime =
        (this.whenPlaytime / 100) * this.$refs.audio.duration;
    },
    smallPlay() {},
    isnowPlay() {
      if (this.WhenMusiClickId && this.isnowPlay) {
        this.id = this.WhenMusiClickId.id;
        this.playmusic();
      } else {
        this.pausedmusic();
      }
    },
    WhenMusiClickId: function(newValue) {
      this.songid = this.WhenMusiClickId.id;
      this.item = this.WhenMusiClickId;
      let _that = this;
      if (this.WhenMusiClickId != null && this.isnowPlay) {
        // this.playpusedmusic();
        setTimeout(() => {
          this.$refs.audio.onloadedmetadata = function() {};
          console.log(this.$refs.audio.paused);
          this.$refs.audio.oncanplay = function() {
            _that.playmusic();
          };
        }, 100);
      } else {
        this.pausedmusic();
      }
    },
    playlist() {
      this.playcurrent = this.playlist[0];
    },
    //上一曲
    isPrevSong() {
      if (this.isPrevSong) {
        if (this.playlist[1].tracks) {
          this.playcurrent =
            this.playcurrent <= 0
              ? this.playlist[1].tracks.length - 1
              : --this.playcurrent;
          this.songid = this.playlist[1].tracks[this.playcurrent].id;
          this.item = this.playlist[1].tracks[this.playcurrent];
          this.$emit("backindex", this.playcurrent);
        } else {
          this.playcurrent =
            this.playcurrent <= 0
              ? this.playlist[1].length - 1
              : --this.playcurrent;
          this.songid = this.playlist[1][this.playcurrent].id;
          this.item = this.playlist[1][this.playcurrent];
          this.$emit("backindex", this.playcurrent);
        }
      }
    },
    //下一曲
    isNextSong() {
      if (this.isNextSong) {
        if (this.playlist[1].tracks) {
          this.playcurrent =
            this.playcurrent >= this.playlist[1].tracks.length - 1
              ? 0
              : ++this.playcurrent;
          this.songid = this.playlist[1].tracks[this.playcurrent].id;
          this.$emit("backindex", this.playcurrent);
          this.item = this.playlist[1].tracks[this.playcurrent];
        } else {
          this.playcurrent =
            this.playcurrent >= this.playlist[1].length - 1
              ? 0
              : ++this.playcurrent;
          this.songid = this.playlist[1][this.playcurrent].id;
          this.$emit("backindex", this.playcurrent);
          this.item = this.playlist[1][this.playcurrent];
        }
      }
    }
  },
  computed: {
    currentSongUrl() {
      return (
        "https://music.163.com/song/media/outer/url?id=" + this.songid + ".mp3"
      );
    }
  },
  created() {}
};
</script>

<style lang="less">
.palynav {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  background: white;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 1);
  display: flex;
  align-items: center;
  #music {
    position: absolute;
  }
  b {
    display: inline-block;
    flex: 1;
    height: 100%;
    span {
      display: inline-block;
      &:nth-of-type(1) {
        width: 45px;
        height: 45px;
        background-size: 100%;
        border-radius: 50%;
        margin-left: 10px;
        margin-right: 10px;
        box-shadow: 0 0px 5px 0 rgba(0, 0, 0, 1);
        img {
          display: inline-block;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          animation: myrolling 5s linear infinite;
        }
        .active {
          animation-play-state: paused;
        }
      }
      &:nth-of-type(2) {
        width: 160px;
        height: 50px;
        font-size: 18px;
        overflow: hidden;
        padding: 0px 10px;
        line-height: 50px;
        letter-spacing: 2px;
        font-weight: 300;
        white-space: nowrap;
      }
    }
  }
  span.play {
    display: inline-block;
    width: 9%;
    height: 80%;
    border-radius: 50%;
    margin-left: 10px;
    i {
      width: 100%;
      height: 100%;
      font-size: 35px;
      color: #31c27c;
      line-height: 40px;
      display: inline-block;
    }
  }
  span.menu {
    display: inline-block;
    width: 9%;
    height: 80%;
    border-radius: 50%;
    margin-left: 10px;
    margin-right: 10px;
    i {
      width: 100%;
      height: 100%;
      font-size: 30px;
      color: #31c27c;
      line-height: 40px;
      transform: rotateZ(180deg) rotateY(180deg);
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
</style>
