export const entryPoints = [
    "./src/scripts/content/menu.ts",
    "./src/scripts/content/resources.tsx",
    "./src/scripts/content/status.ts",
    "./src/scripts/content/top.ts",
    "./src/scripts/content/bank.tsx",
    "./src/scripts/content/overview.ts",
    "./src/scripts/content/production_list.ts",
    "./src/scripts/content/fleet_movement.ts",
    "./src/scripts/content/fleet_command.js",
    "./src/scripts/content/trade_create_offer.tsx",
    "./src/scripts/content/trades.tsx",
    "./src/scripts/content/messages_events.js",
    "./src/scripts/options/options.tsx",
]

export const paths = {
    typeDir: new URL("../src/lib/json/types/", import.meta.url),
    schemaDir: new URL("../src/lib/json/schemas/", import.meta.url),
    validationFile: new URL(
        "../src/lib/json/schemas/validations.js",
        import.meta.url
    ),
}
