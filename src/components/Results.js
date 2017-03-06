const Results = (props) => {
	if (props.results.length > 0) {
		return (
			<div id="results">
				{props.results.map(result => <ResultItem result={result}/>)}
			</div>
		)
	} else {
		return (
			<div className='no-results'>
				No courses found for '{props.searchQuery}'
			</div>
			)
	}
	
}

window.Results = Results;