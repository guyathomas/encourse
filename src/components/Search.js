const Search = (props) => {
	var updateResults = function(e) {

		var searchQuery = e.target.value;
		props.updateResults(searchQuery);
		console.log(searchQuery);


		fetch('/search', {
			method: 'post',
			body: JSON.stringify({query: searchQuery})
		})
		.then(function(res){
			console.log('the response was ', res);
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