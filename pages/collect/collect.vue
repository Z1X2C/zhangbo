<template>
	<view class="collect">
		<view v-if="!hasLoginL" class="gologin">
			<text style="color: #808080;font-size:36px;margin-left: 100px;">您还未登录</text>
			<text style="color: #DD524D;font-size:16px;margin-left: 160px;" @click="gologin">登录 ></text>
		</view>
		<view v-if="hasLoginL && empty" class="gologin">
			<text style="color: #808080;font-size:36px;margin-left: 100px;">收藏夹空空如也</text>
			<text style="color: #DD524D;font-size:16px;margin-left: 160px;" @click="goshoping">去添加 ></text>
		</view>
		<view class="collect_item" v-for="item in collectList" :key="item.id">
			<image :src="item.src" @click="navigator(item.goodsid)"></image>
			<view class="right" @click="navigator(item.goodsid)">
				<view class="tit">{{item.name}}</view>
				<view class="info"><text>￥{{item.price}}</text>
					<text>库存:{{item.inventory}}</text>
				</view>
			</view>
			<view class="delelt">
				<image src="../../static/static/del.jpg" @click="del(item)"></image>
			</view>
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
				collectList: [],
				delid: '',
				empty: '',
				//是否登录
				hasLoginL: '',
			}
		},
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		methods: {
			close(done) {
				done()
			},
			async confirm(done, value) {
				var id = this.delid;
				var userid = uni.getStorageSync("userid")
				const res = await this.$myRequest({
					url: '/product/DelectCollect',
					data: {
						id,
						userid,
					},
					success: (res) => {
						console.log("方法执行")
						this.getcollect()
					}
				})
				uni.showToast({
					title: "已删除"
				});
				done()
				this.getcollect()
			},
			//获取商品列表
			async getcollect() {
				var userid = uni.getStorageSync("userid")
				const res = await this.$myRequest({
					url: '/product/FindCollect',
					data: {
						userid,
					}
				})
				this.collectList = res.data
				if (this.collectList.length == 0) {
					this.empty = true
				} else {
					this.empty = false
				}
			},
			//删除商品
			del(item) {
				this.delid = item.goodsid;
				this.$refs.popup.open()
			},
			//跳转到详情
			navigator(goodsid) {
				uni.navigateTo({
					url: '/pages/goods-detail/goods-detail?id=' + goodsid
				})
			},
			//前往登录
			gologin() {
				uni.navigateTo({
					url: '../login/login',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			//前往首页
			goshoping() {
				uni.reLaunch({
					url: '../index/index',
				})
			},
		},
		onLoad() {
			this.getcollect()
			this.hasLoginL = uni.getStorageSync("user")
			this.empty = uni.getStorageSync("empty")
		},
	}
</script>

<style lang="scss">
	.collect {
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
				margin-left: 20px;
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

			.info {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				font-size: 18px;
				color: #DD524D;

				text:nth-child(2) {
					margin-left: 0px;
				}
			}

			.delelt {
				width: 32px;
				margin-left: 95px;

				image {
					margin-top: 25px;
					min-width: 30px;
					max-width: 30px;
					min-height: 30px;
					max-height: 30px;
					margin-left: 1px;
				}
			}
		}
	}
</style>
