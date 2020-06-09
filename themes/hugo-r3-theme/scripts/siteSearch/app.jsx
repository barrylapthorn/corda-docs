import React from "react";
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';
import Hit from "./hit.jsx";

const searchClient = algoliasearch('UX2KMUWFAL', '1fe3367db02689b4aeebc59efad5abaf');

export const App = () => (
  <InstantSearch searchClient={searchClient} indexName="docs.corda.net">
    <SearchBox />
    <Hits hitComponent={Hit} />
    </InstantSearch>
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
