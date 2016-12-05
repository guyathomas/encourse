const Results = (props) => {
	return (
		<div id="results">
			{props.results.map(result => <ResultItem result={result}/>)}
		</div>
	)
}

window.Results = Results;