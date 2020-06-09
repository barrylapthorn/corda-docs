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
        let lvl0 = <p className="text-base">{this.props.hit.hierarchy.lvl0}</p>;
        return (

            <a href="{this.props.hit.url}">
            <div>
                <Section project={this.props.hit.project} version={this.props.hit.version} />
                {lvl0}
                {lvl1}
            </div>
            </a>
        );
    }
}

Hit.propTypes = {
    hit: PropTypes.object
};
