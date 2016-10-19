const Results = (props) => {
	
	var getIcon = function(brand) {
		if (brand === 'udemy') {
			return '../assets/logos/udemy.png'
		} else if (brand === "udacity") {
			return '../assets/logos/udacity.png'
		}
	}

	return (
		<div className="container">
			{props.results.map(result => <ResultItem result={result} getIcon={getIcon} />)}
		</div>
	)
}

window.Results = Results;