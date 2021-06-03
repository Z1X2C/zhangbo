const BASE_URL ='http://192.168.43.132:8089'
export const myRequest = (options)=>{
return new Promise((resolve)=>{
	uni.request({
		url:BASE_URL+options.url,
		method:options.method||'GET',
		data:options.data || {},
		success: (res)=>{
			resolve(res)
		}
	})
  })
}
