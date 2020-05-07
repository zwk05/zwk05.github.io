<template>
	<div id="app">
		<div id="nav"></div>
		<keep-alive>
			<router-view
				@translateWhenSongId="translateWhenSongId($event)"
				:WhenMusiClickId="WhenMusiClickId"
				:isnowPlay="isnowPlay"
				@isnowPlayMusic="isnowPlayMusic($event)"
				@smallPlays="smallPlays($event)"
				:SongPlayTimeArr='SongPlayTimeArr'
				@PrevSongTure='PrevSongTure'
				@NextSongTure='NextSongTure'
				@translatePlaylist='translatePlaylist($event)'
				:currentIndex='currentIndex'
				:playlist='playlist'
				@translateWhenPlayTime='translateWhenPlayTime($event)'
				@tranlateplaymoder='tranlateplaymoder($event)'
				:lyrictext='lyrictext'
			/>
		</keep-alive>
		<keep-alive>
		<FloatPalyNav
			:WhenMusiClickId="WhenMusiClickId"
			:smallPlay="smallPlay"
			:bigPlay="bigPlay"
			@isnowPlaydetector="isnowPlaydetector($event)"
			:isnowPlay="isnowPlay"
			@smallPlays="smallPlays($event)"
			@BackPlayTime='BackPlayTime($event)'
			:isPrevSong='isPrevSong'
			:isNextSong='isNextSong'
			:playlist='playlist'
			@backindex='backindex'
			:whenPlaytime='whenPlaytime'
			:playmoder='playmoder'
			@transinger='transinger'
		></FloatPalyNav>
		</keep-alive>
	</div>
</template>
<script>
import FloatPalyNav from "@/views/FloatPalyNav.vue";
export default {
	components: {
		FloatPalyNav
	},
	data() {
		return {
			WhenMusiClickId: null,
			playlist:null,
			smallPlay: true,
			bigPlay: false,
			//现在是否播放音乐
			isnowPlay: false,
			SongPlayTimeArr:[],
			isPrevSong:false,
			isNextSong:false,
			currentIndex:null,
			//播放
			whenPlaytime:null,
			playmoder:null,
			lyrictext:null
		};
	},
	methods: {
		transinger(n){
			this.lyrictext=n
		},
		BackPlayTime(Timearr){
			this.SongPlayTimeArr=Timearr
		},
		translateWhenSongId(id) {
			this.WhenMusiClickId = id;
			this.isnowPlay = true;
		},
		isnowPlaydetector(n) {
			this.isnowPlay = n;
		},
		isnowPlayMusic(n) {
			this.isnowPlay = n;
		},
		smallPlays(n) {
			this.smallPlay = n;
		},
		PrevSongTure(n){
			this.isPrevSong=n
		},
		NextSongTure(n){
			this.isNextSong=n
		},
		translatePlaylist(playlist){
			this.playlist=playlist
			this.currentIndex=playlist[0]
		},
		backindex(n){
			this.currentIndex=n
		},
		translateWhenPlayTime(n){
			this.whenPlaytime=n
		},
		tranlateplaymoder(n){
			this.playmoder=n
		}
	}
};
</script>
<style>
a {
	text-decoration: none;
	color: #2c3e50;
}
</style>
