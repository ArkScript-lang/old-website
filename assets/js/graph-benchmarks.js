let lineChart = null
let barCharts = {}
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

function getQuantity(arr, quantity) {
    return quantity !== null ? arr.slice(-quantity) : arr
}

function computeRelativeDatasets(quantity) {
    let competing = Object.keys(languages)
    competing.splice(competing.indexOf("arkscript"), 1)

    let output_datasets = []
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
            let data = getQuantity(dataset[test], quantity)
            output_datasets.push({
                label: `ArkScript / ${lang} - ${test.split("-")[0]}`,
                data: data,
                showLine: true,
            })
        }
    }

    return output_datasets
}

function computeDatasetsWithMostRecent() {
    let competing = Object.keys(languages)
    competing.splice(competing.indexOf("arkscript"), 1)

    let dataset = JSON.parse(JSON.stringify(languages["arkscript"]))
    // test_name => {lang -> [...]}
    let tests_to_lang = Object.fromEntries(
        Object.entries(dataset).map(
            ([k, v], _) => {
                let prefix = k.split("-")[0]
                return [prefix, {arkscript: v.at(-1).mean}]
            }
        )
    )

    for (let lang of competing) {
        let competing_dataset = languages[lang]
        for (let test in competing_dataset) {
            let test_name = test.split("-")[0]
            if (tests_to_lang.hasOwnProperty(test_name)) {
                tests_to_lang[test_name][lang] = competing_dataset[test].at(-1).mean
            }
        }
    }

    let output = {}
    for (let test_name in tests_to_lang) {
        let res = []

        let test_data = tests_to_lang[test_name]
        for (let lang in test_data) {
            res.push({
                name: lang,
                value: test_data[lang],
            })
        }
        res.sort((a, b) => a.value < b.value)

        let labels = res.map(x => x.name)
        let values = res.map(x => x.value)

        let colors = Array(labels.length).fill('rgba(54, 162, 235)')
        colors[labels.indexOf("arkscript")] = 'rgba(75, 192, 192)'

        output[test_name] = {
            labels: labels,
            datasets: [{
                label: test_name,
                data: values,
                backgroundColor: colors,
            }],
        }
    }
    return output
}

async function showGraph(quantity = null) {
    if (lineChart !== null)
        lineChart.destroy()

    lineChart = new Chart("linechart", {
        type: "line",
        data: {
            datasets: computeRelativeDatasets(quantity),
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

async function showBarGraph() {
    let div = document.getElementById("barcharts")
    div.innerHTML = null

    let datasets = computeDatasetsWithMostRecent()

    for (let test in datasets) {
        let canvas = document.createElement("canvas")
        let key = `barchart-${test}`
        canvas.setAttribute("id", key)
        div.appendChild(canvas)

        if (barCharts.hasOwnProperty(key) && barCharts[key] !== null)
            barCharts[key].destroy()

        barCharts[key] = new Chart(key, {
            type: "bar",
            data: datasets[test],
            options: {
                indexAxis: 'y',
                legend: {
                    display: false,
                },
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                parsing: {
                    yAxisKey: 'name',
                    xAxisKey: 'value',
                },
            },
        })
    }
}

window.onload = async () => {
    languages["arkscript"] = await fetchLanguage("arkscript", x => x)
    languages["python"] = await fetchLanguage("python", x => x)
    languages["lua"] = await fetchLanguage("lua", x => x)
    languages["node"] = await fetchLanguage("node", x => x)
    languages["ruby"] = await fetchLanguage("ruby", x => x)
    languages["wren"] = await fetchLanguage("wren", x => x)

    showGraph()
    showBarGraph()

    document.getElementById("data-quantity").addEventListener('change', function () {
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
