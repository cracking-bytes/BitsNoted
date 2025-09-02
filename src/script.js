let nts = JSON.parse(localStorage.getItem("nts") || "[]");

function savnts() {
    localStorage.setItem("nts", JSON.stringify(nts));
}

// add/edit form
document.getElementById("addn").addEventListener("submit", function (e) {
    e.preventDefault();

    let nid = document.getElementById("nid").value;
    let ttl = document.getElementById("ttl").value;
    let cnt = document.getElementById("cnt").value;
    let cat = document.getElementById("cat").value;
    let tagz = document.getElementById("tags").value.split(",").map(t => t.trim()).filter(t => t);

    if (nid) {
        // upd mote
        let nn = nts.find(x => x.id == nid);
        nn.ttl = ttl; nn.cnt = cnt; nn.cat = cat; nn.tagz = tagz;
        document.getElementById("savbtn").innerText = "Add Note";
        document.getElementById("nid").value = "";
    } else {
        // new note
        let newn = { id: Date.now(), ttl, cnt, cat, tagz, pin: false };
        nts.push(newn);
    }

    savnts();
    shown();
    this.reset();
});

// show all notes
function shown() {
    let box = document.getElementById("ntscon");
    box.innerHTML = "";

    let filcat = document.getElementById("filcat").value;
    let srch = document.getElementById("srch").value.toLowerCase();

    let arr = [...nts].sort((a, b) => b.pin - a.pin);

    arr.forEach(n => {
        if ((filcat === "All" || n.cat === filcat) &&
            (n.ttl.toLowerCase().includes(srch) || n.cnt.toLowerCase().includes(srch))) {

            let card = document.createElement("div");
            card.classList.add("notecard");

            card.innerHTML = `
        <h3>${n.ttl}</h3>
        <p>${n.cnt}</p>
        <span class="category ${n.cat}">${n.cat}</span>
        <div>${n.tagz.map(t => `<span class="tagz">${t}</span>`).join(" ")}</div>
        <button class="vwbtn">View</button>
        <button class="edtbtn">Edit</button>
        <button class="pinbtn">${n.pin ? "Unpin" : "Pin"}</button>
        <button class="delbtn">Del</button>
      `;

            // del
            card.querySelector(".delbtn").addEventListener("click", () => {
                nts = nts.filter(x => x.id !== n.id); savnts(); shown();
            });

            // pin
            card.querySelector(".pinbtn").addEventListener("click", () => {
                n.pin = !n.pin; savnts(); shown();
            });

            // edit
            card.querySelector(".edtbtn").addEventListener("click", () => {
                document.getElementById("ttl").value = n.ttl;
                document.getElementById("cnt").value = n.cnt;
                document.getElementById("cat").value = n.cat;
                document.getElementById("tags").value = n.tagz.join(", ");
                document.getElementById("nid").value = n.id;
                document.getElementById("savbtn").innerText = "Update Note";
                window.scrollTo(0, 0);
            });

            // view
            card.querySelector(".vwbtn").addEventListener("click", () => {
                document.getElementById("popttl").innerText = n.ttl;
                document.getElementById("popcnt").innerText = n.cnt;
                document.getElementById("popup").classList.remove("hide");
            });

            box.appendChild(card);
        }
    });
}

// popup close
document.getElementById("popclose").addEventListener("click", () => {
    document.getElementById("popup").classList.add("hide");
});

// filters
document.getElementById("filcat").addEventListener("change", shown);
document.getElementById("srch").addEventListener("input", shown);

// first show
shown();
