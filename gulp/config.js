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
    "./src/scripts/content/fleet_command_give_order.js",
    "./src/scripts/content/trade_create_offer.tsx",
    "./src/scripts/content/trades.tsx",
    "./src/scripts/content/messages_events.js",
    "./src/scripts/content/construction.js",
    "./src/scripts/content/alliance_memberlist.js",
    "./src/scripts/content/alliance_showinfo.js",
    "./src/scripts/content/production.js",
    "./src/scripts/content/galaxy_find_user.js",
    "./src/scripts/options/options.tsx",
    "./src/scripts/popup/popup.tsx",
    "./src/scripts/sidebar/sidebar.tsx",
]

export const paths = {
    typeDir: new URL("../src/lib/json/types/", import.meta.url),
    schemaDir: new URL("../src/lib/json/schemas/", import.meta.url),
    validationFile: new URL(
        "../src/lib/json/schemas/validations.js",
        import.meta.url
    ),
    buildDir: new URL("../build/", import.meta.url),
    assetsDir: new URL("../assets/", import.meta.url),
    firefoxPackDir: new URL("../pack/firefox/", import.meta.url),
    chromePackDir: new URL("../pack/chrome/", import.meta.url),
    firefoxRunPackDir: new URL("../pack/firefox-run/", import.meta.url),
    chromeRunPackDir: new URL("../pack/chrome-run/", import.meta.url),
    distDir: new URL("../dist/", import.meta.url),
}
