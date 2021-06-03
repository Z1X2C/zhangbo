<template>
	<view class="goods_list">
		<!-- 商品 -->
		<view class="goods_item" v-for="item in hotgoods" :key="item.id" @click="navigator(item.id)">
			<!-- 商品图片 -->
			<image :src="item.src"></image>
			<!-- 价格 -->
			<view class="price">
				<!-- 现价格 -->
				<text>￥{{item.price}} /{{item.nuit}}</text>
				<!-- 原价格 -->
				<text>￥{{(item.price)*1.20}}</text>
			</view>
			<!-- 商品名称 -->
			<view class="name">
				<text>{{item.name}}</text>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		props: ['hotgoods'],
		methods: {
			navigator(id) {
				this.$emit('goodsItemClick', id)
			}
		}
	}
</script>

<style lang="scss">
	.goods_list {
		padding: 0 15rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;

		.goods_item {
			background: #fff;
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

			.price {
				color: #b50e03;
				font-size: 36rpx;

				text:nth-child(2) {
					color: #C0C0C0;
					font-size: 28rpx;
					margin-left: 17rpx;
					text-decoration: line-through;
				}
			}

			.name {
				font-size: 38rpx;
				line-height: 50rpx;
				padding-bottom: 15rpx;
				padding-top: 10rpx;
			}
		}
	}
</style>
