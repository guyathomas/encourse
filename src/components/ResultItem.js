const ResultItem = (props) => {
	return (
		<div className="col-sm-4">
			<div className="card">
				<img className="card-img-top" src={props.result.image} alt="Card image cap"/>
				<div className="card-block">
					<div className="card-title"><h4>{props.result.title}</h4></div>
					<div className="card-text">{props.result.description}</div>
					<div className="quickInfo">
						<div>{"Difficulty: " + props.result.difficulty}</div>
						<div>{"Duration: " + props.result.duration}</div>
					</div>
					<a href={props.result.link} className="learn-more btn btn-primary active" role="button">Learn More</a>
				</div>
			</div>
		</div>
	)
}

window.ResultItem = ResultItem;