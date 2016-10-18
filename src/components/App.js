class App extends React.Component {
	constructor() {
		super(),

		this.state = {
			searchQuery: '',
			data: window.shortData,
			filteredResults: []
		};
	}

	updateResults(searchQuery) {
		this.setState(
			{searchQuery: searchQuery}
		)
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