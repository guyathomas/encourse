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
				<h1>Search MOOC's</h1>
				<Search updateResults={this.updateResults.bind(this)}/>
				<Prefs />
				<Results results={this.state.filteredResults}/>
			</div>
		);
	}
}

window.App = App;