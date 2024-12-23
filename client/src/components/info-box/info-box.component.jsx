import React from 'react'
import './info-box.styles.scss'

const InfoBox = ({ item }) => {
    return (
        <div className="info-box">
            <h3>{item.location}</h3>
            <span className="temp">{Number(item.temperature).toFixed(1)} &#8457;</span>
            <span className="humid">{Number(item.humidity).toFixed(1)} %</span>
        </div>
    )
}

export default InfoBox