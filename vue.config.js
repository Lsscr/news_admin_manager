module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/news-manager/'
    : '/'
    // ,
    // devServer: {
    //   // 代理配置
    //    proxy: {
    //        // 这里的api 表示如果我们的请求地址有/api的时候,就出触发代理机制
    //        // localhost:8888/api/abc  => 代理给另一个服务器
    //        // 本地的前端  =》 本地的后端  =》 代理我们向另一个服务器发请求 （行得通）
    //        // 本地的前端  =》 另外一个服务器发请求 （跨域 行不通）
    //        '/': {
    //        target: 'localhost:8080', // 我们要代理的地址
    //        changeOrigin: true, // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
    //         // 路径重写
    //         // 默认的路径：target+baseUrl+apiUrl
    //         // 如：www.baidu.com/api/login，如果后端接口就是该路径，就不用写 pathRewrite
    //        pathRewrite: {
    //            // 重新路由  localhost:8888/api/login  => www.baidu.com/api/login
    //            '^/': '' // 假设我们想把 localhost:8888/api/login 变成www.baidu.com/login 就需要这么做 
    //        }
    //      },
    //    }
    //  }
}
