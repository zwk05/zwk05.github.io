<template>
  <div class="search" @touchstart="touchstarts" @touchend="touchends">
    <div class="searchdetail">
      <div class="input">
        <i class="fa fa-search" aria-hidden="true"></i>
        <input
          ref="input"
          @focus="xxx"
          type="text"
          placeholder="搜索歌曲、歌手、专辑"
          v-model.trim="suggests"
        />
      </div>
    </div>
    <div class="susgestname" v-show="suggests && shoutext">
      <div class="showsearchname">搜索"{{ suggests }}"</div>
      <ul class="lists">
        <li
          v-for="(item, index) in suggestsname"
          :key="index"
          @click="goselectlist(index)"
        >
          <i class="fa fa-search" aria-hidden="true"></i
          ><span>{{ item.keyword }}</span>
        </li>
      </ul>
      <img v-if="loading" src="../assets/sample.gif" alt />
    </div>
    <div class="searchsonglist">
      <ul v-if="listshow && playlists">
        <div class="message">
          <h3>最佳匹配</h3>
          <div class="picUrl" v-if="playlist[0]">
            <img :src="playlist[0].al.picUrl" alt="" />
            <span class="singer"
              ><span class="singers">歌手:</span
              >{{ playlist[0].ar[0].name }}</span
            >
            <i class="fa fa-angle-right" aria-hidden="true"></i>
          </div>
        </div>
        <SongListItem
          v-for="(item, index) in playlist"
          :key="index"
          :item="item"
          :is-show-quality="true"
          :index="index"
          :showindex="true"
          :playlist="playlist"
          @translateWhenSongId="translateWhenSongId($event)"
          @translatePlaylist="translatePlaylist($event)"
        />
      </ul>
    </div>
    <div class="hotsearch" v-if="showtuijian">
      <h3 class="title">热门搜索</h3>
      <ul class="list">
        <li
          v-for="(item, index) in hotSearchKeyWords"
          :key="index"
          @click="changinputtext(index)"
        >
          {{ item.first }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import SongListItem from "@/components/SongListItem.vue";
export default {
  data() {
    return {
      suggests: null,
      suggestsname: null,
      playlists: null,
      playlist: [],
      listshow: false,
      shoutext: true,
      loading: false,
      hotSearchKeyWords: null,
      showtuijian: true,
      startPagx: null
    };
  },
  components: {
    SongListItem
  },
  watch: {
    suggests() {
      if (this.suggests) {
        this.getSuggestsname(this.suggests);
        this.loading = true;
        this.showtuijian = false;
      } else {
        this.showtuijian = true;
      }
    },
    playlists() {
      this.playlist = [];
      this.playlists.forEach((element, i) => {
        this.getsongDetail(element.id);
      });
    },
    listshow() {
      if (this.listshow) {
        this.shoutext = false;
      }
    }
  },
  methods: {
    touchstarts(event) {
      this.startPagx = event.touches[0].pageX;
      // window.console.log(this.startPagx);
    },
    touchends(event) {
      let x = event.changedTouches[0].pageX;
      window.console.log(x);
      if (x - this.startPagx >= 100) {
        this.$router.push({ path: "/hot" });
      }
    },
    getHotSearch() {
      let hotSearchKeyWords = JSON.parse(
        window.localStorage.getItem("hotSearchKeyWords")
      );
      //
      if (hotSearchKeyWords && Date.now() < hotSearchKeyWords.time) {
        // 从本地拿数据 本地有数据 且时间还没过10分钟
        this.hotSearchKeyWords = hotSearchKeyWords.data;
      } else {
        this.axios.get("https://music.kele8.cn/search/hot").then(response => {
          ({ hots: this.hotSearchKeyWords } = response.data.result);
          window.localStorage.setItem(
            "hotSearchKeyWords",
            JSON.stringify({
              time: Date.now() + 24 * 60 * 60 * 1000,
              data: this.hotSearchKeyWords
            })
          );
        });
      }
    },
    translateWhenSongId(id) {
      this.$emit("translateWhenSongId", id);
    },
    translatePlaylist(playlist) {
      this.$emit("translatePlaylist", playlist);
    },

    xxx() {
      if (this.suggests) {
        this.listshow = false;
        this.shoutext = true;
        this.showtuijian = true;
      }
    },
    getSuggestsname: function(q) {
      this.loading = true;
      this.axios
        .get("https://music.kele8.cn/search/suggest", {
          params: {
            keywords: this.suggests,
            type: "mobile"
          }
        })
        .then(response => {
          ({ allMatch: this.suggestsname } = response.data.result);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    goselectlist(index) {
      this.listshow = true;
      let name = this.suggestsname[index].keyword;
      this.getSuggestContent(name);
    },
    getSuggestContent: function(n) {
      let _this = this;
      fetch("https://music.kele8.cn/search?keywords=" + n)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          _this.playlists = json.result.songs;
        });
    },
    getsongDetail: function(q) {
      let _this = this;
      fetch("https://music.kele8.cn/song/detail?ids=" + q)
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          _this.playlist.push(json.songs[0]);
        });
    },
    changinputtext(i) {
      let text = this.hotSearchKeyWords[i].first;
      this.suggests = text;
      this.getSuggestContent(this.suggests);
      this.listshow = true;
      this.showtuijian = false;
    }
  },
  created() {
    this.getHotSearch();
  }
};
</script>

<style lang="less">
.search {
  .searchdetail {
    padding: 15px 10px;
    .input {
      position: relative;
      i {
        position: absolute;
        top: 30.1%;
        left: 3%;
        font-size: 10px;
        font-weight: 100;
        color: #babbbb;
      }
      input {
        width: 100%;
        border-radius: 20px;
        width: 100%;
        height: 30px;
        line-height: 18px;
        background: transparent;
        font-size: 14px;
        color: #333;
        outline: none;
        border: none;
        background: #ebecec;
        padding: 0px 35px;
      }
    }
  }
  .susgestname {
    .showsearchname {
      border-top: 1px solid rgb(245, 243, 243);
      height: 50px;
      margin-left: 10px;
      padding-right: 10px;
      font-size: 15px;
      line-height: 50px;
      color: #507daf;
      white-space: nowrap;
      word-break: normal;
    }
    ul.lists {
      padding-left: 10px;
      overflow: hidden;
      li {
        border-top: 1px solid rgb(245, 243, 243);
        i {
          font-size: 15px;
          font-weight: 100;
          color: #e0dcdc;
          margin-right: 7px;
        }
        span {
          padding-right: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: normal;
          font-size: 15px;
          line-height: 45px;
          color: #333;
        }
      }
    }
  }
  .searchsonglist {
    h3 {
      margin-left: 10px;
      font-size: 12px;
      line-height: 16px;
      color: #666;
    }
    .picUrl {
      padding: 8px 10px 8px 0;
      box-sizing: border-box;
      display: flex;
      img {
        width: 13%;
        height: 46px;
        margin-left: 10px;
      }
      span {
        flex: 1;
        line-height: 7vh;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: normal;
        padding: 0px 5px;
      }
      i {
        margin-right: 18px;
        margin-left: 10px;
        line-height: 7vh;
      }
    }
  }
  .hotsearch {
    padding: 15px 10px 0;
    h3 {
      padding: 7px 0;
      font-size: 15px;
    }
    ul {
      li {
        display: inline-block;
        height: 32px;
        margin-right: 8px;
        margin-bottom: 8px;
        padding: 0 14px;
        font-size: 14px;
        line-height: 32px;
        color: #333;
        border: solid 1px rgb(223, 221, 221);
        border-radius: 15px;
        outline: none;
      }
    }
  }
}
</style>
