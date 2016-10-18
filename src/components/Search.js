const Search = (props) => {
	var updateResults = function(e) {

		var searchQuery = e.target.value;
		props.updateResults(searchQuery);

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
			console.log(parsedResults)
		})
		.catch(function(err) {
			console.log('it returned an error', err);
		})

		// $.post( "search", { searchArray: searchArray })
		//   .done(function(data) {
		//     console.log('response data', data)
		//   });
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