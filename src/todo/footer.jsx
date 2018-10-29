import '../assets/css/footer.less'

export default {
	data(){
		return {
			author:'jiaozhu'
		}
	},

	render(){
		return (
			<div id="footer">
				<span>Write by {this.author}</span>
			</div>
		)
	}
}
