<template>
	<view class="home">
		<!-- 商品详情 -->
		<view class="hot_goods">
			<view class="tit">商品详情</view>
		</view>
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item">
					<view class="image-wrapper">
						<image :src="goodsinfo.src" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<view class="image-wrapper">
						<image :src="goodsinfo.src1" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<view class="image-wrapper">
						<image :src="goodsinfo.src2" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<view class="image-wrapper">
						<image :src="goodsinfo.src3" class="loaded" mode="aspectFill"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- 价格与名称 -->
		<view class="box1">
			<view class="name">
				<text>{{goodsinfo.name}}</text>
			</view>
			<view class="price">
				<!-- 现价格 -->
				<text>￥{{goodsinfo.price}}/{{goodsinfo.nuit}}</text>
				<!-- 原价格 -->
				<text>￥{{(goodsinfo.price)*1.20}}/{{goodsinfo.nuit}} </text>
			</view>
			<view class="inventory">
				<text>库存:{{goodsinfo.inventory}}</text>
				<text>已售:180</text>
				<text>可配送</text>
			</view>
		</view>
		<!-- 分割线 -->
		<view class="line"></view>
		<view class="box2">
			<view class="info">
				<text class="info_label">详情信息</text>
				<view class="line"></view>
				<rich-text :nodes="content"></rich-text>
			</view>
			<view class="line"></view>
			<view class="selectbuy">
				<text class="paly">待支付:</text>
				<text class="palymoney">￥{{goodsinfo.price*weight}} 元</text>
				<view class="sub" @click="sub" size="default">-</view>
				<text class="sum">{{weight}}</text>
				<view class="add" @click="add">+</view>
			</view>
		</view>
		<view class="goods_nav">
			<uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>
<script>
	import uniGoodsNav from '@/components/uni-goods-nav/uni-goods-nav.vue'
	export default {
		data() {
			return {
				//用户信息
				userid: '',
				useradd: '',
				userphone: '',
				username: '',
				id: '',
				//是否已经收藏
				stuas: '',
				//收藏表id
				collid: '',
				//是否已经在购物车
				stuats:'',
				//商品信息，
				goodsinfo: [],
				content: '',
				weight: 1,
				options: [{
					icon: 'home',
					text: '首页'
				}, {
					icon: 'cart-filled',
					text: '收藏',
					info: 0,
				}, {
					icon: 'cart-filled',
					text: '购物车',
					info: 0,
				}],
				buttonGroup: [{
						text: '加入购物车',
						backgroundColor: '#ff0000',
						color: '#fff'
					},
					{
						text: '立即购买',
						backgroundColor: '#ffa200',
						color: '#fff'
					}
				]
			}
		},
		methods: {//查询该商品是否在购物车
		 flagcart(id,userid){
				uni.request({
					url: 'http://192.168.43.132:8089/product/FindCart',
					data: {
						id,
						userid,
					},
					success:(res)=>{
					if (res.data != "") {
						this.collid = res.data.id
						this.stuats = true
						this.options[2].icon ='cart-filled'
					} else {
						this.stuats = false
						this.options[2].icon ='cart'
					}	
					console.log("zzz"+res.data.length)
					}
				})
				
			},
			//查询购物车表记录统计记录条数
			async countcart(userid){
				const res = await this.$myRequest({
					url: '/product/Findcart',
					data: {
						userid,
					}
				})
				console.log(res.data.length)
				this.options[2].info = res.data.length
			},
			//查询收藏表记录统计已收藏条数
			async countcol(userid) {
				const res = await this.$myRequest({
					url: '/product/FindCollect',
					data: {
						userid,
					},
				})
				this.options[1].info = res.data.length
			},
			//判断商品是否已经被收藏
			flagcoll(id, userid) {
				uni.request({
					url: 'http://192.168.43.132:8089/product/Findcol',
					data: {
						id,
						userid,
					},
					success: (res) => {
						if (res.data != "") {
							this.collid = res.data.id
							this.stuas = true
							this.options[1].icon = 'star-filled'
						} else {
							this.options[1].icon = 'star'
							this.stuas = false
						}
					}
				})
			},
			//加数量
			add() {
				if (this.weight < this.goodsinfo.inventory) {
					this.weight++;
					this.goodsinfo.inventory--;
				}
			},
			//减数量
			sub() {
				if (this.weight > 1) {
					this.weight--;
					this.goodsinfo.inventory++;
				}
			},
			//导航栏点击
			onClick(e) {
				if (e.content.text == '首页') {
					uni.switchTab({
						url: '../index/index'
					})
				}
				if (e.content.text == '收藏') {
					var id = this.id
					var userid = this.userid
					var user = this.username
					if (user == '') {
						uni.showToast({
							title: "请先登录"
						});
					} else {
						//已经收藏状态点击取消
						if (this.stuas == true) {
							var id = this.id
							this.stuas = false
							this.options[1].info--
							this.options[1].icon = "star"
							uni.request({
								url: 'http://192.168.43.132:8089/product/DelectCollect',
								data: {
									id,
									userid,
								},
							})
						} else if (this.stuas == false) {
							var id = this.id
							this.stuas = true
							this.options[1].info++
							this.options[1].icon = "star-filled"
							//添加到收藏
							uni.request({
								url: 'http://192.168.43.132:8089/product/Collect',
								data: {
									id,
									userid,
								},success:(res)=> {
									uni.showToast({
										title: "宝贝已收藏"
									});
								}
							})
						}
					}
				}
				if (e.content.text == '购物车') {
					uni.reLaunch({
						url: '../cart/cart',
					})
				}
			},
			//购物车或立即购买按钮点击
			buttonClick(e) {
				var goodsid = this.id
				var userid = this.userid
				var number = this.weight
				var username = this.username
				var useradd = this.useradd
				var phone = this.userphone
				var playtype = 'false'
				//判断按钮点击
				if (e.content.text == '加入购物车') {
					//判断是否登录
					if (username == '') {
						uni.showToast({
							title: "请先登录"
						});
					} else {
						if(this.stuats==true){
							uni.showToast({
								title: "宝贝已经在购物车了哦"
							});
						}else if(this.stuats==false){
							//添加到购物车
							uni.request({
								url: 'http://192.168.43.132:8089/product/Cart',
								data: {
									goodsid,
									number,
									userid,
								},
								success: (res) => {
									this.options[2].info++
									this.options[2].icon = "cart-filled"
									uni.showToast({
										title: "宝贝成功添加"
									});
								}
							})
						}
					}
				}
				if (e.content.text == '立即购买') {
					//获取一个当前时间以创建订单
					var adata = new Date();
					var simtim = this.userphone + adata.getFullYear() + (adata.getMonth() + 1) + adata.getDate() + adata.getHours() +
						adata.getMinutes() + adata.getSeconds()
					console.log(simtim)
					if (username == '') {
						uni.navigateTo({
							url: '../login/login',
							success: res => {},
							fail: () => {},
							complete: () => {}
						});
					} else {
						uni.request({
							url: 'http://192.168.43.132:8089/product/buy',
							data: {
								goodsid,
								userid,
								number,
								username,
								useradd,
								phone,
								playtype,
								simtim,
							},
							success: (res) => {
								//成功创建订单跳转到待支付页
								uni.navigateTo({
									url: '../orderinfo/createOrder?simtim=' + simtim
								})
							}
						})
					}
				}
			}
		},
		onLoad(options) {
			this.userid = uni.getStorageSync("userid")
			this.username = uni.getStorageSync("username")
			this.useradd = uni.getStorageSync("useradd")
			this.userphone = uni.getStorageSync("userphone")
			this.id = options.id;
			var id = this.id;
			var userid = this.userid
			//查询商品详细信息
			uni.request({
				url: 'http://192.168.43.132:8089/product/FindByid',
				data: {
					id
				},
				success: (res) => {
					this.goodsinfo = res.data;
					this.content = res.data.info;
				}
			})
			//将该商品添加到历史记录
			uni.request({
				url: 'http://192.168.43.132:8089/product/inputzj',
				data: {
					id,
					userid,
				}
			})
			//查询该商品是否在收藏表
			this.flagcoll(id, userid)
			//查询收藏表记录统计已收藏条数
			this.countcol(userid)
			//查询该商品是否在收藏表
			this.flagcart(id, userid)
			//查询收藏表记录统计已收藏条数
			this.countcart(userid)
		},
		components: {
			uniGoodsNav
		},
	}
</script>

<style lang="scss">
	.home {
		background: #eee;
	}

	.carousel {
		height: 572upx;
		position: relative;

		swiper {
			height: 100%;
		}

		.image-wrapper {
			width: 100%;
			height: 100%;
		}

		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.box1 {
		padding: 10px;
		background-color: #FFFFFF;

		.price {
			color: #b50e03;
			font-size: 46rpx;

			text:nth-child(2) {
				color: #C0C0C0;
				font-size: 28rpx;
				margin-left: 17rpx;
				text-decoration: line-through;
			}
		}

		.name {
			font-size: 48rpx;
			line-height: 50rpx;
			padding-bottom: 15rpx;
			padding-top: 20rpx;
			margin-left: 17rpx;
		}
	}

	.hot_goods {
		background: #eee;

		.tit {
			height: 50px;
			line-height: 50px;
			color: #b50e03;
			text-align: center;
			letter-spacing: 20px;
			background: #fff;
			margin: 7rpx 0;
		}
	}

	.line {
		background: #eee;
		height: 5rpx;
		width: 95%;
		margin-right: 20rpx;
	}

	.box2 {
		background: #FFFFFF;
		height: 500rpx;
		width: 750rpx;
		padding-bottom: 130px;
	}

	.inventory {
		color: #C0C0C0;
		font-size: 36rpx;
		margin-left: 17rpx;

		text:nth-child(2) {
			color: #C0C0C0;
			font-size: 36rpx;
			margin-left: 107rpx;
		}

		text:nth-child(3) {
			color: #C0C0C0;
			font-size: 36rpx;
			margin-left: 107rpx;
		}
	}

	.selectbuy {
		color: #C0C0C0;
		position: relative;
	}

	.info {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap: wrap;
		background: #FFFFFF;
		width: 100%;
		word-wrap: break-word;
		text-indent: 2em;
	}

	.sub {
		background-color: #F0AD4E;
		color: #FFFFFF;
		width: 60rpx;
		height: 60rpx;
		position: absolute;
		line-height: 60rpx;
		border-radius: 50%;
		text-align: center;
		font-weight: 700;
		right: 150rpx;
	}

	.add {
		position: absolute;
		background-color: #F0AD4E;
		color: #FFFFFF;
		width: 60rpx;
		height: 60rpx;
		right: 20rpx;
		line-height: 60rpx;
		border-radius: 50%;
		font-weight: 700;
		text-align: center;
	}

	.sum {
		position: absolute;
		color: #DD524D;
		right: 100rpx;
		font-weight: 700;
	}

	.paly {
		position: absolute;
		color: #808080;
		left: 10px;
	}

	.palymoney {
		position: absolute;
		color: #DD524D;
		left: 70px;
	}

	.goods_nav {
		position: fixed;
		bottom: 0;
		width: 100%;
	}
</style>
