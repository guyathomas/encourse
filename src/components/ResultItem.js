const ResultItem = (props) => {
	return (
		<div className="result">
			<img src={props.result.image} alt="Card image cap"/>
			<div >
				<div><h4>{props.result.title}</h4><b>{props.result.platform}</b></div>
				<div className="description">{props.result.description}</div>
				<div className="details">
					<div><b>Difficulty: </b>{props.result.difficulty} </div>
					<div><b>Duration: </b>{props.result.duration} </div>
				</div>
				<div className="center-wrapper">
					<a className="learn-more" href={props.result.link} role="button">Learn More</a>
				</div>
			</div>
		</div>
	)
}

window.ResultItem = ResultItem;