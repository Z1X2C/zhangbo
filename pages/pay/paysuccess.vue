<template>
	<view>
		<view style="margin-top: 100px;"><text style="font-size: 28px;margin-left: 150px;color: #DD524D;">支付成功</text></view>
		<view><text style="font-size: 21px;margin-top: 100px;margin-left: 120px;color: #999999;">3秒后跳转至首页</text></view>
		<view><button type="primary" size="default" @click="a" style="margin-left: 100px;width: 200px;">立即跳转</button></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			a(){
				uni.reLaunch({
					url:'../index/index'
				})
			}
		},
		onLoad() {
			setTimeout(function(){
				uni.reLaunch({
					url:'../index/index'
				})
			},3000)
		}
	}
</script>

<style>

</style>
