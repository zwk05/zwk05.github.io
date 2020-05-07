<template>
  <div class="home">
    <h2>悦享新音乐</h2>
    <keep-alive>
      <ul class="nav">
        <li>
          <router-link to="/recommend">推荐音乐</router-link>
        </li>
        <li>
          <router-link to="/hot">热歌榜</router-link>
        </li>
        <li>
          <router-link to="/search">搜索</router-link>
        </li>
      </ul>
    </keep-alive>
    <keep-alive>
      <router-view
        @translateWhenSongId="translateWhenSongId($event)"
        @translatePlaylist="translatePlaylist($event)"
      />
    </keep-alive>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "home",
  data() {
    return {};
  },
  methods: {
    translateWhenSongId(id) {
      this.$emit("translateWhenSongId", id);
    },
    translatePlaylist(playlist) {
      this.$emit("translatePlaylist", playlist);
    },
  },
};
</script>
<style lang="less">
.home {
  h2 {
    text-align: center;
    font-size: 30px;
    font-family: "Pacifico", cursive;
    font-weight: bold;
    background: rgb(241, 68, 68);
    padding: 20px 0;
    color: white;
  }
  ul.nav {
    display: flex;
    border-bottom: 1px solid #e6e6e6;
    li {
      flex: 1;
      text-align: center;
      height: 41px;
      a {
        line-height: 40px;
        display: inline-block;
        &:active {
          background: none;
        }
        &.router-link-exact-active {
          color: red;
          border-bottom: 2px solid red;
        }
      }
    }
  }
}
</style>
