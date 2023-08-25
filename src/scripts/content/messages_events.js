function l() {
    const spam_events_checkboxes = Array.from(
        document.querySelectorAll("td.first a[href*='msgId']")
    ).map(
        (e) =>
            e.parentElement.previousElementSibling.previousElementSibling
                .children[0]
    )
    spam_events_checkboxes.forEach((e) => (e.checked = !0))
    document.querySelector("input[name^='delete[']:checked") !== null &&
        document.querySelector("form[name='formular']").submit()
}
const t = document.createElement("a"),
    r = document.createElement("span")
r.innerText = " ] [ "
t.onclick = l
t.href = "#"
t.innerText = "Delete Spam"
const n = document.querySelector("td[align='right'] table td[align='right']")
n.insertBefore(r, n.children[0])
n.insertBefore(t, r)
