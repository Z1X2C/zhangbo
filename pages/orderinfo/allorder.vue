<template>
	<view class="collect">
		<view v-if="hasLoginL && empty" class="gologin">
			<text style="color: #808080;font-size:36px;margin-left: 100px;" >空空如也</text>
			<text style="color: #DD524D;font-size:16px;margin-left: 160px;"@click="goshoping" >去添加 ></text>
		</view>
		<view class="collect_item" v-for="item in orderList" :key="item.id">
			<!-- 一个 -->
			<view class="item">
				<!-- 是否付款（上部） -->
			<view class="playtype">
				<text>{{item.playtype}}</text>
			</view>
			<!-- 细则（下部） -->
			<view class="but">
			<view class="image">
				<image :src="item.src" @click="navigator(item.goodsid)"></image>
			</view>
			<!-- 商品名称与数量价格等-->
			<view class="left">
				<view class="name" style="font-size: 18px;">{{item.name}}</view>
				<view class="info">
					<text style="margin-top: 10px;">单价￥{{item.price}}         数量:{{item.number}}</text>
				</view>
			</view>
			<view class="right" @click="navigator(item.goodsid)">
			</view>
			<view class="delelt">
				<button class="bu2" type="default" plain="true" size="mini" @click="del(item)">取消订单</button>
			</view>
		      </view>
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
				orderList:[],
				delid:'',
				userid:'',
				empty:'',
				//是否登录
				hasLoginL:'',
			}
		},
		components: {
		        uniPopup,
		        uniPopupMessage,
		        uniPopupDialog
		    },
		methods: {
			close(done){
			           done()
			       },
			confirm(done,value){
							 var id= this.delid;
							 var userid=uni.getStorageSync("userid")
							 uni.request({
							 	url:'http://192.168.43.132:8089/product/deleteorder',
							 	data:{
							 		id,
									userid,
							 		},
							 		success:(res)=>{
										this.getcollect()
							 			}
							 })
  			     uni.showToast({
			       title: "已删除"
			        });
			        done()
					this.getcollect()
			       },
		async getcollect(){
			 var userid=uni.getStorageSync("userid")
			const res= await this.$myRequest({
			url :'/product/allorder',
			data:{
				userid,
			}
		})
		this.orderList = res.data
		if(this.orderList.length==0){
			this.empty=true
		}else{
			this.empty=false
		}
			},
			//删除商品
			del(item){
				this.delid=item.id;
				this.$refs.popup.open()
			 },
			 //跳转到详情
		navigator(goodsid){
				 uni.navigateTo({
				 	url:'/pages/goods-detail/goods-detail?id='+goodsid
				 })
			 },
			 gologin(){
			 			 uni.navigateTo({
			 			 	url: '../login/login',
			 			 });
			 },
			 goshoping(){
			  uni.reLaunch({
			  url: '../index/index',
			     })
			 },
		},
		onShow() {
			this.getcollect()
			this.userid=uni.getStorageSync("userid")
			this.hasLoginL=uni.getStorageSync("user")
			this.empty=uni.getStorageSync("empty")
			console.log(this.userid)
		},
		onLoad(){
			
		}
	}
</script>

<style lang="scss"> 
.collect{
	.gologin{
		width: 100%;
		height: 50px;
		margin-top: 200px;
	}
	.collect_item{
		width: 90%;
		margin-left: 2%;
		margin-top: 10px;
		border-radius: 10px;
		border:1px solid #F0AD4E;
		display: flex;
		padding: 10rpx 20rpx;
image{
	min-width: 200rpx;
	max-width: 200rpx;
	height: 150rpx;
	margin-right: 30px;
}
.item{
	width: 100%;
	height: 10%;
}
.playtype{
			width: 100%;
			height: 30px;
		}
.but{
			width: 100%;
			height: 80%;
			display: flex;
		}
.image{
	width: 20%;
	height: 100%;
}
.left{
	width: 40%;
	height: 100%;
	margin-left: 15%;
}
.info{
	display: flex;
	flex-direction: column;
    justify-content: space-between;
	font-size: 18px;
	color: #DD524D;
		}
.delelt{
	width: 32px;
	margin-left: 10px;
  image{
	margin-top: 25px;
	min-width: 30px;
	max-width: 30px;
	min-height: 30px;
	max-height: 30px;
	margin-left: 1px;
		    }
		}
	}
	.bu2{
		   width: 100px;
		   margin-top: 10px;
		   border:  0px;
		   color: #DD524D;
	}
}
</style>
