# Level File Format

The level file format is a simple text format that describes the layout of a level. The format is a grid of three-character strings representing a entity. Each is separated by a space. Each row is separated by a newline character. 

## Convention
The three characters are split into three parts:
- The first character is the major entity type. This is either a `T` for tile or `E` for entity or `0` for null.
- The second character is the minor entity type. Usually the first letter of the entity name. For example, `B` for brick or `P` for player.
- Represents metadata. For example the player entity has a number to represent the player number. And levers and associated bricks have a number to connect them. For example, `EL1` and `BS1` are connected.

## Entities

List of entities:
- `000` - Empty space
- `TB0` - Brick Tile
- `TW0` - Water Tile
- `TG0` - Grill Tile
- `TO0` - Oil Tile
- `EF0` - Finish Platform
- `EPx` - Player, where `x` is the player number
- `ELx` - Lever facing left, where `x` is the lever number
- `ERx` - Lever facing right, where `x` is the lever number
- `ES0` - Movable Solid Block
- `EBx` - Button, where `x` is the button number
- `ECx` - Collectable, where `x` is the player it is for.