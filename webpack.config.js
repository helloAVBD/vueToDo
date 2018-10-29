const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')//设置html模板
const webpack = require('webpack')
const ExtractPlugin = require('extract-text-webpack-plugin')  //css打包到单独文件


const isDev = process.env.NODE_ENV === 'development'

const config={
	target:'web',
	entry:path.join(__dirname,'src/index.js'),
	output:{
	    filename: 'bundle.[hash:8].js',
	    path: path.join(__dirname, 'dist')
	},
	module:{
		rules:[
			{
				test:/\.vue$/,
				loader:'vue-loader'
			},
			{
				test:/\.jsx/,
				loader:'babel-loader'
			},
			{
				test:/\.(gif|png|jpeg|jpg|svg)$/,
				use:[
					{
						loader:'url-loader',
						options:{
							limit:1024,
							name:'[name].[ext]'
						}
					}
				]
			}
		]
	},
	plugins:[
		new webpack.DefinePlugin({//webpack会根据这个配置，选择打包
			'process.env':{
				NODE_EVN:isDev?'"development"':'"production"'
			}
		}),
		new HTMLPlugin()
	]

}


if(isDev){
	config.module.rules.push(
		{
			test:/\.css$/,
			use:[
				'style-loader',
				'css-loader'
			]
		},
		{
			test:/\.less$/,
			use:[
				'style-loader',
				'css-loader',
				{
					loader:'postcss-loader',
					options:{
						sourceMap:true,
					}
				},
				'less-loader'
			
			]
		}
	)
	config.devtool='#cheap-module-eval-source-map' //方便调试定位
	config.devServer={ //配置开发项的webpack-dev-server
		port:8011,
		host:'0.0.0.0',
		overlay:{
			errors:true,//错误显示在网页上
		},
		//open:true//启动打开浏览器
		hot:true  //启动热加载
	}
	config.plugins.push(
		new webpack.HotModuleReplacementPlugin(),//热加载
		new webpack.NoEmitOnErrorsPlugin()     //去掉不必要的显示
	)
}else{
	config.entry = {
	    app: path.join(__dirname, 'src/index.js'),
	    vendor: ['vue']
	}
	config.output.filename = '[name].[chunkhash:8].js'
	
    config.module.rules.push(
		{
			test:/\.css$/,
			use:ExtractPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader']
			})
		},
	    {
	      	test: /\.less/,
	      	use: ExtractPlugin.extract({
		        fallback: 'style-loader',
		        use: [
		          'css-loader',
		          {
		            loader: 'postcss-loader',
		            options: {
		              sourceMap: true,
		            }
		          },
		          'less-loader'
		        ]
	      	})
	    }
    )
    
  config.plugins.push(
    new ExtractPlugin('styles.[contentHash:8].css'),
    new webpack.optimize.CommonsChunkPlugin({  //框架文件单独打包
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({  //webpack内容单独打包，利于组件缓存
      name: 'runtime'
    })
  )
}


module.exports=config