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
	}

	render() {
		return (
			<div className="app-container">
				<div className="hero-container">
					<div className="hero">
						<h1>Learn More, In Less Time</h1>
						<Search updateResults={this.updateResults.bind(this)}/>
					</div>
				</div>
				<Results results={this.state.filteredResults}/>
			</div>
		);
	}
}

window.App = App;