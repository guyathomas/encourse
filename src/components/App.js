class App extends React.Component {
	constructor() {
		super(),

		this.state = {
			searchArray: '',
			data: window.shortData,
			filteredResults: []
		};
	}

	updateResults(searchArray) {
		this.setState(
			{searchArray: searchArray}
		)
		console.log(searchArray)
	}

	render() {
		return (
			<div>
				<h1>Search MOOC's</h1>
				<Search updateResults={this.updateResults.bind(this)}/>
				<Prefs />
				<Results results={this.state.results}/>
			</div>
		);
	}
}

window.App = App;