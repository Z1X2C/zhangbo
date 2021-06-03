<template>
	<view class="collect">
		<view v-if="!hasLoginL" class="gologin">
			<text style="color: #808080;font-size:36px;margin-left: 100px;">您还未登录</text>
			<text style="color: #DD524D;font-size:16px;margin-left: 160px;" @click="gologin">登录 ></text>
		</view>
		<view v-if="hasLoginL && empty" class="gologin">
			<text style="color: #808080;font-size:36px;margin-left: 100px;">没有足迹哦</text>
			<text style="color: #DD524D;font-size:16px;margin-left: 160px;" @click="goshoping">去添加 ></text>
		</view>
		<view style="margin-bottom: 50px;">
			<view class="collect_item" v-for="item in collectList" :key="item.id">
				<view class="ima">
					<image :src="item.src" @click="navigator(item.goodsid)"></image>
				</view>
				<view class="info" @click="navigator(item.goodsid)">
					<text class="tit">{{item.name}}</text>
					<text>￥{{item.price}}</text>
				</view>
				<view class="delelt">
					<image src="../../static/static/del.jpg" @click="del(item)"></image>
				</view>
			</view>
		</view>
		<view class="delall">
			<button type="warn" size="default">清空足迹</button>
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
			confirm(done, value) {
				var id = this.delid;
				var userid = uni.getStorageSync("userid")
				uni.request({
					url: 'http://192.168.43.132:8089/product/delzj',
					data: {
						id,
						userid,
					},
					success: (res) => {
						this.getcollect()
					},
				})
				uni.showToast({
					title: "已删除"
				});
				done()
				this.getcollect()
			},
			async getcollect() {
				var userid = uni.getStorageSync("userid")
				const res = await this.$myRequest({
					url: '/product/outpuzj',
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
				this.delid = item.id;
				this.$refs.popup.open()
			},
			//跳转到详情
			navigator(goodsid) {
				uni.navigateTo({
					url: '/pages/goods-detail/goods-detail?id=' + goodsid
				})
			},
			gologin() {
				uni.navigateTo({
					url: '../login/login',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			goshoping() {
				uni.reLaunch({
					url: '../index/index',
				})
			},
		},
		onShow() {
			this.getcollect()
			this.hasLoginL = uni.getStorageSync("user")
			this.empty = uni.getStorageSync("empty")
		}
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

			.ima {
				width: 30%;
				height: 200rpx;
				margin-left: 20px;
				margin-right: 30px;

				image {
					min-width: 200rpx;
					max-width: 200rpx;
					min-height: 200rpx;
					max-height: 200rpx;
				}
			}

			.info {
				width: 30%;
				height: 200rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				font-size: 24px;
				color: #DD524D;

				text:nth-child(2) {
					margin-left: 0px;
					margin-bottom: 1px;
				}
			}

			.delelt {
				width: 40px;
				height: 200rpx;
				margin-left: 40px;

				image {
					margin-top: 40px;
					min-width: 30px;
					max-width: 30px;
					min-height: 30px;
					max-height: 30px;
				}
			}
		}

		.delall {
			width: 100%;
			height: 60px;
			background-color: #FFFFFF;
			display: flex;
			display: -webkit-flex;
			flex-flow: row nowrap;
			align-items: center;
			justify-content: space-between;
			position: fixed;
			bottom: 0px;
		}
	}
</style>
