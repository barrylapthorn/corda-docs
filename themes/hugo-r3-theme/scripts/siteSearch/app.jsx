import React from "react";
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Configure, Pagination, Hits, Panel } from 'react-instantsearch-dom';
import Hit from "./hit.jsx";

const searchClient = algoliasearch('UX2KMUWFAL', '1fe3367db02689b4aeebc59efad5abaf');

let attrs = ["language", "version", "project", "url", "content", "hierarchy", "anchor"];

// https://www.algolia.com/doc/api-reference/widgets/configure/react/
export const App = () => (
    <Panel>
        <InstantSearch
            searchClient={searchClient}
            indexName="docs.corda.net">
            <SearchBox />
            <Configure hitsPerPage={7} attributesToRetrieve={attrs}/>
            <Pagination />
            <Hits hitComponent={Hit} />
        </InstantSearch>
    </Panel>
);
