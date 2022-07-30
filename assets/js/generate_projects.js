function createImg(alt, src) {
    let img = document.createElement("img");
    img.alt = alt;
    img.src = src;
    return img;
}

function createImgShield(platform, kind, author, repo) {
    if (!["release", "stars"].includes(kind)) {
        return null;
    }

    let slug = "";
    let params = "";
    if (kind === "release") {
        slug = "v/release";
        params = "include_prereleases&logo=github";
    } else {
        slug = kind;
        params = "color=yellow&logo=github";
    }

    return createImg(
        kind,
        `https://img.shields.io/${platform}/${slug}/${author}/${repo}?${params}&style=flat-square`,
    );
}

function createProfileLink(platform, author, repo, text) {
    return `<a target="_blank" href="https://${platform}.com/${author}/${repo}">${text}</a>`;
}

(async function() {
    let data = await fetch("/projects.json");
    let projects = await data.json();

    projects.forEach(data => {
        let img_release = createImgShield(data.platform, "release", data.author, data.name);
        let img_stars = createImgShield(data.platform, "stars", data.author, data.name);

        let nbsp = document.createElement("span");
        nbsp.innerHTML = "&nbsp;";

        let div = document.createElement("div");
        div.appendChild(img_release);
        div.appendChild(nbsp);
        div.appendChild(img_stars);

        let h3 = document.createElement("h3");
        h3.innerHTML = createProfileLink(data.platform, data.author, data.name, data.name);

        let p = document.createElement("p");
        p.innerHTML = `${data.description} By `;
        p.innerHTML += createProfileLink(data.platform, data.author, "", `@${data.author}`);
        data.contributors.forEach((name) => {
            p.innerHTML += ", ";
            p.innerHTML += createProfileLink(data.platform, name, "", `@${name}`);
        });
        p.innerHTML += ".";

        let inner_section = document.createElement("div");
        inner_section.classList.add("inner-section");
        inner_section.appendChild(h3);
        inner_section.appendChild(div);
        inner_section.appendChild(p);

        let listing = document.getElementById("listing");
        listing.appendChild(inner_section);
    });
})();