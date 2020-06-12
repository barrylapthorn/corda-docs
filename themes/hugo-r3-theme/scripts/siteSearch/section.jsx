import React from "react";
import PropTypes from "prop-types";

class Project extends React.Component {
    _readable(s) {
        switch(s) {
            case "corda-enterprise": return "Corda Enterprise";
            case "corda-os": return "Corda Open Source";
            case "cenm": return "Corda Enterprise Network Manager";
        }
        return s;
    }
    render() {
        return (
            <span>{this._readable(this.props.project)}</span>
        );
    }
}

Project.propTypes = {
    project: PropTypes.string
};

export default class Section extends React.Component {
    render() {
        return (
            <span><Project project={this.props.project} /> {this.props.version}</span>
        );
    }
}

Section.propTypes = {
    project: PropTypes.string,
    version: PropTypes.string
};
