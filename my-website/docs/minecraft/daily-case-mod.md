# Daily Case Mod

![Daily Case Mod](https://105936045-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FxZch7KRqvxMrsxb9MUy4%2Fuploads%2Fu6ABcXsa4u51RojS5nrp%2Fminecraft_title3.png?alt=media&token=f9e65008-1674-49b2-bf78-e1c59103a332)

Welcome to the documentation for Daily Case Mod. This mod adds a system of daily rewards and purchasable crates to Minecraft servers, which can be fully customized through configuration files.

## Overview

- **Daily Case**: Players can open one case for free once per day (based on a server-side cooldown).
- **Shop boxes**: Various boxes can be purchased in the shop with emeralds or other items and opened.
- **In-game preview**: Players can right-click on a chest to see its possible contents before opening it.
- **Quick opening**: The box opens quickly with a short animation effect.
- **Highly configurable**: All aspects of the boxes (prices, odds, contents) can be customized via JSON and TOML files.
- **Multiple languages**: The user interface adapts to the client language (English, German, and we are working on more).

## Installation

1. Ensure that the appropriate Forge or NeoForge version is running on your server (1.20.1).
2. Download the `.jar` file for the Daily Case Mod.
3. Place the file in the `mods` folder of your server and clients.
4. Restart the server (or client). When starting for the first time, the default configuration files are created in the `config/daily_case/` folder.

:::danger Important
In order for the daily cooldown to be saved correctly, the server must be shut down properly (not terminated abruptly).
:::

## Configuration

The mod is configured via files in the `config/daily_case/` folder.

### daily_case-common.toml

```toml
# Whether a message should be logged via a sample block (Dirt) (for debugging purposes)
logDirtBlock = true

# A magic number (currently without game functionality, probably also for debugging)
# Range: > 0
magicNumber = 42

# Introductory text for the magic number (output in logs)
magicNumberIntroduction = "The magic number is... "

# Cooldown time in hours between daily spins
# Range: 1 ~ 168 (corresponds to 1 week)
dailyCooldownHours = 1

# A list of items to be logged at startup (for debugging purposes)
items = ["minecraft:iron_ingot"]
```

#### Explanation of options

- **`logDirtBlock`**: If `true`, a message about a dirt block is written to the log file when the game starts. Can be set to `false`.
- **`magicNumber`**: Any numerical value. Currently, this has no effect on the mod's gameplay.
- **`magicNumberIntroduction`**: A text that is written to the log file together with `magicNumber`. Can be changed.
- **`dailyCooldownHours`**: Determines how many hours a player must wait before they can open the daily chest again. The default is 1 hour, and the maximum value is 168 (7 days).

### case.json

This file defines all available crates, their respective properties, and contents. Each crate has its own definition within this main file.

```json
{
  "daily": {
    "id": "daily",
    "rarityChances": {
      "legendary": 0.01,
      "epic": 0.04,
      "rare": 0.15,
      "uncommon": 0.3,
      "common": 0.5
    },
    "cooldownHours": 24,
    "priceEmeralds": 0,
    "priceItemId": "",
    "priceItemCount": 0,
    "shopItemId": "minecraft:chest",
    "availableInShop": false,
    "items": [
      {
        "id": "minecraft:iron_ingot",
        "rarity": "common",
        "weight": 50,
        "minCount": 1,
        "maxCount": 3,
        "enchantments": ["minecraft:sharpness:1"]
      }
      // More items...
    ]
  },
  "premium": {
    // Further box definitions...
  }
}
```

#### Structure of a box

Each box is an object within the main JSON structure, where the name of the object (e.g., `"daily"`) is the internal `id` value of the box.

- **`id`** (string): A unique internal name for the box (e.g., `daily`, `premium`). Used internally by the mod.
- **`rarityChances`** (object): Defines the base probability that an item of a certain rarity level will be selected. The values must be decimal numbers between 0 and 1 (e.g., `0.01` for 1%). The sum of all probabilities should equal 1.0 (e.g., `0.01 + 0.04 + 0.15 + 0.3 + 0.5 = 1.0`). There are five clearly defined rarities: `legendary`, `epic`, `rare`, `uncommon`, `common`.
- **`cooldownHours`** (Integer): Only relevant for boxes that are not the daily box (i.e., only shop boxes). Determines how many hours a player must wait before they can open this specific shop crate again. `0` means no cooldown. Instead, the value from `daily_case-common.toml` is used for the daily box.
- **`priceEmeralds`** (Integer): Price in emeralds to purchase this chest. `0` means no emeralds are required.
- **`priceItemId`** (string): Alternative item ID that is accepted as payment (e.g., `minecraft:diamond`). Leave blank (`""`) if only emeralds are to be used.
- **`priceItemCount`** (Integer): Number of alternative items required as payment.
- **`shopItemId`** (string): The item that is displayed in the shop GUI as an icon for this chest (e.g., `minecraft:ender_chest` for a premium chest).
- **`availableInShop`** (Boolean): `true`: This box is available in the shop. `false`: This crate is not available in the shop (e.g., the daily crate).
- **`items`** (Array of Objects): Defines the list of possible rewards inside this chest. Each element is an object with the format described under [Items Format](https://minecraft-ids.grahamedgecombe.com/).

### Items-Format (items.json)

This file (`items.json`) is not directly part of the main configuration `case.json`, but shows the internal format you must use for the items list of each box in `case.json`.

```json
[
  {
    "id": "minecraft:iron_ingot",
    "rarity": "common",
    "weight": 50,
    "minCount": 1,
    "maxCount": 3,
    "enchantments": ["minecraft:sharpness:1"] // Optional!
  },
  {
    "id": "minecraft:gold_ingot",
    "rarity": "common",
    "weight": 35,
    "minCount": 1,
    "maxCount": 3
  }
  // More item definitions...
]
```

#### Structure of an item

- **`id`** (string): The Minecraft ID of the item (e.g., `minecraft:diamond`, `minecraft:iron_sword`).
- **`rarity`** (string): The rarity of this specific item. Must match one of the values from `rarityChances` of the surrounding chest (`legendary`, `epic`, `rare`, `uncommon`, `common`).
- **`weight`** (integer): The weight influences the relative probability with which this specific item is selected within its own level. A higher weighting means a higher chance.
- **`minCount`** (Integer): Minimum number of items given as a reward.
- **`maxCount`** (integer): Maximum number of items given as a reward.
- **`enchantments`** (array of strings - optional): If the item is to be enchanted, enter a list of enchantments here. Format: "`modid:enchantment_id:level`" (e.g., "`minecraft:sharpness:5`"). This is optional.

#### Example: Add new box

```json
{
  // Existing boxes such as "daily," "premium," etc. will remain unchanged...

  "special": { // Internal ID of the new box
    "id": "special",
    "rarityChances": {
      "legendary": 0.05,
      "epic": 0.15,
      "rare": 0.30,
      "uncommon": 0.30,
      "common": 0.20
    },
    "cooldownHours": 0, // No cooldown for this shop crate
    "priceEmeralds": 50, // Cost: 50 emeralds
    "priceItemId": "", // No alternative payment item
    "priceItemCount": 0,
    "shopItemId": "minecraft:beacon", // Displayed as a beacon in the shop
    "availableInShop": true, // Available in store
    "items": [ // Here comes the list of items in the same format as in items.json
      { "id": "minecraft:ender_pearl", "rarity": "common", "weight": 40, "minCount": 5, "maxCount": 10 },
      { "id": "minecraft:enchanted_golden_apple", "rarity": "rare", "weight": 15, "minCount": 1, "maxCount": 2 },
      { "id": "minecraft:elytra", "rarity": "epic", "weight": 8, "minCount": 1, "maxCount": 1 },
      { "id": "minecraft:dragon_egg", "rarity": "legendary", "weight": 1, "minCount": 1, "maxCount": 1 }
    ]
  }
}
```

After making changes to `case.json`, you must restart the server (and client) for the changes to take effect.

## Use

- **Open menu**: The command or item for opening the main menu (Daily/Shop) will depend on the server setup.
- **Open daily chest**: Select the daily chest from the menu and click on it. Once the cooldown has expired, the chest will open.
- **Buy/open a box in the shop**: Select a shop box. You will see the price. If you have enough, click to buy and open it.
- **Show preview**: Hold Shift and right-click on a box in the menu to see a preview of its possible contents.

## Example Case.json file

Download the complete example file with all predefined boxes (daily, premium, vip, warrior, mage, builder, farmer, nether, end, ocean, mining, redstone, treasure, starter, explorer, adventure, artificer, elemental, enchanted_items):

<div style={{textAlign: 'center', margin: '20px 0'}}>
  <a 
    href="https://files.greenbox.studio/Daily_spin/case.json" 
    download
    style={{
      display: 'inline-block',
      padding: '12px 24px',
      backgroundColor: '#2f7a4f',
      color: 'white',
      textDecoration: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      fontSize: '16px',
      transition: 'background-color 0.3s'
    }}
    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#246339'}
    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2f7a4f'}
  >
    📥 Download case.json
  </a>
</div>
