<template>
	<view>
		<view v-if="!hasLoginL" class="gologin">
			<text style="color: #808080;font-size:36px;margin-left: 100px;">您还未登录</text>
			<text style="color: #DD524D;font-size:16px;margin-left: 160px;" @click="gologin">登录 ></text>
		</view>
		<view v-if="hasLoginL" class="user">
			<!-- 头部 -->
			<view class="user-wrap">
				<view class="setting iconfont icon31shezhi"></view>
				<view class="info">
					<image class="avatar" mode="aspectFill" :src="userimage" @click="changeimage"></image>
					<view class="nickname">{{this.username}}</view>
				</view>
			</view>
			<!-- 订单状态 -->
			<view class="order-status">
				<view class="status-wrap">
					<!-- 单元格 -->
					<view class="cell">
						<view class="cell-left" @click="allorder">
							<image class="cell-icon" src="/static/user/icon-order.png" mode="aspectFill"></image>
							<view class="cell-text">全部订单</view>
						</view>
						<view class="iconfont iconmore1"></view>
					</view>

					<!-- 订单状态 -->
					<view class="status-list">
						<view class="status-item" hover-class="btn-hover" v-for="(item, index) in orderStatusList" :key="index" @click="orders(index)">
							<view class="item-icon" :class="item.icon"></view>
							<view class="item-text">{{ item.name }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 滑动导航 -->
			<view style="border-radius: 20rpx; overflow: hidden; margin: 0 20rpx;">
				<com-nav :list="list" :col="4"></com-nav>
			</view>

			<!-- 用户功能 -->
			<view class="com-item">
				<view class="com-wrap">
					<view class="cell" v-for="(item, index) in userList" :key="index">
						<view class="cell-left">
							<image class="cell-icon" :src="item.icon" mode="aspectFill"></image>
							<view class="cell-text" @click="cell(index)">{{ item.title }}</view>
						</view>
						<view class="iconfont iconmore1"></view>
					</view>
				</view>
			</view>

			<!-- 用户服务 -->
			<view class="com-item">
				<view class="com-wrap">
					<view class="cell" v-for="(item, index) in serverList" :key="index">
						<view class="cell-left">
							<image class="cell-icon" :src="item.icon" mode="aspectFill"></image>
							<view class="cell-text">{{ item.title }}</view>
						</view>
						<view class="iconfont iconmore1"></view>
					</view>
				</view>
			</view>
			<view class="outlogin">
				<button class="reset" @click="outlogin" type="warn" style="border: 0rpx; margin-top: 15px;width: 90%; margin-left: 5%;">退出登录</button>
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
	import comNav from './components/com-nav.vue'
	export default {
		components: {
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {
				//用户信息

				userid: '',

				userimage: '',

				username: '',

				empty: '',
				//是否登录
				hasLoginL: '',

				orderStatusList: [{
						name: '待付款',
						icon: 'iconfont icon31daifukuan',
						status: 10
					},
					{
						name: '待发货',
						icon: 'iconfont icon31daifahuo',
						status: 30
					},
					{
						name: '待收货',
						icon: 'iconfont icon31daishouhuo',
						status: 40
					},
					{
						name: '待评价',
						icon: 'iconfont icon31daipingjia',
						status: 50
					},
				],
				currentIndex: 0,
				list: [{
						icon: '/static/user/class-01.png',
						text: '我的电子券'
					},
					{
						icon: '/static/user/class-02.png',
						text: '退换/售后'
					},
					{
						icon: '/static/user/class-03.png',
						text: '我的积分'
					},
					{
						icon: '/static/user/class-04.png',
						text: '送礼提醒'
					}
				],
				userList: [{
						title: '收货地址',
						icon: '/static/user/icon-address.png',
						path: 'address-list'
					},
					{
						title: '我的收藏',
						icon: '/static/user/icon-collect.png',
						path: 'collect-list'
					},
					{
						title: '最近浏览',
						icon: '/static/user/icon-foot.png',
						path: 'browse-list'
					}
				],
				serverList: [{
						title: '客服中心',
						icon: '/static/user/icon-kefu.png',
						path: 'kefu'
					},
					{
						title: '帮助中心',
						icon: '/static/user/icon-help.png',
						path: 'help'
					},
					{
						title: '版本',
						icon: '/static/user/icon-about.png',
						text: '1.0.0'
					}
				]
			};
		},
		onShow() {
			this.hasLoginL = uni.getStorageSync("user")
			this.username = uni.getStorageSync("username")
			this.userid = uni.getStorageSync("userid")
			this.userimage = uni.getStorageSync("userimage")
			this.empty = uni.getStorageSync("empty")
		},
		methods: {
			//更换头像
			changeimage() {
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.uploadFile({
							url: 'http://192.168.43.132:8089/User/updateimage',
							filePath: tempFilePaths[0],
							name: 'multipartFile',
							header: {
								userid: uni.getStorageSync("userid")
							},
							success: (resp) => {
								console.log(resp)
								if (resp.statusCode == '200') {
									uni.setStorageSync("userimage", resp.data)
									uni.showToast({
										title: '头像修改成功',
										icon: 'none',
										duration: 2000,
										// icon:none
									});
								}

							}
						});
					}
				});
				},
				//弹出层
				open() {
						this.$refs.popup.open()
					},
					//退出登录
					outlogin() {
						uni.setStorageSync("empty", true)
						uni.setStorageSync("user", false)
						uni.setStorageSync("userid", '')
						uni.setStorageSync("username", '')
						uni.setStorageSync("userimage", '')
						uni.reLaunch({
							url: '../login/login',
						})
					},
					//前往登录
					gologin() {
						uni.navigateTo({
							url: '../login/login',
						});
					},
					//待付款订单查询
					orders(index) {
						if (index == 0) {
							uni.navigateTo({
								url: '../orderinfo/orderinfo',
							})
						} //发货订单查询
						else if (index == 1) {
							uni.navigateTo({
								url: '../orderinfo/oredeinfoto',
							}) //待收货订单
						} else if (index == 2) {
							console.log(index)
							uni.navigateTo({
								url: '../orderinfo/distrorder',
							})
						}
					},
					//所有订单
					allorder() {
						uni.navigateTo({
							url: '../orderinfo/allorder',
						})
					},
					//我的收藏
					cell(index) {
						if (index == 1) {
							uni.reLaunch({
								url: '../collect/collect',
							})
						}
						if (index == 2) {
							uni.reLaunch({
								url: '../zuji/zuji',
							})
						}
					}
			}
		};
</script>

<style lang="scss">
	page {
		background: #f2f2f2;
	}

	.btn-hover {
		background: #f2f2f2 !important;
	}

	.user {
		.user-wrap {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 50vw;
			padding: 30rpx;
			z-index: 9;
			border-radius: 0 0 20% 20%;
			background: url('https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1326378687,2904033429&fm=26&gp=0.jpg') no-repeat;
			background-size: cover;

			.setting {
				color: #fff;
				position: absolute;
				top: 60rpx;
				left: 60rpx;
				font-size: 50rpx;
			}

			.info {
				position: absolute;
				text-align: center;

				.avatar {
					width: 150rpx;
					height: 150rpx;
					border-radius: 50%;
				}

				.nickname {
					color: #fff;
					font-size: 28rpx;
				}
			}
		}

		.order-status {
			padding: 0 20rpx;
			margin-top: -10vw;

			.status-wrap {
				border-radius: 25rpx;
				overflow: hidden;

				.status-list {
					display: flex;
					justify-content: space-evenly;
					align-items: center;
					background: #fff;
					padding-top: 30rpx;
					padding-bottom: 30rpx;

					.status-item {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						.item-icon {
							line-height: 1;
							font-size: 65rpx;
							color: #bbb;
						}

						.item-text {
							font-size: 28rpx;
							color: #666;
							margin-top: 5rpx;
						}
					}
				}
			}
		}

		.com-item {
			padding-left: 20rpx;
			padding-right: 20rpx;
			margin-top: 20rpx;

			.com-wrap {
				border-radius: 25rpx;
				overflow: hidden;
			}
		}

		.cell {
			height: 80rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			background: #fff;
			border-bottom: 1px solid #f8f8f8;

			&:active {
				background: #f2f2f2;
			}

			&:last-child {
				border-bottom: none !important;
			}

			.cell-left {
				display: flex;
				align-items: center;

				.cell-icon {
					width: 50rpx;
					height: 50rpx;
				}

				.cell-text {
					color: #666;
					font-size: 28rpx;
					margin-left: 20rpx;
				}
			}

			.iconfont {
				font-size: 40rpx;
				color: #999;
			}
		}
	}
</style>
