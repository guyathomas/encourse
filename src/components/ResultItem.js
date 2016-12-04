const ResultItem = (props) => {
	return (
		<div>
			<div>
				<img src={props.result.image} alt="Card image cap"/>
				<div >
					<div><h4>{props.result.title}</h4><b>{props.result.platform}</b></div>
					<div>{props.result.description}</div>
					<div>
						<div><b>Difficulty: </b>{props.result.difficulty} </div>
						<div><b>Duration: </b>{props.result.duration} </div>
					</div>
					<a href={props.result.link} role="button">Learn More</a>
				</div>
			</div>
		</div>
	)
}

window.ResultItem = ResultItem;