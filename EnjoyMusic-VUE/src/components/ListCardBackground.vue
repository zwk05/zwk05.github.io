<template>
	<div v-if="playlist && CardItem" class="content">
		<div class="go-back" @click="$router.go(-1)">
			<i class="fa fa-angle-left"></i>
		</div>

		<div class="header">
			<div
				class="bg"
				:style="{ 'background-image': 'url(' + playlist.coverImgUrl + ')' }"
			></div>
			<div class="zz"></div>
			<div class="icon">
				<div class="img">
					<img :src="playlist.coverImgUrl" alt="" />

					<span
						><i></i
						>{{ translatePlayCount(playlist.playCount) }}</span
					>
				</div>
				<div class="plhead">
					<h2>{{ playlist.name }}</h2>
					<div class="logo">
						<span></span>
						<a href="">唯我音乐</a>
					</div>
				</div>
			</div>
		</div>
		<div class="siade" style="padding:10px">
			<div class="list">
				<span style="margin-right: 10px;">标签:</span>
				<span
					style="display: inline-block;
					margin-right: 10px;
					padding: 1px 8px;
					font-size: 12px;
					border-radius: 30%;
					color: #666;
   					 background: rgba(0, 0, 0,0.05);
					"
					v-for="(item, index) in playlist.tags"
					:key="index"
					>{{ item }}</span
				>
			</div>
		</div>
		<div class="intro">
			<span :class="{ active: isPackuo }"
				>简介:{{ playlist.description }}</span
			>
			<i @click="isPackuo = !isPackuo">收起</i>
		</div>
		<h3>
			歌曲列表
		</h3>
	</div>
</template>

<script>
export default {
	name: "ListCardBackground",
	props: ["CardItem", "playlist"],
	data() {
		return {
			isPackuo: true
		};
	},
	methods: {
		translatePlayCount(n) {
			if (n > 99999999) {
				return (n / 100000000).toFixed(2) + "亿";
			}
			if (n > 9999) {
				return (n / 10000).toFixed(1) + "万";
			}
		}
	}
};
</script>

<style lang="less" scoped>
.content {
	.go-back {
		position: fixed;
		color: white;
		z-index: 2;
	}
	.header {
		display: flex;
		text-align: center;
		background-size: 100%;
		position: relative;
		overflow: hidden;
		.bg {
			width: 100%;
			position: absolute;
			height: 100%;
			filter: blur(10px);
			background-position: 50%;
			background-size: cover;
		}
		.zz {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
		}
		.icon {
			width: 100%;
			height: 100%;
			display: flex;
			padding: 20px 10px;
			.img {
				flex: 1;
				padding: 0px 10px;
				position: relative;

				span {
					i {
						display: inline-block;
						padding-left: 15px;
						width: 10px;
						height: 10px;
						background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMiAyMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjIgMTYuNzc3YzAgMS4yMzMtMS4xMjEgMi4yMzMtMi41MDYgMi4yMzMtMS4zODQgMC0yLjUwNi0xLTIuNTA2LTIuMjMzdi0yLjU1M2MwLTEuMjM0IDEuMTIyLTIuMjMzIDIuNTA2LTIuMjMzLjE3NCAwIC4zNDMuMDE3LjUwNi4wNDZ2LTEuMzdoLS4wMzNjLjAxNy0uMjIuMDMzLS40NDEuMDMzLS42NjZhOCA4IDAgMCAwLTE2IDBjMCAuMjI1LjAxNi40NDYuMDM0LjY2Nkg0djEuMzdjLjE2My0uMDI5LjMzMy0uMDQ2LjUwNS0uMDQ2IDEuMzg0IDAgMi41MDYuOTk5IDIuNTA2IDIuMjMzdjIuNTUzYzAgMS4yMzMtMS4xMjIgMi4yMzMtMi41MDYgMi4yMzNTMiAxOC4wMTEgMiAxNi43Nzd2LTIuNTUzYzAtLjI1OC4wNTktLjUwMS4xNDgtLjczQS45ODIuOTgyIDAgMCAxIDIgMTMuMDAxdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMHMxMCA0LjQ3NyAxMCAxMGMwIC4wOS0uMDA5LjE3OC0uMDE0LjI2Ni4wMDIuMDI0LjAxNC4wNDQuMDE0LjA2N3YyYS45ODguOTg4IDAgMCAxLS4zNi43NTNjLjIyNC4zMzQuMzYuNzIuMzYgMS4xMzh2Mi41NTIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2ZmZiIgZD0iTTIwIDE2Ljc3N2MwIDEuMjMzLTEuMTIxIDIuMjMzLTIuNTA2IDIuMjMzLTEuMzg0IDAtMi41MDYtMS0yLjUwNi0yLjIzM3YtMi41NTNjMC0xLjIzNCAxLjEyMi0yLjIzMyAyLjUwNi0yLjIzMy4xNzQgMCAuMzQzLjAxNy41MDYuMDQ2di0xLjM3aC0uMDMzYy4wMTctLjIyLjAzMy0uNDQxLjAzMy0uNjY2YTggOCAwIDAgMC0xNiAwYzAgLjIyNS4wMTYuNDQ2LjAzNC42NjZIMnYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzUzAgMTguMDExIDAgMTYuNzc3di0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43M0EuOTgyLjk4MiAwIDAgMSAwIDEzLjAwMXYtMi42NjdjMC0uMDIzLjAxMi0uMDQzLjAxMy0uMDY3LS4wMDQtLjA4OC0uMDEzLS4xNzYtLjAxMy0uMjY2IDAtNS41MjMgNC40NzctMTAgMTAtMTBzMTAgNC40NzcgMTAgMTBjMCAuMDktLjAwOS4xNzgtLjAxNC4yNjYuMDAyLjAyNC4wMTQuMDQ0LjAxNC4wNjd2MmEuOTg4Ljk4OCAwIDAgMS0uMzYuNzUzYy4yMjQuMzM0LjM2LjcyLjM2IDEuMTM4djIuNTUyIi8+PC9zdmc+");
						background-repeat: no-repeat;
					}
					position: absolute;
					top: 5px;
					right: 15px;
					color: white;
					font-size: 10px;
				}
				img {
					border-radius: 3px;
				}
			}
			.plhead {
				position: relative;
				z-index: 1;
				width: 60%;
				color: white;
				padding: 0 10px 0 0;
				h2 {
					white-space: nowrap;
					padding-top: 10px;
					font-size: 17px;
					overflow: hidden;
				}
				.logo {
					text-align: left;
					padding: 20px 0;
					span {
						transform: translateY(10px);
						display: inline-block;
						width: 30px;
						height: 30px;
						background-image: url("../assets/u=2652223717,988011204&fm=26&gp=0.jpg");
						background-size: 100%;
						border-radius: 50%;
					}
					a {
						color: rgba(236, 229, 229, 0.8);
						padding: 0px 15px;
					}
				}
			}
		}
	}
	.intro {
		padding: 0px 15px;
		margin-top: 15px;
		position: relative;
		span {
			white-space: pre-line;
			line-height: 26px;
			font-size: 14px;
		}
		.active {
			display: -webkit-box;
			-webkit-line-clamp: 3;
			-webkit-box-orient: vertical;
			overflow: hidden;
			margin: 0 5px 10px 5px;
			padding: 6px 2px 0 6px;
			min-height: 40px;
			line-height: 1.5;
			line-height: 26px;
			font-size: 14px;
		}
		i {
			position: absolute;
			right: 10px;
			bottom: 0;
			font-size: 8px;
		}
	}
	h3 {
		height: 23px;
		line-height: 23px;
		padding: 0 10px;
		font-size: 12px;
		color: #666;
		background-color: #eeeff0;
	}
}
</style>
