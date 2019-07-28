# Controls

Controls are abstractions of devices or some aspects of devices that are being controlled by hifisparks-iron. Basically anything that will be toggled, adjusted: an LED, a volume control potentiometer, a relay, or anything else. They're outputs, but can be stateful (e.g. the `InputSelector`). They can emit events when their state changes.

Controls have UI interfaces, so a UI component should be available in hifisparks-glitter for each of the controls.

## TODO:

Controls shouldn't initialize hardware, but have readily initialized hardware objects passed to them (e.g. of types `IMotor`, `ISwitch` etc.)
