

const search = instantsearch({
    appId: "UX2KMUWFAL",
    apiKey: "1fe3367db02689b4aeebc59efad5abaf",
    indexName: "docs.corda.net",
    searchParameters: {
        hitsPerPage: 10,
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
            item: function (hit) {
                var project = "Corda"
                if (hit.project != null) {
                    if (hit.project == "corda-enterprise") project = "Corda Enterprise";
                    if (hit.project == "corda-os") project = "Corda Open Source";
                    if (hit.project == "cenm") project = "Corda Enterprise Network Manager";
                    if (hit.version != null) project = project + " " + hit.version;
                }

                var result = "<p><span style='font-size: larger'><a href='" + hit.url + "' >" + hit.hierarchy.lvl0 + "</a></span> "
                + "<span style='font-size: smaller'>(" + project + ")</span></p>";

                if (hit.hierarchy.lvl1 !== null) {
                    result = result + "<p style='font-size: smaller'>" + hit.hierarchy.lvl1 + "</p>";
                } else {
                    result = result + "<p style='font-size: smaller'>...</p>";
                }
                return result;
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

