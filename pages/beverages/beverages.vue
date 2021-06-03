<template>
	<view class="goods_list">
		<goods-list @goodsItemClick="goGoodDetail"  :hotgoods="hotgoods"></goods-list>
	</view>
</template>

<script>
	import goodsList from '../../components/goods-list/goods-list.vue'
	export default {
		data() {
			return {
				pageindex:1,
				hotgoods:[]
			}
		},
		components :{"goods-list":goodsList},
		methods: {
			//获取商品列表数据
		async getGoodsList(){
				const res=await this.$myRequest({
				url:'/product/Beverages'
				})
				this.hotgoods = res.data
			},
			//跳转到商品详情页
			goGoodDetail (id){
					 uni.navigateTo({
						 url:'../../pages/goods-detail/goods-detail?id='+id
					 })
			}
		},
		onLoad(){
			this.getGoodsList()
		}

	}
</script>

<style lang="scss">
.goods_list{
	background: #eee;
}
</style>
