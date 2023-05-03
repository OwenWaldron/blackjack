import React from "react";

export default function Card(props) {
    if (props.hidden) {
        return(
            <div className="card-hidden"></div>
        );
    } else {
        return(
            <div className="card">
                <h2>{props.value}</h2>
            </div>
        );
    }
}
