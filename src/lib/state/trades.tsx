import { useEffect, useState } from "react"
import { TTrades } from "../json/types/Trades.js"
import { StorageArea } from "../StorageArea.js"

export const useTrades = () => {
    const [trades, setTrades] = useState<TTrades>([])

    const updateTrades = async () => {
        const trades = await StorageArea.currentId.trades.tryGet([])
        trades.forEach((trade) => {
            trade.date = new Date(trade.date)
            if (trade.concludedAt) {
                trade.concludedAt = new Date(trade.concludedAt)
            }
        })

        trades.sort((a, b) => {
            if (a.concludedAt && !b.concludedAt) return 1
            if (!a.concludedAt && b.concludedAt) return -1
            if (a.concludedAt && b.concludedAt)
                return (
                    (a.concludedAt.getTime() ?? 0) -
                    (b.concludedAt.getTime() ?? 0)
                )
            if (!a.date && !b.date) return 0
            if (!a.date) return -1
            if (!b.date) return 1
            return a.date.getTime() - b.date.getTime()
        })

        setTrades(trades)
    }

    useEffect(() => {
        updateTrades()
        const unsubscribe = StorageArea.currentId.trades.subscribe(updateTrades)
        return () => {
            unsubscribe()
        }
    }, [])

    return trades
}
