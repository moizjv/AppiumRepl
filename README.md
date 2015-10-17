Simple REPL (Read-eval-print Loop) for controlling mobile apps through [Appium](appium.io)

Interactively control your apps programmatically, test various JSON WireProtocol bindings.

To get started enter app name along with caps in .appium-repl

eg

```
"TestApp" :
  {
    "deviceName": "iPhone Simulator",
    "app": "<app name>",
    "version": "7.1",
    "newCommandTimeout": 100000,
    "autoLaunch" : "false",
    "platformName":"iOS",
    "device": "iPhone Simulator"
  }
```

Run your appium server and then run `appium-repl`

Enter the name of application you want to test.

Then you can call your driver commands with passing handler for call back. It comes by a in built handler
called handler which needs to be passed.

eg.

```
>>driver.elementByClassName("android.widget.Button",handler);
 > CALL elementByClassName("android.widget.Button")
undefined
>> > RESPONSE elementByClassName("android.widget.Button") {"ELEMENT":"1"}
Returned in current
>>current.click(console.log());
```
If you press tab it will show you all possible options that are available. If a driver command returns a array
then current would become an array.
