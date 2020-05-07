<template>
  <div class="hot" @touchstart="touchstarts" @touchend="touchends">
    <div class="header">
      <div class="content">
        <div class="bg"></div>
        <h5>更新时间{{ uptatetime }}</h5>
      </div>
    </div>
    <ul v-if="isShow">
      <SongListItem
        v-for="(item, index) in playlist"
        :key="index"
        :item="item"
        :index="index"
        :playlist="playlist"
        :showindex="true"
        :is-show-quality="true"
        :you-can-jump="true"
        @translateWhenSongId="translateWhenSongId($event)"
        @translatePlaylist="translatePlaylist($event)"
      ></SongListItem>
    </ul>
  </div>
</template>

<script>
import SongListItem from "@/components/SongListItem.vue";
export default {
  components: {
    SongListItem
  },
  data() {
    return {
      playlist: null,
      playlists: null,
      isShow: false,
      uptatetime: null,
      startPagx: null,
      isreaderdataplaylist: false,
      issucces: 0,
      isget: false
    };
  },

  methods: {
    touchstarts(event) {
      this.startPagx = event.touches[0].pageX;
    },
    touchends(event) {
      let x = event.changedTouches[0].pageX;
      window.console.log(x);
      if (x - this.startPagx >= 100) {
        this.$router.push({ path: "/recommend" });
      }
      if (x - this.startPagx <= -100) {
        this.$router.push({ path: "/search" });
      }
    },
    getsongDetail: function(q) {
      let _this = this;
      fetch("https://music.kele8.cn/song/detail?ids=" + q)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          _this.issucces++;
          _this.playlist.push(json.songs[0]);
        });
    },
    translatePlaylist(n) {
      this.$emit("translatePlaylist", n);
    },
    translateWhenSongId(id) {
      this.$emit("translateWhenSongId", id);
    },
    getHotItemSong() {
      let playlists = JSON.parse(window.localStorage.getItem("playlists"));
      //
      if (playlists && Date.now() < playlists.time && playlists.idx == 1) {
        this.isShow = true;
        this.isget = true;
        // window.console.log("拿本地的playlists");
        // 从本地拿数据 本地有数据 且时间还没过10分钟
        this.playlists = playlists.data;
      } else {
        this.axios
          .get("https://music.kele8.cn/top/list?idx=1")
          .then(reponse => {
            ({ playlist: this.playlists } = reponse.data);
            this.isget = true;
            window.localStorage.setItem(
              "playlists",
              JSON.stringify({
                time: Date.now() + 60 * 60 * 1000,
                idx: 1,
                data: this.playlists
              })
            );
            this.isShow = true;
          });
      }
    },
    getuptateTime() {
      let _that = this;
      this.uptatetime = new Date(_that.playlist.trackNumberUpdateTime);
    },
    ShabaiGet() {
      // window.console.log("路由进入ShabaiGet");
      this.playlist = [];
      let playlist = JSON.parse(window.localStorage.getItem("playlist"));
      // window.console.log("路由进入ShabaiGet", playlist);
      if (!playlist) {
        this.issucces = 0
        if (this.issucces == 0) {
          // window.console.log("路由进入ShabaiGet2");
          this.getsongDetail(this.playlists.tracks[this.issucces].id);
        }
      }
      // if (playlist && Date.now() < playlist.time) {
      //    window.console.log("路由进入ShabaiGet1");
      //   // 从本地拿数据 本地有数据 且时间还没过10分钟
      //   this.playlist = playlist.data;
      // } else {
      //   if (playlist == null || undefined || Date.now() > playlist.time) {
      //     if (this.issucces == 0) {
      //        window.console.log("路由进入ShabaiGet2");
      //       this.getsongDetail(this.playlists.tracks[this.issucces].id);
      //     }
      //   }
      // }
    }
  },
  beforeRouteEnter(to, from, next) {
    // 路由进入 当前组件实例化之前就 拿数据
    // beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建
    next(vm => {
      vm.getHotItemSong();
      // window.console.log("路由进入", vm.playlist);
      if (!vm.playlist || vm.playlist.length <= 200) {
        if (vm.isget) {
          // window.console.log("路由进入1");
          vm.ShabaiGet();
        }
      }
    });
  },
  watch: {
    playlist() {
      if (this.playlist) {
        this.getuptateTime();
      }
      if (this.playlist.length == 200) {
        window.localStorage.setItem(
          "playlist",
          JSON.stringify({
            time: Date.now() + 60 * 60 * 60 * 1000,
            data: this.playlist
          })
        );
      }
    },
    playlists() {
      this.playlist = [];
      let playlist = JSON.parse(window.localStorage.getItem("playlist"));
      if (playlist && Date.now() < playlist.time) {
        // 从本地拿数据 本地有数据 且时间还没过10分钟
        this.playlist = playlist.data;
      } else {
        if (playlist == null || undefined || Date.now() > playlist.time) {
          if (this.issucces == 0) {
            this.getsongDetail(this.playlists.tracks[this.issucces].id);
          }
        }
      }
    },
    issucces() {
      if (this.issucces <= 199) {
        // window.console.log("issucces执行");
        this.getsongDetail(this.playlists.tracks[this.issucces].id);
      }
    }
  },
  created() {
    window.console.log("创建");
  }
};
</script>

<style lang="less">
.hot {
  .header {
    width: 100%;
    height: 25vh;
    background-image: url(https://s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg?f01a252389c26bcf016816242eaa6aee);
    position: relative;
    padding-top: 38.9%;
    overflow: hidden;
    background-size: contain;
    .content {
      display: -ms-flexbox;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -webkit-flex-direction: column;
      -ms-flex-direction: column;
      flex-direction: column;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      -ms-flex-pack: center;
      justify-content: center;
      position: absolute;
      left: 0;
      /* right: 0; */
      top: 0;
      bottom: 0;
      z-index: 2;
      padding-left: 20px;
      box-sizing: border-box;
      .bg {
        width: 142px;
        height: 67px;
        background-position: -24px -30px;
        background-image: url(https://s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880);
        background-repeat: no-repeat;
        background-size: 166px 97px;
      }
      h5 {
        margin-top: 10px;
        color: hsla(0, 0%, 100%, 0.8);
        font-size: 12px;
        -webkit-transform: scale(0.91);
        -ms-transform: scale(0.91);
        transform: scale(0.91);
        -webkit-transform-origin: left top;
        -ms-transform-origin: left top;
        transform-origin: left top;
      }
    }
  }
}
</style>
