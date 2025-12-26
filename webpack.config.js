import path from "path";

const __dirname = path.resolve();

export default {
	entry: './sketch/dev.ts',
	mode: 'development',
	output: {
		filename: 'bundle.js',
		path: path.join(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	devServer: {
		open: false,
		static: {
			directory: path.join(__dirname, 'dist'),
		},
		compress: true,
		port: 9000,
		hot: true,
		client: {
			logging: 'none',
		},
	}
};
