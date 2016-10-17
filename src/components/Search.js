const Search = (props) => {
	
	var updateResults = function(e) {
		var searchArray = e.target.value.split(' ');
		props.updateResults(searchArray);
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

 var result = relevance({
    query: ['html', 'css'],
    data: data,
