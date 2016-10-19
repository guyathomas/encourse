const Results = (props) => {
	return (
		<div className="container">
			{props.results.map(result => <ResultItem result={result}/>)}
		</div>
	)
}

window.Results = Results;