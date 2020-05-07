import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "home",
		component: Home,
		redirect: "/recommend",
		children: [
			{
				path: "/recommend",
				name: "recommend",
				component: () => import("@/views/HomeRecommend.vue")
			},
			{
				path: "/hot",
				name: "hot",
				component: () => import("@/views/HomeHot.vue")
			},
			{
				path: "/search",
				name: "search",
				component: () => import("@/views/HomeSearch.vue")
			}
		]
	},
	{
		path: "/playList",
		name: "playList",
		component: () => import("@/components/PlayList.vue")
	},
	{
		path: "/playmusicsollbigshow",
		name: "playmusicsollbigshow",
		component: () => import("@/components/PlayMusicBollBigShow.vue")
	},
];

const router = new VueRouter({
	routes
});

export default router;
