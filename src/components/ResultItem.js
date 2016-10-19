const ResultItem = (props) => {
	return (
		<div className="col-md-4">
			<div><a href={props.result.link}><h3>{props.result.title}</h3></a></div>
			<div className="lead">{props.result.description}</div>
			<div className="quickInfo">
				<div>{"Difficulty: " + props.result.difficulty}</div>
				<div>{"Duration: " + props.result.duration}</div>
			</div>
			<a href={props.result.link} className="learn-more btn btn-primary active" role="button">Learn More</a>
		</div>
	)
}

window.ResultItem = ResultItem;