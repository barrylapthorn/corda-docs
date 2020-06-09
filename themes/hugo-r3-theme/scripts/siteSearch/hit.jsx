import React from "react";
import PropTypes from "prop-types";
import Section from "./section.jsx";

export default class Hit extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        let lvl1 = "";
        if (this.props.hit.hierarchy.lvl1 !== null) {
            lvl1 = <p className="text-sm">{this.props.hit.hierarchy.lvl1}</p>;
        }
        return (
            <a href="{this.props.hit.url}">
            <div>
                <p className="text-base">{this.props.hit.hierarchy.lvl0}</p>
                {lvl1}
                <Section project={this.props.hit.project} version={this.props.hit.version} />
            </div>
            </a>
        );
    }
}

Hit.propTypes = {
    hit: PropTypes.object
};
