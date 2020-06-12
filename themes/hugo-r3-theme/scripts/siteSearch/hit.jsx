import React from "react";
import PropTypes from "prop-types";
import Section from "./section.jsx";

let keyword_to_icon = {
    "cordapp": "cordapp.png",
    "database": "database.png",
    "mysql": "database.png",
    "postgres": "database.png",
    "oracle": "database.png",
    "h2": "database.png",
    "azure": "cloud.png",
    "kubernetes": "cloud.png",
    "docker": "cloud.png",
    "firewall": "firewall.png",
    "consensus": "consensus.png",
    "privacy": "privacy.png",
    "contract": "contract.png",
    "token": "token.png",
    "transaction": "transaction.png",
    "security": "security.png",
    "flow": "additional.png",
    "interop": "interoperability.png",
    "network": "network.png",
    "testnet": "network.png",
    "toolkit": "toolkit.png",
    "finance": "capitalmarkets.png",
};

/// This is returns the a hit from the search results.
export default class Hit extends React.Component {
    constructor(props) {
        super(props);
    }

    lvl0() {
        return (
            <a href={this.props.hit.url}>
                <p className="r3-search-title">{this.props.hit.hierarchy.lvl0}</p>
            </a>);
    }

    lvl1() {
        let lvl1 = <p></p>;

        if (this.props.hit.hierarchy.lvl1 !== null) {
            lvl1 = <p className="text-base font-semibold">{this.props.hit.hierarchy.lvl1}</p>;
        }
        return lvl1;
    }

    content() {
        let content = <p></p>;
        if (this.props.hit.content !== null) {
            content = <p className="r3-search-read-more">{this.props.hit.content}</p>;
        }
        return content;
    }

    label() {
        return (
            <span className="r3-search-label">
                <Section project={this.props.hit.project} version={this.props.hit.version} />
            </span>
        );
    }

    thumbnail() {
        let title = this.props.hit.hierarchy.lvl0.toLowerCase();
        var icon = "corda-rocket.png";
        for (var keyword in keyword_to_icon) {
            if (title.includes(keyword)) {
                icon = keyword_to_icon[keyword];
                break;
            }
        }
        let url = "/images/png/icons/" + icon;
        return (
            <img className="r3-search-thumbnail" src={url} alt={icon} />
        );
    }

    render() {
        console.log(this.props);

        return (
            <div className="d-flex flex-row">
                <div>
                    {this.thumbnail()}
                </div>
                <div>
                    {this.lvl0()}
                    {this.lvl1()}
                    {this.content()}
                    {this.label()}
                </div>
            </div>
        );
    }
}

Hit.propTypes = {
    hit: PropTypes.object
};
