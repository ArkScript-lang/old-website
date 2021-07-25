(async function() {
    let data = await fetch("/projects.json");
    let projects = await data.json();

    projects.forEach(data => {
        let a = document.createElement("a");
        a.href = `https://${data.platform}.com/${data.author}/${data.name}`;
        a.target="_blank";
        a.textContent = data.name;

        let img_release = document.createElement("img");
        img_release.alt = "version";
        img_release.src = `https://img.shields.io/${data.platform}/v/release/${data.author}/${data.name}?include_prereleases&style=flat-square&logo=github`;

        let img_stars = document.createElement("img");
        img_stars.alt = "${data.platform} Repo stars";
        img_stars.src = `https://img.shields.io/${data.platform}/stars/${data.author}/${data.name}?include_prereleases&style=flat-square&logo=github`;

        let nbsp = document.createElement("span");
        nbsp.innerHTML = "&nbsp;";

        let div = document.createElement("div");
        div.appendChild(img_release);
        div.appendChild(nbsp);
        div.appendChild(img_stars);

        let h3 = document.createElement("h3");
        h3.appendChild(a);

        let p = document.createElement("p");
        p.innerHTML = `${data.description} By <a href="https://${data.platform}.com/${data.author}" target="_blank">@${data.author}</a>.`;

        let inner_section = document.createElement("div");
        inner_section.classList.add("inner-section");
        inner_section.appendChild(h3);
        inner_section.appendChild(div);
        inner_section.appendChild(p);

        let listing = document.getElementById("listing");
        listing.appendChild(inner_section);
    });
})();