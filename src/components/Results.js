const Results = (props) => {
	return (
		<div>
			{props.results.map(result => <ResultItem result={result}/>)}
		</div>
	)
}

window.Results = Results;