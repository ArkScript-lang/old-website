let lineChart = null
let languages = {}

async function fetchLanguage(language, transform) {
    let response = await fetch(`https://raw.githubusercontent.com/ArkScript-lang/benchmarks/master/data/${language}.json`)
    let json = await response.json()
    let output = Object.fromEntries(
        Object.entries(json).map(
            ([k, v], _) => [k, v.map((x, i) => transform(x, i))]
        )
    )
    return output
}

function computeDatasets(quantity) {
    let competing = Object.keys(languages)
    competing.splice(competing.indexOf("arkscript"), 1)

    let relative_datasets = []
    for (let lang of competing) {
        // deepcopy to avoid modifying the original data
        let dataset = JSON.parse(JSON.stringify(languages["arkscript"]))

        let competing_dataset = languages[lang]

        dataset = Object.fromEntries(
            Object.entries(dataset).map(
                ([k, v], _) => {
                    let prefix = k.split("-")[0]
                    // TODO: this might be a problem if we have multiple tests starting with the same name
                    // and we can't accurately pick the right one here
                    // NOTE: hashes of tests depends on the source file, so the test name is different between
                    // arkscript and other languages, hence the weird hack here
                    let test_name = Object.keys(competing_dataset).filter(k => k.includes(prefix))[0]

                    return [
                        k,
                        v.map((x, i) => {
                            return {
                                x: new Date(x.date).getTime(),
                                y: x.mean / competing_dataset[test_name][i].mean,
                            }
                        }),
                    ]
                }
            )
        )

        for (let test in dataset) {
            let data = quantity !== null ? dataset[test].slice(-quantity) : dataset[test]
            relative_datasets.push({
                label: `ArkScript / ${lang} - ${test.split("-")[0]}`,
                data: data,
                showLine: true,
            })
        }
    }

    return relative_datasets
}

async function showGraph(quantity = null) {
    if (lineChart !== null)
        lineChart.destroy()

    lineChart = new Chart("linechart", {
        type: "line",
        data: {
            datasets: computeDatasets(quantity),
        },
        options: {
            responsive: true,
            tooltips: {
                mode: "index",
                intersect: false,
            },
            hover: {
                mode: "nearest",
                intersect: true,
            },
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "day",
                    },
                },
            },
        },
    })
}

window.onload =  async () => {
    languages["arkscript"] = await fetchLanguage("arkscript", x => x)
    languages["python"] = await fetchLanguage("python", x => x)
    languages["lua"] = await fetchLanguage("lua", x => x)
    languages["node"] = await fetchLanguage("node", x => x)
    languages["ruby"] = await fetchLanguage("ruby", x => x)
    languages["wren"] = await fetchLanguage("wren", x => x)
    showGraph()

    document.getElementById("data-quantity").addEventListener('change', function() {
        if (this.value === 'all') {
            showGraph()
        } else if (this.value === '100elem') {
            showGraph(100)
        } else if (this.value === '30elem') {
            showGraph(30)
        } else if (this.value === '10elem') {
            showGraph(10)
        }
    })
}
