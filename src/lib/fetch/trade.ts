import { IResources } from "../json/types/Resources.js"

export type TradeTradeCheckProps = {
    url: string
    data: {
        target: string
        trade_comment: string
        tf_res: IResources
        tt_res: IResources
    }
}

export type TradeTradeCheckReturn = {
    url: string
    formdata: FormData
    ok: boolean
    errorMsg: string
}

export const fetchTradeTradeCheck = async ({
    url,
    data,
}: TradeTradeCheckProps) => {
    const formData = new FormData()
    formData.append("target", data.target)
    formData.append("trade_comment", data.trade_comment)
    formData.append("tf_res[0]", data.tf_res.fe.toString())
    formData.append("tf_res[1]", data.tf_res.kr.toString())
    formData.append("tf_res[2]", data.tf_res.fr.toString())
    formData.append("tf_res[3]", data.tf_res.or.toString())
    formData.append("tf_res[4]", data.tf_res.fo.toString())
    formData.append("tf_res[5]", data.tf_res.go.toString())
    formData.append("tt_res[0]", data.tt_res.fe.toString())
    formData.append("tt_res[1]", data.tt_res.kr.toString())
    formData.append("tt_res[2]", data.tt_res.fr.toString())
    formData.append("tt_res[3]", data.tt_res.or.toString())
    formData.append("tt_res[4]", data.tt_res.fo.toString())
    formData.append("tt_res[5]", data.tt_res.go.toString())
    const response = await fetch(url, { method: "POST", body: formData })

    if (!response.ok || !response.body) throw new Error("fetch failed")

    const parser = new DOMParser()
    const dom = parser.parseFromString(await response.text(), "text/html")
    const form = dom.forms.namedItem("formular")
    if (!form) throw new Error("formular not found")
    const ret = {
        url: new URL(form.action),
        formdata: new FormData(),
        ok: false,
        errorMsg: "",
    }
    ret.formdata.append(
        "f_res",
        (form.elements.namedItem("f_res") as HTMLInputElement).value
    )
    ret.formdata.append(
        "t_res",
        (form.elements.namedItem("t_res") as HTMLInputElement).value
    )
    ret.formdata.append(
        "target",
        (form.elements.namedItem("target") as HTMLInputElement).value
    )
    ret.formdata.append(
        "trade_comment",
        (form.elements.namedItem("trade_comment") as HTMLInputElement).value
    )

    if (dom.querySelector("form > table > tbody > tr:last-child > td > a")) {
        ret.ok = true
        return ret
    }

    ret.errorMsg = (
        dom.querySelector(
            "form > table > tbody > tr:last-child > td"
        ) as HTMLElement
    ).innerText.trim()
    if (ret.errorMsg == "") {
        ret.errorMsg = (
            dom.querySelector(
                "form > table > tbody > tr:nth-child(3) > td:nth-child(2)"
            ) as HTMLElement
        ).innerText.trim()
    }

    return ret
}
