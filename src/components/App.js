class App extends React.Component {
	constructor() {
		super(),

		this.state = {
			searchQuery: '',
			data: window.shortData,
			filteredResults: []
		};
	}

	updateResults(searchQuery, filteredResults) {
		this.setState(
			{searchQuery: searchQuery,
			 filteredResults: filteredResults}
		)
		console.log(this.state);
	}

	render() {
		return (
			<div>
				<div className="jumbotron">
					<h1>Learn More, In Less Time</h1>
					<Search updateResults={this.updateResults.bind(this)} className="jumbo-search" />
				</div>
				<Prefs />
				<Results results={this.state.filteredResults}/>
			</div>
		);
	}
}

window.App = App;