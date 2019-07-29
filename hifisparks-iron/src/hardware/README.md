# Hardware

Hardware objects are abstractions of hardware, like I/O pins, motors, rotary encoders, displays, etc.

They need to be stateful most of the time. Inputs are best implemented as event emitters, outputs are best implemented as a collection of functions that toggle their state.

Hardware objects can use other hardware objects, e.g. a motor controller needs several `Pin`s. Don't reimplement the wheel, use available abstactions whenever possible.

### Button

A simple pushbutton. Events a "pressed" event when pressed. Handles debouncing.

### Motors

Different motor controller implementations. They all share the same interface.

### Pins

Instead of having one infinitely configurable `Pin` object, several specialized ones are implemented.

This is better for type safety, since all of them will have a clearly defined interface, so it's more difficult to blow things up by messing up a config. It also helps with portability, since pins can behave in zillions of ways on different boards, and not every type of behaviour will be supported on different platforms.

This way you have a clearly defined interface for inputs (event emitters), output pins (objects with methods), and you don't need to think about the inner working of a `Pin` when using it. Is it an output on a raspberry? Is it on an Arduino? Do you care? Just switch it `.on()`, all you need to know is what it toggles.

## What else?

Not only physical devices, ports or protocols can have facades for them implemented here.
