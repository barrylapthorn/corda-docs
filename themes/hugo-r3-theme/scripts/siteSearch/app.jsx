import React from "react";
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Configure, Pagination, Hits, Panel } from 'react-instantsearch-dom';
import Hit from "./hit.jsx";

const searchClient = algoliasearch('UX2KMUWFAL', '1fe3367db02689b4aeebc59efad5abaf');

// https://www.algolia.com/doc/api-reference/widgets/configure/react/
export const App = () => (
    <Panel>
        <InstantSearch searchClient={searchClient} indexName="docs.corda.net">
            <SearchBox />
            <Configure hitsPerPage={10} />
            <Pagination />
            <Hits hitComponent={Hit} />
        </InstantSearch>
    </Panel>
);

//export App;

// export class App extends Component {
//     render() {
//         return (
//         <div>
//             <h1>Hello world from react</h1>
//         </div>
//         );
//     }
// }
