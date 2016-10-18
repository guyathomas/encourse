const Search = (props) => {
	var updateResults = function(e) {

		var searchQuery = e.target.value;

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


	return (<div>
				<input 
					type="text" 
					placeholder="What do you want to learn?" 
					onChange={updateResults}
				/>
	        </div>
	        );
}

window.Search = Search;