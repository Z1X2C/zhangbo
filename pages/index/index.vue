<template>
		<view class="home">
			<!-- 
				<uni-nav-bar left-icon="back" left-text="返回" right-text="菜单" title="导航栏组件"></uni-nav-bar> -->
			<swiper indicator-dots circular autoplay="true">
				<swiper-item v-for="item in cartimage" :key="item.id">
					<image :src="item.src"></image>
				</swiper-item>
			</swiper>
			<!--分类导航 -->
		<view class="cate-section">
			<view class="cate-item" v-for='(item,index) in navs' :key="index" @click="navItemClick(item.path)">
				<image :src="item.src"></image>
				<text>{{item.title}}</text>
			</view>
		</view>
		<!-- 推荐商品 -->
		<view class="hot_goods">
			<view class="tit"> 最近热销</view>
			<goods-list @goodsItemClick="goGoodDetail" :hotgoods="hotgoods"></goods-list>
		</view>
		<!-- 商品 -->
	</view>
</template>

<script>	
import goodsList from '../../components/goods-list/goods-list.vue'
// import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue"
export default  {
	data(){
		return{
			cartimage:[],
			hotgoods:[],
			navs:[
				{
				icon:'xinxianshucai',
				title:'新鲜蔬菜',
				src:'/static/fruit/3.png',
				path:"../../pages/vegetables/vegetables",
				},
				{
				icon:'xinxianshuiguo',
				title:'新鲜水果',
				src:'/static/fruit/1.png',
				path:"../../pages/fruit/fruit",
				},
				{
				icon:'meat',
				title:'肉禽蛋水产',
				src:'/static/fruit/2.png',
				path:"../../pages/meat/meat",
				},
				{
				icon:'jiushui',
				title:'乳品酒水',
				src:'/static/fruit/4.png',
				path:"../../pages/beverages/beverages",
				},
			]
		}
	},
	onLoad(){
		this.getSwipers()
		this.getHotGoods()
},
components :{"goods-list":goodsList},
methods:{
	//获取轮播图数据
	async getSwipers () {
		const res =await this.$myRequest({
			url :'/product/Swipers'
		})
		this.cartimage = res.data
	},
	//获取热门商品列表
	async getHotGoods(){
		const res =await  this.$myRequest({
			  url:'/product/Meat'
		  })
		  this.hotgoods = res.data
	 },
	 navItemClick (url){
		uni.navigateTo({
			url
		})
	 },
	 //跳转到商品详情页
	 goGoodDetail (id){
		 uni.navigateTo({
			 url:'../../pages/goods-detail/goods-detail?id='+id
		 })
	 }
  },
   // components: {uniNavBar}
}
</script>

<style lang="scss">
.home{
	background: #eee;
	swiper{
		width: 100%;
		height: 450rpx;
		image{
			width: 95%;
			height: 95%;
            margin:  20rpx ;
			border-radius: 5%;
		}
	}
	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30upx 22upx; 
		background: #fff;
		margin-top: 20rpx;
		.cate-item {
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
	.hot_goods{
		background: #eee;
		.tit{
		height: 50px;
		line-height: 50px;
		color: #b50e03;
		text-align: center; 
		letter-spacing: 20px;
		background: #fff;
		margin: 7rpx 0;
		 }
		}
		.goods_list{
			padding: 0 15rpx;
          display: flex;
		  flex-wrap: wrap;
		  justify-content: space-between;
		  .goods_item{
			background:#fff;
			width: 355rpx;
			margin: 15px 0;
			border-radius: 5%;
			padding: 15rpx;
			box-sizing: border-box;
			 image {
			 	width: 100%;
			 	height: 340rpx;
				margin: 0 auto;
			 }
			 .price{
				color: #b50e03;
				font-size: 36rpx;
				text:nth-child(2){
					color: #C0C0C0;
					font-size: 28rpx;
					margin-left: 17rpx;
					text-decoration: line-through;
				}
			 }
			 .name{
				 font-size: 38rpx;
				 line-height: 50rpx;
				 padding-bottom: 15rpx;
				 padding-top: 10rpx;
			 }
			}
		  }
}
</style>
