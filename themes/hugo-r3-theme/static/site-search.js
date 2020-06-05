

const search = instantsearch({
  appId: "UX2KMUWFAL",
  apiKey: "1fe3367db02689b4aeebc59efad5abaf",
  indexName: "docs.corda.net",
  searchParameters: {
    hitsPerPage: 20,
    attributesToSnippet: ["description:24"],
    snippetEllipsisText: " [...]"
  }
});

search.addWidget(
  instantsearch.widgets.searchBox({
    container: "#searchbox",
    placeholder: "Search Corda documentation",
    autofocus: false
  })
);
search.addWidget(
  instantsearch.widgets.hits({
    container: "#hits",
    templates: {
      empty: "No results.",
      item: function(hit) {
          console.log(hit);

        return hit;
      }
    }
  })
);

search.addWidget(
  instantsearch.widgets.pagination({
    container: '#pagination',
    maxPages: 20
  })
);

search.start();

