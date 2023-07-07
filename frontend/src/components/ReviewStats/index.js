import { useSelector } from "react-redux"

function ReviewStats() {
    const spot = useSelector(state => state.spots.singleSpot)
    return (
        <div className="review-stats">
            <i className="fa-solid fa-star" key={spot.id}></i>{(parseInt(spot.avgStarRating?.toFixed(1)) === 0 || spot.avgStarRating === null) ? `New` : spot.avgStarRating?.toFixed(1)} {spot.numReviews !== 0 ? '•' : null} {spot.numReviews === 0 ? null : spot.numReviews === 1 ? `1 Review` : `${spot.numReviews} Reviews`}
        </div>
    )
}

export default ReviewStats
