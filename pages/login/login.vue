<template>
	<view class="countent">
		<form  @submit="formSubmit" @reset="formReset">
		<view class="username">
			<view class="inputname"><input type="text" placeholder="用户名:" v-model="username" style="margin-top: 10px;"></view>
		</view>
		<view class="password">
			<view class="inputpass"><input type="password" placeholder="密码:" v-model="password" style="margin-top: 10px;"></view>
		</view>
		<view class="loginbutton">
			  <button class="submit" form-type="submit" type="primary" style="border: 0rpx;">登录</button>
		</view>
		</form>
		<view class="registerbutton">
			<button class="bu1" type="default" plain="true" size="mini" @click="register">立即注册!</button>
			<button class="bu3" type="default" plain="true" size="mini" @click="index">游客浏览</button>
			<button class="bu2" type="default" plain="true" size="mini">忘记密码!</button>
		</view>
<uni-popup ref="popup" type="dialog">
    <uni-popup-message type="error" message="用户名或密码错误!" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-message>
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
				username:'',
				password:'',
			}
		},
		components: {
		        uniPopup,
		        uniPopupMessage,
		        uniPopupDialog
		    },
		methods: {
			formSubmit: function(e){
						    var username=this.username
							var password=this.password
							uni.request({
								url:'http://192.168.43.132:8089/User/Login',
								data:{
								username,
								password,
								},
								success:(res)=> {
								 var Falg = res.data
								if(Falg==""){
									this.open()
									uni.setStorageSync("empty",true)
									uni.setStorageSync("user",false)
								}else{
									uni.setStorageSync("empty",true)
									uni.setStorageSync("user",true)
									uni.setStorageSync("userid",res.data.id)
									uni.setStorageSync("username",res.data.username)
									uni.setStorageSync("useradd",res.data.useradd)
									uni.setStorageSync("userphone",res.data.phone)
									uni.setStorageSync("userimage",res.data.image)
									//登录成功
									uni.showToast({
									  title: "登录成功",
									   });
									uni.reLaunch({
										url:'../index/index',
									})
								  }
								}
							})
							
			            },
			open(){
			this.$refs.popup.open()
			},
			register(){
				uni.reLaunch({
					url:'../register/register',
				})
			},
			index(){
				uni.reLaunch({
					url:'../index/index',
				})
			}
		}
	}
</script>

<style lang="scss">
	.countent{
		width: 100%;
		height: 100%;
		position: fixed;
		background-image: url('https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1344748870,2518595215&fm=15&gp=0.jpg');
}
.username{
	display: flex;
	margin-top: 150px;
	width: 700px;
	height: 50px;
	.inputname{
		width: 250px;
		height: 100%;
		border-radius: 15px;
		margin-left: 50px;
		margin-right: 50px;
		border: 1px solid;
		text-align: center;
	}
	
}
.password{
	margin-top: 20px;
	width: 700px;
	height: 50px;
	.inputpass{
		width: 250px;
		height: 100%;
		border-radius: 15px;
		margin-left: 50px;
		margin-right: 50px;
		border: 1px solid;
		text-align: center;
	}
	
}
.loginbutton{
	margin-top: 20px;
	width: 700px;
	height: 50px;
	.submit{
		width: 250px;
		height: 50px;
		margin-left: 50px;
	}
}
.registerbutton{ 
	display: flex;
	margin-top: 20px;
	width:100%;
	height: 50px;
   .bu1{
	   width: 100px;
	   margin-top: 10px;
	   margin-left: 20px;
	   border:  0px;
	   color: #007AFF;
   }
   .bu2{
   	   width: 100px;
   	   margin-top: 10px;
   	   margin-left: 20px;
   	   border:  0px;
	   color: #007AFF;
   }
   .bu3{
   	   width: 100px;
   	   margin-top: 10px;
   	   margin-left: 20px;
   	   border:  0px;
   	   color: #007AFF;
   }


}
</style>
