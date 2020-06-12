import React from "react";
import PropTypes from "prop-types";

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Configure, Pagination, Hits, Panel } from 'react-instantsearch-dom';
import Hit from "./hit.jsx";

const searchClient = algoliasearch('UX2KMUWFAL', '1fe3367db02689b4aeebc59efad5abaf');

let attrs = ["language", "version", "project", "url", "content", "hierarchy", "anchor"];

// https://www.algolia.com/doc/api-reference/widgets/configure/react/
export default class App extends React.Component {
    constructor() {
        super();
    }
    render() {
        // let d = { "query": this.props.query };
        return (
            <Panel>
                <InstantSearch
                    searchClient={searchClient}
                    indexName="docs.corda.net">
                    <SearchBox />
                    <Configure
                        hitsPerPage={5}
                        attributesToRetrieve={attrs}
                    />
                    <Pagination />
                    <Hits hitComponent={Hit} />
                </InstantSearch>
            </Panel>
        );
    }
}


App.propTypes = {
    query: PropTypes.string
};
