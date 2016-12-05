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
				<Header />
				<div className={"hero-container" + (this.state.searchQuery ? '' : ' fullscreen')}>
					<div className="hero">
						<h1>Search Udemy, Udacity, edX & Cousera in one place</h1>
						<Search updateResults={this.updateResults.bind(this)}/>
					</div>
				</div>
				<Results results={this.state.filteredResults}/>
			</div>
		);
	}
}

window.App = App;