<template>
  <div class="palylist" @touchstart="touchstarts" @touchend="touchends">
    <!-- <keep-alive> -->
    <ListCardBackground :CardItem="CardItem" :playlist="playlists" />
    <ul class="songlist">
      <template v-if="playlists">
        <SongListItem
          v-for="(item, index) in playlists.tracks"
          :key="index"
          :index="index"
          :item="item"
          :showindex="true"
          :playlist="playlists.tracks"
          :is-show-quality="true"
          @translateWhenSongId="translateWhenSongId($event)"
          @translatePlaylist="translatePlaylist($event)"
        ></SongListItem>
      </template>
    </ul>
    <!-- </keep-alive> -->
  </div>
</template>

<script>
import SongListItem from "@/components/SongListItem.vue";
import ListCardBackground from "@/components/ListCardBackground.vue";
export default {
  components: {
    SongListItem,
    ListCardBackground
  },
  data() {
    return {
      id: null,
      playlists: null,
      CardItem: null,
      startPagx: null
    };
  },
  methods: {
    touchstarts(event) {
      this.startPagx = event.touches[0].pageX;
    },
    touchends(event) {
      let x = event.changedTouches[0].pageX;
        if (x - this.startPagx >= 200) {
			this.$router.go(-1)
        }
    },
    translateWhenSongId(id) {
      this.$emit("translateWhenSongId", id);
    },
    translatePlaylist(n) {
      this.$emit("translatePlaylist", n);
    },
    getPlayListDetail(i) {
      this.CardItem = i;
      this.id = i.id;
      this.axios
        .get("https://music.kele8.cn/playlist/detail", {
          params: { id: this.id }
        })
        .then(reponse => {
          ({ playlist: this.playlists } = reponse.data);
          // 存储到本地存储 附加信息 过期时间  拿数据之后十分钟之内
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    // 路由进入 当前组件实例化之前就 拿数据
    // beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建
    window.localStorage.setItem(
      "Id",
      JSON.stringify({
        time: Date.now() + 24 * 60 * 60 * 1000,
        data: to.query.id
      })
    );
    next(vm => {
      vm.getPlayListDetail(to.query.id);
    });
  },
  created() {}
};
</script>

<style lang="less">
.go-back {
  font-size: 30px;
  // position: fixed;
}
</style>
