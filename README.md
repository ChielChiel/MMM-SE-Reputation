# MMM-SE-Reputation

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Todo: Insert description here!

## Using the module

### Authenticate
First of all you should authenticate this module to read your reputation.
You can authenticate by going to this url:
[https://stackoverflow.com/oauth?client_id=18128&scope=private_info&redirect_uri=chielchiel.github.io/MMM-SE-Reputation/](https://stackoverflow.com/oauth?client_id=18128&scope=private_info&redirect_uri=chielchiel.github.io/MMM-SE-Reputation/)

After authentication and redirects you will see your code. Copy that code and paste it in the `config` below:

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-SE-Reputation',
            config: {
                authCode: ""
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
