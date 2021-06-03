<template>
	<view class="collect">
		<view v-if="!hasLoginL" class="gologin">
			<text style="color: #808080;font-size:36px;margin-left: 100px;">您还未登录</text>
			<text style="color: #DD524D;font-size:16px;margin-left: 160px;" @click="gologin">登录 ></text>
		</view>
		<view v-if="hasLoginL && empty" class="gologin">
			<text style="color: #808080;font-size:36px;margin-left: 100px;">购物车空空如也</text>
			<text style="color: #DD524D;font-size:16px;margin-left: 160px;" @click="goshoping">去添加 ></text>
		</view>
		<view class="collect_item" v-for="(item,index) in collectList" :key="index">
			<!-- 勾选 -->
			<view style="width: 8%;height: 100%;background-color: #FFFFFF;">
				<checkbox-group @change="selected(item)">
					<checkbox :checked="item.flag" style="margin-top: 25px;"></checkbox>
				</checkbox-group>
			</view>
			<image :src="item.image"></image>
			<view class="right">
				<view class="tit">{{item.title}}</view>
				<view class="selectnumber">
					<image class="add" src="../../static/static/sub.jpg" @click="sub(item)"></image>
					<text style="margin-right: 10px;">{{item.number}}</text>
					<image class="add" src="../../static/static/add.png" @click="add(item)"></image>
				</view>
				<view class="info">
					<text>￥{{item.price*item.number}}元</text>
				</view>
			</view>
			<view class="delelt" @click="del(item)">
				<image src="../../static/static/del.jpg"></image>
			</view>
		</view>
		<view class="glance-shop-cart-order">
			<!-- 总数量 -->
			<view class="glance-shop-cart-total-cnt">
				<radio @click="selectall()" :checked="selectb">全选</radio>
			</view>
			<!-- 总金额 -->
			<view class="glance-shop-cart-total-amt">￥{{countprice}}</view>
			<!-- 立即下单 -->
			<view class="glance-shop-cart-create-order" @click="order">立即下单</view>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog type="input" message="成功消息" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	export default {
		data() {
			return {
				//商品列表
				collectList: [],
				//是否全选
				selectb: true,
				//商品是否被选中
				flag: true,
				//要删除的商品id
				delid: '',
				//是否登录
				hasLoginL: '',
				//是否为空
				empty: '',

			}
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		computed: {
			countprice() {
				let countprice = 0;
				this.collectList.map(item => {
					item.flag ? countprice += item.number * item.price : countprice += 0
				})
				return countprice
			}
		},
		onLoad() {
			this.getcollect()
			this.hasLoginL = uni.getStorageSync("user")
			this.empty = uni.getStorageSync("empty")
			this.userid = uni.getStorageSync("userid")
			this.username = uni.getStorageSync("username")
			this.useradd = uni.getStorageSync("useradd")
			this.userphone = uni.getStorageSync("userphone")
		},
		methods: {
			//跳转登录
			navToLogin() {
				uni.reLaunch({
					url: '../login/login',
				})
			},
			/*点击取消*/
			close(done) {
				done()
			},
			/*点击确定*/
			async confirm(done, value) {
				var id = this.delid;
				const res= await this.$myRequest({
					url: '/product/DelectCart',
					data: {
						id,
					},
					success: (res) => {
						this.getcollect()
					}
				})
				uni.showToast({
					title: "已删除"
				});
				done()
			},
			//获取商品列表
			async getcollect() {
				var userid = uni.getStorageSync("userid")
				const res = await this.$myRequest({
					url: '/product/Findcart',
					data: {
						userid,
					}
				})
				this.collectList = res.data
				console.log(this.collectList.length)
				if (this.collectList.length == 0) {
					this.empty = true
				} else {
					this.empty = false
				}
			},
			// 点击勾选
			selected(item) {
				item.flag = !item.flag
				//列表有未选项时取消全选
				if (!item.flag) {
					this.selectb = false
				} else {
					const test = this.collectList.every(item => {
						return item.flag === true
					})
					if (test) {
						this.selectb = true
					} else {
						this.selectb = false
					}
				}
			},
			//全选
			selectall(item) {
				this.selectb = !this.selectb
				if (this.selectb) {
					this.collectList.map(item => {
						item.flag = true
					})
				} else {
					this.collectList.map(item => {
						item.flag = false
					})
				}
			},
			//加数量
			async add(item) {
				var number = item.number
				var stock = item.stock
				if (number >= stock) {
					uni.showToast({
						title: '没有货啦',
						icon: "none",
					});
				} else {
					var id = item.id;
					const res= await this.$myRequest({
						url: '/product/Add',
						data: {
							id,
							number
						},
						success: (res) => {
							if (item.checked == 2) {
								this.countprice += item.price
							}
							this.getcollect()
						}
					})
				}
			},
			//减数量
			async sub(item) {
				var number = item.number
				var id = item.id;
				const res= await this.$myRequest({
					url: '/product/sub',
					data: {
						id,
						number
					},
					success: (res) => {
						this.getcollect()

					}
				})
			},
			//删除商品
			del(item) {
				this.delid = item.id;
				this.$refs.popup.open()
			},
		 gologin() {
				uni.navigateTo({
					url: '../login/login',
				});
			},
			goshoping() {
				uni.reLaunch({
					url: '../index/index',
				})
			},
			//插入订单表
			order() {
				var userid = this.userid
				var username = this.username
				var useradd = this.useradd
				var phone = this.userphone
				var playtype = '未付款'
				//获取一个当前时间以创建订单
				var adata = new Date();
				var simtim = this.userphone + adata.getFullYear() + (adata.getMonth() + 1) + adata.getDate() + adata.getHours() +
					adata.getMinutes() + adata.getSeconds()
				this.collectList.map(item => {
					if (item.flag) {
						var id = item.id
						var goodsid = item.goodsid
						var number = item.number
						uni.request({
							url: 'http://192.168.43.132:8089/product/buy',
							data: {
								id,
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
								//在购物车添加一个simtim
								uni.request({
									url: 'http://192.168.43.132:8089/product/cartsimtim',
									data: {
										id,
										simtim
									},
									success: (res) => {
										//成功创建订单跳转到待支付页
										uni.reLaunch({
											url: '../orderinfo/createOrder?simtim=' + simtim
										});
									}
								})
							}
						})
					}
				})
			},
		},
	}
</script>

<style lang="scss">
	.collect {
		margin-bottom: 50px;

		.gologin {
			width: 100%;
			height: 50px;
			margin-top: 200px;

		}

		.collect_item {
			display: flex;
			padding: 10rpx 20rpx;
			border-bottom: 1px solid #F0AD4E;

			image {
				min-width: 200rpx;
				max-width: 200rpx;
				height: 150rpx;
				margin-left: 10px;
				margin-right: 30px;
			}

			.tit {
				font-size: 21px;
			}

			.right {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}

			.delelt {
				image {
					margin-top: 25px;
					min-width: 30px;
					max-width: 30px;
					min-height: 30px;
					max-height: 30px;
					margin-left: 0px;
				}
			}

			.info {
				font-size: 18px;
				color: #DD524D;
				margin-left: 10px;
				margin-right: 5px;
			}
		}

		.selectnumber {
			display: flex;
			width: 80%;
			height: 30px;
			margin-left: 5%;

			.add {
				min-width: 30px;
				max-width: 30px;
				min-height: 30px;
				max-height: 30px;
			}

		}

		/* 空白页 */
		.empty {
			position: fixed;
			left: 0;
			top: 0;
			width: 100%;
			height: 100vh;
			padding-bottom: 100upx;
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			background: #fff;

			image {
				width: 240upx;
				height: 160upx;
				margin-bottom: 30upx;
			}

			.empty-tips {
				display: flex;
				font-size: $font-sm+2upx;
				color: $font-color-disabled;

				.navigator {
					color: $uni-color-primary;
					margin-left: 16upx;
				}
			}
		}
	}

	.goods_nav {
		position: fixed;
		line-height: 100rpx;
		background-color: #007AFF;
		margin-bottom: 50px;
		width: 100%;
		height: 50px;

	}

	,
	// 底部汇总和订单样式
	.glance-shop-cart-order {
		width: 100%;
		height: 60px;
		background-color: #ffffff;
		display: flex;
		display: -webkit-flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		position: fixed;
		bottom: 50px;
	}

	// 合计金额样式
	.glance-shop-cart-total-cnt {
		width: 30%;
		text-align: left;
		line-height: 40px;
		font-size: 13px;
		margin-left: 15px;
	}

	// 合计金额样式
	.glance-shop-cart-total-amt {
		width: 35%;
		text-align: right;
		margin-right: 15px;
		line-height: 40px;
		font-size: 16px;
		margin-left: 10px;
		color: #f40;
	}

	// 生成订单样式
	.glance-shop-cart-create-order {
		width: 30%;
		background-color: #DC143C;
		text-align: center;
		line-height: 40px;
		font-size: 0.8rem;
		color: #ffffff;
		margin-right: 10px;
	}

	.glance-shop-cart-itemunselected-img {
		width: 16px;
		height: 16px;
		border: solid 1px lightgray;
		border-radius: 50%;
	}
</style>
