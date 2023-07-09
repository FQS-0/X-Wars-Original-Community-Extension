setTimeout(function () {
    document.dispatchEvent(
        new CustomEvent("xwo_access_resources", {
            detail: {
                amount: resources, // eslint-disable-line no-undef
                perSecond: rps, // eslint-disable-line no-undef
                max: rm, // eslint-disable-line no-undef
            },
        })
    )
}, 0)
