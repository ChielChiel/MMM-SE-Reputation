# MMM-SE-Reputation

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

See your reputation of a StackExchange site on your MagicMirror

## Using the module

### Authenticate
First of all you should authenticate this module to read your reputation.
You can authenticate by going to this url:
https://stackoverflow.com/oauth/dialog/?client_id=18128&scope=private_info,no_expiry&redirect_uri=https://chielchiel.github.io/MMM-SE-Reputation/

After authentication and redirects you will see your code. Copy that code and paste it in the `config` below:

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-SE-Reputation',
            config: {
                authCode: "", //Authentication code retrieved from the url above.
                userId: "8902440", //User id of the site
                updateInterval: 15 * 60 * 1000, //How many milliseconds to a new update
            	  site: "stackoverflow", //can be any StackExchange site
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `option1`        | *Required* DESCRIPTION HERE
| `option2`        | *Optional* DESCRIPTION HERE TOO <br><br>**Type:** `int`(milliseconds) <br>Default 60000 milliseconds (1 minute)
