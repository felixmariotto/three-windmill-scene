const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

//

module.exports = env => {

	let mode = "development";
	let devtool = 'eval-source-map';
	let minimize = false;

	// Prod environment
	if ( env.NODE_ENV === 'prod' ) {
		devtool = false;
		// comment these two lines out to keep Webpack from minimizing the code :
		minimize = true;
		mode = 'production';
	};

	return {

		mode: mode,

		entry: {
			'bundle': './src/index.js',
		},

		output: {
			filename: '[name].js',
		}, 

		devServer: {
			contentBase: './dist'
		},

		optimization: {
			minimize: minimize
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: './src/template.html',
				inject: false
			})
		],

		devtool: devtool,

		module: {

			rules: [

				{
					test: /\.(png|jpg|svg|glb|txt|ogg|mp3)$/,
					use: [
						'file-loader',
					],
				},

				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},

			],

		}

	}

};
