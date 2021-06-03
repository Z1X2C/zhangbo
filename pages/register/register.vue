<template>
	<view class="countent">
			<form  @submit="formSubmit" @reset="formReset">
			<view class="username">
				<view class="inputname"><input  type="text" placeholder="用户名:" v-model="username" style="margin-top: 10px;" ></view>
			</view>
			<view class="password">
				<view class="inputpass"><input type="password" placeholder="密码:" v-model="password" style="margin-top: 10px;"></view>
			</view>
			<view class="password">
				<view class="inputpass"><input type="password" placeholder="确认密码:" v-model="sourpassword" style="margin-top: 10px;"></view>
			</view>
			<view class="password">
				<view class="inputpass"><input type="number" placeholder="电话:" v-model="inputphone" style="margin-top: 10px;"></view>
			</view>
			<view class="password">
				<view class="inputpass"><input type="text" placeholder="您的配送地址:" v-model="useradd" style="margin-top: 10px;"></view>
			</view>
			<view class="loginbutton">
				  <button class="reset" form-type="reset" type="warn" style="border: 0rpx;">取消</button>
				   <button class="submit" form-type="submit" type="success" style="border: 0rpx;">注册</button>
			</view>
			</form>
			<view class="registerbutton">
				<button class="bu1" type="default" plain="true" size="mini" @click="login">登录</button>
			</view>
	<uni-popup ref="popup" type="dialog">
	    <uni-popup-message type="error" message="用户名长度必须为2-20个字符!" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-message>
	</uni-popup>
	<uni-popup ref="popup1" type="dialog">
	    <uni-popup-message type="error" message="密码格式必须为6-16个字母、数字、下划线 !" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-message>
	</uni-popup>
	<uni-popup ref="popup2" type="dialog">
	    <uni-popup-message type="error" message="密码格式必须为6-16个字母、数字、下划线 !!" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-message>
	</uni-popup>
	<uni-popup ref="popup3" type="dialog">
	    <uni-popup-message type="error" message="电话格式错误!" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-message>
	</uni-popup>
	<uni-popup ref="popup4" type="dialog">
	    <uni-popup-message type="error" message="地址不能为空" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-message>
	</uni-popup>
	<uni-popup ref="popup5" type="dialog">
	    <uni-popup-message type="error" message="密码与确认密码不一致!" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-message>
	</uni-popup>
	<uni-popup ref="popup6" type="dialog">
	    <uni-popup-message type="error" message="该用户已经注册" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-message>
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
				sourpassword:'',
				inputphone:'',
				useradd:'',
				
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
							var sourpass=this.sourpassword
							var phone=this.inputphone
							var add=this.useradd
							var Falg=false
							//表单验证
							if(Falg==false){
							if(username.length<2||username.length>20){
								this.open()
								Falg=false
							}else if(!this.checkedpass(password)){
								this.open1()
								Falg=false
							}else if(!this.checkedpass(sourpass)){
								this.open2()
								Falg=false
							}else if(add==""){
								this.open4()
								Falg=false
							}else if(!this.checkedpass(phone)){
								this.open3()
								Falg=false
							}else if(password!=sourpass){
								this.open5()
								Falg=false
							  }else{
								  Falg=true
								  console.log(Falg)
							  }
							}
							//验证通过
							if(Falg==true){
								uni.request({
									url:'http://192.168.43.132:8089/User/finduser',
									data:{
									username,
									password,
									phone,
									add,
									},
									success:(res)=> {
										//用户已经注册
										if(res.data==false){
											this.open6()
										}else {
										uni.request({
											url:'http://192.168.43.132:8089/User/register',
											data:{
											username,
											password,
											phone,
											add,
											},
											success:(res)=> {
										//注册成功
 												uni.showToast({
												  title: "注册成功"
												   });
										uni.reLaunch({
											url:'../login/login',
										})
											}
										})
										
										}

									}
								})
							}
			            },
			login(){
				uni.reLaunch({
					url:'../login/login',
				})
			},
			open(){
			this.$refs.popup.open()
			},
			open1(){
			this.$refs.popup1.open()
			},
			open2(){
			this.$refs.popup2.open()
			},
			open3(){
			this.$refs.popup3.open()
			},
			open4(){
			this.$refs.popup4.open()
			},
			open5(){
			this.$refs.popup5.open()
			},
			open6(){
			this.$refs.popup6.open()
			},
			
			checkedpass(password){
				return RegExp(/^(\w){6,16}$/).test(password)
			},
			checkedpass(sourpass){
				return RegExp(/^(\w){6,16}$/).test(sourpass)
			},
			checkedpass(phone){
				return RegExp(/^[+]{0,1}(\d){1,3}[ ]?([-]?(\d){1,12})+$/).test(phone)
			},
		}
	}
</script>

<style lang="scss">
	.countent{
		width: 100%;
		height: 100%;
		position: fixed;
}
.username{
	display: flex;
	margin-top: 50px;
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
	display: flex;
	margin-top: 20px;
	width: 100%;
	height: 50px;
	.submit{
		width: 150px;
		height: 50px;
		margin-left: 20px;
	}
	.reset{
		width: 150px;
		height: 50px;
		margin-left: 20px;
	}
}
.registerbutton{ 
	display: flex;
	margin-top: 10px;
	width:100%;
	height: 50px;
   .bu1{
	   width: 100px;
	   margin-top: 10px;
	   margin-left: 20px;
	   border:  0px;
	   color: #007AFF;
   }
}
</style>
