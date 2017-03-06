const Results = (props) => {
	return (
		<div id="results">
			{props.results.length > 0 ? props.results.map(result => <ResultItem result={result}/>) : 'No courses found for \'' + props.searchQuery + '\''}
		</div>
	)
}

window.Results = Results;