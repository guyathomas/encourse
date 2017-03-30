const Search = (props) => {
	
	var updateResults = function(e) {

		var searchQuery = e.target.value;

		if (searchQuery.length === 0) {
			props.updateResults('', [])
			return
		}

		fetch('/search', {
			method: 'POST',
			body: JSON.stringify({searchQuery: searchQuery}),
			headers: {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
			}
		})
		.then(function(res){
			return res.json();
		})
		.then(function(parsedResults) {
			props.updateResults(searchQuery, parsedResults);
		})
		.catch(function(err) {
			console.log('it returned an error', err);
		})
	}

	var debouncedUpdateResults = _.debounce(updateResults, 500, {trailing: true})

	return (<div>
				<input 
					type="text" 
					placeholder="What do you want to learn?" 
					onChange={debouncedUpdateResults}
					className="search"
				/>
	        </div>
	        );
}

window.Search = Search;