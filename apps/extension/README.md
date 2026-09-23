# Link Overwatch

## Developing

1. Clone the repository `git clone https://github.com/GabenGar/todos`
2. Run `npm install`
3. Run `npm run dev-extension`

## Old Build Command
```json
{
  "build": "webpack --config webpack.prod.mjs && web-ext build --no-config-discovery --config=web-ext-config.mjs --source-dir=build --artifacts-dir=dist"
}
```