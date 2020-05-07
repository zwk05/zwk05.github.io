<template>
  <div @touchstart="touchstarts" @touchend="touchends">
    <RecommendedTite>推荐歌单</RecommendedTite>
    <ul class="list">
      <HomeRecommendCard
        v-for="(item, index) in personalized"
        :key="index"
        :item="item"
      ></HomeRecommendCard>
    </ul>
    <RecommendedTite>最新音乐</RecommendedTite>
    <ul>
      <SongListItem
        v-for="(item, index) in playlist"
        :key="index"
        :item="item"
        :index="index"
        :showindex="false"
        :is-show-quality="true"
        :playlist="playlist"
        @translateWhenSongId="translateWhenSongId($event)"
        @translatePlaylist="translatePlaylist($event)"
      />
    </ul>
  </div>
</template>

<script>
import RecommendedTite from "@/components/RecommendedTite.vue";
import HomeRecommendCard from "@/components/HomeRecommendCard.vue";
import SongListItem from "@/components/SongListItem.vue";
export default {
  data() {
    return {
      //保存一下推荐的歌单的内容
      personalized: [],
      //保存最新音乐的数据
      personanewsong: [],
      playlist: [],
      startPagx:null
    };
  },
  components: {
    RecommendedTite,
    HomeRecommendCard,
    SongListItem
  },
  watch: {
    personanewsong() {
      this.playlist = [];
      this.personanewsong.forEach(element => {
        this.getsongDetail(element.id);
      });
    }
  },
  methods: {
    touchstarts(event) {
      this.startPagx = event.touches[0].pageX;
    },
    touchends(event) {
      let x = event.changedTouches[0].pageX;
      if (x - this.startPagx <= -100) {
        this.$router.push({ path: "/hot" });
      }
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
    translatePlaylist(n) {
      this.$emit("translatePlaylist", n);
    },
    //返回ID
    translateWhenSongId(id) {
      this.$emit("translateWhenSongId", id);
    },
    getRecommedSongList() {
      let personalized = JSON.parse(
        window.localStorage.getItem("personalized")
      );
      //
      if (personalized && Date.now() < personalized.time) {
        // 从本地拿数据 本地有数据 且时间还没过10分钟
        this.personalized = personalized.data;
      } else {
        // 从服务器拿数据
        this.axios
          .get("https://music.kele8.cn/personalized?limit=6")
          .then(response => {
            ({ result: this.personalized } = response.data);
            window.console.log('personalizedlimit数据读取成功');
            // 存储到本地存储 附加信息 过期时间  拿数据之后十分钟之内
            window.localStorage.setItem(
              "personalized",
              JSON.stringify({
                time: Date.now() + 24 * 60 * 60 * 1000,
                data: this.personalized
              })
            );
          });
      }
    },
    getRecommedNewSongList() {
      let personanewsong = JSON.parse(
        window.localStorage.getItem("personanewsong")
      );

      if (personanewsong && Date.now() < personanewsong.time) {
        // 从本地拿数据 本地有数据 且时间还没过10分钟
        this.personanewsong = personanewsong.data;
      } else {
        this.axios
          .get("https://music.kele8.cn/personalized/newsong")
          .then(response => {
             window.console.log('personalizednewsong数据读取成功');
            ({ result: this.personanewsong } = response.data);
            window.localStorage.setItem(
              "personanewsong",
              JSON.stringify({
                time: Date.now() + 24 * 60 * 60 * 1000,
                data: this.personanewsong
              })
            );
          });
      }
    }
  },
  created() {
    this.getRecommedSongList();
    this.getRecommedNewSongList();
  }
};
</script>

<style lang="less">
ul.list {
  display: flex;
  flex-wrap: wrap;
  li.card {
    flex: 1 0 30%;
    &:nth-child(3n + 2) {
      margin: 0 5px;
    }
  }
}
</style>
