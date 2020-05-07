<template>
  <li class="song" @click="translateSongId(index)">
    <div class="songname">
      <div class="index" :class="{active: index<3 ? true: ''}" v-if="!item.song && showindex">{{ indexback }}</div>
      <div class="list" v-if="item.song">
        <p class="name">{{ item.name }}</p>
        <i class="logo" v-if="isShowQuality"></i>
        <span class="said"
          >{{ item.song.artists[0].name }}-{{ item.song.album.name }}</span
        >
      </div>
      <div class="list" v-else>
        <p class="name">{{ item.name }}</p>
        <i class="logo" v-if="item.h && isShowQuality"></i>
        <span class="said"> {{ item.ar[0].name }}-{{ item.al.name }}</span>
      </div>
    </div>
    <div class="right">
      <i class="play"></i>
    </div>
  </li>
</template>

<script>
export default {
  name: "SongListItem",
  props: [
    "item",
    "playlist",
    "isShowQuality",
    "index",
    "YouCanJump",
    "showindex"
  ],
  methods: {
    translateSongId(i) {
      this.$emit("translateWhenSongId", this.item);
      this.$emit("translatePlaylist", [i, this.playlist]);
    }
  },
  computed: {
    indexback() {
      if (this.index < 9) {
        return "0" + (this.index + 1);
      } else {
        return this.index + 1;
      }
    }
  }
};
</script>

<style lang="less">
li.song {
  display: flex;
  border-bottom: 1px solid #e9e2e2;
  .songname {
    overflow: hidden;
    padding: 5px 10px;
    flex: 1;
    display: flex;
    .index {
      float: left;
      line-height: 62px;
      padding: 0px 15px 0 0px;
      font-size: 18px;
    }
    .active {
      float: left;
      line-height: 62px;
      padding: 0px 15px 0 0px;
      font-size: 18px;
      color: red;
    }
    .list {
      float: left;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      min-height: 30px;
      white-space: nowrap;
      .name {
        padding: 0;
        margin: 0;
        line-height: 30px;
        font-size: 17px;
      }
      .said {
        line-height: 20px;
        font-size: 12px;
        color: #888;
      }
      .logo {
        display: inline-block;
        width: 12px;
        height: 8px;
        background-image: url("../assets/index_icon_2x.png");
        background-size: 166px 97px;
      }
    }
  }
  .right {
    width: 62px;
    height: 62px;
    line-height: 72px;
    text-align: center;
    font-size: 18px;
    color: #999999;
    i {
      display: inline-block;
      width: 22px;
      height: 22px;
      background-image: url("../assets/index_icon_2x.png");
      background-position: 0 0;
      background-size: 166px 97px;
      background-position: -24px 0;
    }
  }
}
</style>
